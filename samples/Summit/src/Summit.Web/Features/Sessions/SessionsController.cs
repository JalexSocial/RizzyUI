using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rizzy.Framework.Mvc;
using Summit.Web.Data;
using Summit.Web.Data.Entities;
using Summit.Web.Features.Agenda;
using Summit.Web.Infrastructure;

namespace Summit.Web.Features.Sessions;

public sealed class SessionsController(SummitDbContext db, AgendaService agenda) : RzController
{
    [HttpGet("/sessions/{slug}")]
    public async Task<IResult> Show(string slug)
    {
        var session = await db.Sessions.AsNoTracking()
            .Include(s => s.Track).Include(s => s.Room).Include(s => s.Day)
            .Include(s => s.Speakers).ThenInclude(s => s.Speaker)
            .SingleOrDefaultAsync(s => s.Slug == slug && s.Status == SessionStatus.Published);
        if (session is null)
            return Results.NotFound();

        var related = await db.Sessions.AsNoTracking()
            .Include(s => s.Room)
            .Where(s => s.TrackId == session.TrackId && s.Id != session.Id && s.Status == SessionStatus.Published)
            .OrderBy(s => s.StartsAt)
            .Take(4)
            .ToListAsync();

        var saved = (await agenda.SessionIdsAsync(HttpContext.GetVisitorId())).Contains(session.Id);
        return View<SessionPage>(new { Session = session, Related = related, Saved = saved, PageUrl = $"{Request.Scheme}://{Request.Host}/sessions/{slug}" });
    }
}
