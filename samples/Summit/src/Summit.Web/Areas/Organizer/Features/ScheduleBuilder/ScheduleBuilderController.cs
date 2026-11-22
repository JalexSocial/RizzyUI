using Microsoft.AspNetCore.Mvc;
using Rizzy;
using Rizzy.Htmx;
using RizzyUI.Services.RzToast;
using Summit.Web.Infrastructure;

namespace Summit.Web.Areas.Organizer.Features.ScheduleBuilder;

/// <summary>
/// The schedule builder: a session list and an editor. Choosing a session loads the editor and pushes
/// its URL; a save returns the editor and refreshes the list out of band (a track color changes several
/// items); invalid input (room clash, outside conference hours, capacity above the room) is a 422; a
/// delete empties the editor and removes the item out of band.
/// </summary>
public sealed class ScheduleBuilderController(ScheduleBuilder builder, IHtmxSwapService swaps, IRzToastService toasts) : OrganizerController
{
    private const string Base = "/organizer/schedule-builder";

    [HttpGet(Base)]
    public async Task<IResult> Index() =>
        View<ScheduleBuilderPage>(new { Items = await builder.ItemsAsync() });

    // A full page with the session open (direct link, reload, history), or just the editor (htmx).
    [HttpGet(Base + "/sessions/{id:int}")]
    public async Task<IResult> Session(int id)
    {
        var model = await builder.ModelAsync(id);
        if (model is null)
            return Results.NotFound();
        var context = await builder.ContextAsync(id);
        if (!Request.Htmx().IsPartial)
            return View<ScheduleBuilderPage>(new { Items = await builder.ItemsAsync(), SelectedId = (int?)id, Initial = model, Context = context });

        Response.Htmx(h => h.PushUrl($"{Base}/sessions/{id}"));
        // The list again, out of band, so the current item is marked (aria-current).
        swaps.AddSwappableComponent<SessionList>("session-list", new { Items = await builder.ItemsAsync(), SelectedId = (int?)id });
        return PartialView<SessionEditor>(new { Initial = model, Context = context });
    }

    [HttpGet(Base + "/new")]
    public async Task<IResult> New() =>
        PartialView<SessionEditor>(new { Initial = await builder.NewModelAsync(), Context = await builder.ContextAsync(null) });

    [HttpPost(Base + "/sessions"), ValidateAntiForgeryToken]
    public Task<IResult> Create([FromForm(Name = "Model")] SessionEditModel model) => Save(null, model);

    [HttpPost(Base + "/sessions/{id:int}"), ValidateAntiForgeryToken]
    public Task<IResult> Update(int id, [FromForm(Name = "Model")] SessionEditModel model) => Save(id, model);

    private async Task<IResult> Save(int? id, SessionEditModel model)
    {
        if (id is { } existing && await builder.ItemAsync(existing) is null)
            return Results.NotFound();

        if (ModelState.IsValid)
            foreach (var (field, message) in await builder.ValidateAsync(id, model))
                ModelState.AddModelError(field, message);

        if (!ModelState.IsValid)
        {
            Response.ValidationFailedForAnyRequest();
            return PartialView<SessionEditor>(new { Context = await builder.ContextAsync(id) });
        }

        var savedId = await builder.SaveAsync(id, model, User.Identity?.Name ?? "Organizer");
        swaps.AddSwappableComponent<SessionList>("session-list", new { Items = await builder.ItemsAsync(), SelectedId = (int?)savedId });
        toasts.Success($"“{model.Title}” was saved.", "Saved");
        Response.HtmxIfRequested(h => h.PushUrl($"{Base}/sessions/{savedId}"));
        return PartialView<SessionEditor>(new { Initial = await builder.ModelAsync(savedId), Context = await builder.ContextAsync(savedId), Saved = true });
    }

    [HttpPost(Base + "/sessions/{id:int}/delete"), ValidateAntiForgeryToken]
    public async Task<IResult> Delete(int id)
    {
        var title = await builder.DeleteAsync(id, User.Identity?.Name ?? "Organizer");
        if (title is null)
            return Results.NotFound();

        swaps.AddSwappableContent($"session-item-{id}", new Microsoft.AspNetCore.Components.MarkupString(""), SwapStyle.delete);
        toasts.Success($"“{title}” was deleted.", "Deleted");
        Response.HtmxIfRequested(h => h.PushUrl(Base));
        return PartialView<SessionEditorEmpty>();
    }

    [HttpPost(Base + "/publish-all"), ValidateAntiForgeryToken]
    public async Task<IResult> PublishAll()
    {
        var count = await builder.PublishAllAsync(User.Identity?.Name ?? "Organizer");
        swaps.AddSwappableComponent<SessionList>("session-list", new { Items = await builder.ItemsAsync() });
        toasts.Success(count == 0 ? "There were no drafts to publish." : $"{count} {(count == 1 ? "session" : "sessions")} published.", "Publish all");
        // D-29: close only this dialog.
        Response.Htmx(h => h.Trigger("rz:dialog-close", new { id = "publish-confirm" }));
        return PartialView<Components.Shared.Nothing>();
    }
}
