using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rizzy.Framework.Mvc;
using Summit.Web.Data;
using Summit.Web.Data.Entities;

namespace Summit.Web.Features.Home;

public sealed class HomeController(SummitDbContext db, ConferenceInfo info, TimeProvider clock) : RzController
{
    [HttpGet("/")]
    public async Task<IResult> Index()
    {
        var model = new HomeModel
        {
            Conference = await info.GetConferenceAsync(),
            Tracks = await info.GetTracksAsync(),
            Sponsors = await info.GetSponsorsAsync(),
            FeaturedSpeakers = await db.Speakers.AsNoTracking()
                .Where(s => s.Featured)
                .Include(s => s.Sessions).ThenInclude(s => s.Session)
                .OrderBy(s => s.Id)
                .ToListAsync(),
            ConferencePass = await db.TicketTypes.AsNoTracking().SingleAsync(t => t.Slug == "conference"),
            OpensAt = await OpeningKeynoteUtcAsync(),
            Now = clock.GetUtcNow(),
        };
        return View<HomePage>(new { Model = model });
    }

    private async Task<DateTimeOffset> OpeningKeynoteUtcAsync()
    {
        var conference = await info.GetConferenceAsync();
        var keynote = await db.Sessions.AsNoTracking().OrderBy(s => s.StartsAt).Select(s => s.StartsAt).FirstAsync();
        var zone = TimeZoneInfo.FindSystemTimeZoneById(conference.TimeZoneId);
        return new DateTimeOffset(keynote, zone.GetUtcOffset(keynote));
    }
}

public sealed class HomeModel
{
    public required Conference Conference { get; init; }
    public required IReadOnlyList<Track> Tracks { get; init; }
    public required IReadOnlyList<Sponsor> Sponsors { get; init; }
    public required IReadOnlyList<Speaker> FeaturedSpeakers { get; init; }
    public required TicketType ConferencePass { get; init; }
    public required DateTimeOffset OpensAt { get; init; }
    public required DateTimeOffset Now { get; init; }
}
