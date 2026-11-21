using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rizzy;
using Rizzy.Framework.Mvc;
using RizzyUI.Services.RzToast;
using Summit.Web.Components.Shared;
using Summit.Web.Data;
using Summit.Web.Infrastructure;

namespace Summit.Web.Features.Agenda;

public sealed class AgendaController(AgendaService agenda, SummitDbContext db, IHtmxSwapService swaps, IRzToastService toasts) : RzController
{
    // The switch posts its form on change. An unchecked checkbox posts nothing, so a missing value is false.
    [HttpPost("/agenda/{sessionId:int}"), ValidateAntiForgeryToken]
    public async Task<IResult> Toggle(int sessionId, [FromForm(Name = "Agenda.Saved")] bool saved = false)
    {
        var session = await db.Sessions.AsNoTracking().SingleOrDefaultAsync(s => s.Id == sessionId);
        if (session is null)
            return Results.NotFound();

        var visitorId = HttpContext.GetOrCreateVisitorId();
        await agenda.SetAsync(visitorId, sessionId, saved);

        // The header count lives outside the form: update it out of band.
        swaps.AddSwappableComponent<AgendaCount>("agenda-count", new { Count = await agenda.CountAsync(visitorId) });
        if (saved)
            toasts.Success($"“{session.Title}” is in your agenda.", "Added to my agenda");
        else
            toasts.Info($"“{session.Title}” was removed from your agenda.", "Removed");

        return PartialView<AgendaToggle>(new { SessionId = sessionId, SessionTitle = session.Title, Saved = saved });
    }
}
