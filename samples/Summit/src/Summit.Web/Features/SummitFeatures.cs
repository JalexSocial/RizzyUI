using Microsoft.EntityFrameworkCore;
using Rizzy;
using Summit.Web.Data;
using Summit.Web.Data.Entities;
using Summit.Web.Features.Agenda;
using Summit.Web.Features.Home;
using Summit.Web.Features.Schedule;
using Summit.Web.Features.Search;
using Summit.Web.Infrastructure;

namespace Summit.Web.Features;

/// <summary>Registration for feature services and the minimal-API fragment endpoints.</summary>
public static class SummitFeatures
{
    public static IServiceCollection AddSummitFeatures(this IServiceCollection services)
    {
        services.AddScoped<ConferenceInfo>();
        services.AddScoped<AgendaService>();
        services.AddScoped<ScheduleQuery>();
        services.AddScoped<SearchIndex>();
        services.AddScoped<Checkout.CheckoutService>();
        services.AddScoped<Areas.Organizer.Features.Attendees.AttendeeQuery>();
        services.AddScoped<Areas.Organizer.Features.Dashboard.DashboardQuery>();
        services.AddScoped<Areas.Organizer.Features.CheckIn.CheckInDesk>();
        services.AddScoped<Areas.Organizer.Features.ScheduleBuilder.ScheduleBuilder>();
        return services;
    }

    /// <summary>
    /// Read-only fragments and JSON, served by minimal APIs (IRizzyService). Pages and anything that
    /// writes are MVC controllers. See docs/engineering/summit-demo-plan.md, section 3.4.
    /// </summary>
    public static IEndpointRouteBuilder MapSummitFragments(this IEndpointRouteBuilder endpoints)
    {
        var fragments = endpoints.MapGroup("/fragments");

        // Home page statistics, loaded when the strip scrolls into view (hx-trigger="intersect once").
        fragments.MapGet("/home/stats", async (SummitDbContext db, IRizzyService rizzy) =>
        {
            var stats = new HomeStats.Numbers(
                Speakers: await db.Speakers.CountAsync(),
                Sessions: await db.Sessions.CountAsync(s => s.Status == SessionStatus.Published),
                Attendees: await db.Attendees.CountAsync(a => a.Status != AttendeeStatus.Cancelled),
                Countries: await db.Attendees.Select(a => a.Country).Distinct().CountAsync());
            return rizzy.PartialView<HomeStats>(new { Stats = stats });
        });

        // A session's details, rendered as an open sheet (the schedule's "Details" buttons).
        fragments.MapGet("/sessions/{id:int}/details", async (int id, SummitDbContext db, IRizzyService rizzy) =>
        {
            var session = await LoadSessionAsync(db, id);
            return session is null ? Results.NotFound() : rizzy.PartialView<SessionDetails>(new { Session = session });
        });

        // The same card the schedule page renders, from a minimal API: both render paths must match.
        fragments.MapGet("/sessions/{id:int}/card", async (int id, HttpContext context, SummitDbContext db, AgendaService agenda, IRizzyService rizzy) =>
        {
            var session = await LoadSessionAsync(db, id);
            if (session is null)
                return Results.NotFound();
            var saved = (await agenda.SessionIdsAsync(context.GetVisitorId())).Contains(id);
            return rizzy.PartialView<SessionCard>(new { Session = session, Saved = saved });
        });

        // Search palette items (RzCommand ItemsUrl with ServerFiltering: ?q=...). JSON, not HTML.
        endpoints.MapGet("/api/search", async (string? q, SearchIndex index) => Results.Json(await index.SearchAsync(q)));

        return endpoints;
    }

    private static Task<Session?> LoadSessionAsync(SummitDbContext db, int id) =>
        db.Sessions.AsNoTracking()
            .Include(s => s.Track).Include(s => s.Room).Include(s => s.Day)
            .Include(s => s.Speakers).ThenInclude(s => s.Speaker)
            .SingleOrDefaultAsync(s => s.Id == id && s.Status == SessionStatus.Published);
}
