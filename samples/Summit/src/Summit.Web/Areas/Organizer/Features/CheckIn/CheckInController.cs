using Microsoft.AspNetCore.Mvc;
using Rizzy;
using Rizzy.Htmx;
using RizzyUI.Services.RzToast;
using Summit.Web.Infrastructure;

namespace Summit.Web.Areas.Organizer.Features.CheckIn;

/// <summary>
/// The check-in desk, phones first. A badge code is posted with htmx: the form comes back reset with the
/// result above it; a successful check-in also updates the counter and prepends a row to the recent
/// list, both out of band. An unknown code is a 422 with the field error. The counter polls so a desk
/// sees check-ins made at other desks.
/// </summary>
public sealed class CheckInController(CheckInDesk desk, IHtmxSwapService swaps, IRzToastService toasts) : OrganizerController
{
    [HttpGet("/organizer/check-in")]
    public async Task<IResult> Index() =>
        View<CheckInPage>(new { Count = await desk.CountAsync(), Recent = await desk.RecentAsync() });

    [HttpPost("/organizer/check-in"), ValidateAntiForgeryToken]
    public async Task<IResult> CheckIn([FromForm(Name = "Model")] CheckInModel model)
    {
        if (ModelState.IsValid)
        {
            var outcome = await desk.CheckInAsync(model.BadgeCode!);
            if (outcome is null)
                ModelState.AddModelError("Model.BadgeCode", $"No attendee has the badge code {model.BadgeCode!.ToUpperInvariant()}.");
            else
            {
                var (result, row) = outcome.Value;
                if (row is not null)
                {
                    swaps.AddSwappableComponent<CheckInCounter>("checkin-counter", new { Count = await desk.CountAsync() });
                    swaps.AddSwappableComponent<RecentCheckInRow>("recent-checkins-body", new { Row = row }, SwapStyle.afterbegin);
                    toasts.Success($"{result.Name} is checked in.", "Welcome");
                }
                // A fresh, empty form with the result above it.
                return PartialView<CheckInForm>(new { Result = result, Reset = true });
            }
        }

        Response.ValidationFailedForAnyRequest();
        return PartialView<CheckInForm>();
    }

    [HttpGet("/organizer/check-in/counter")]
    public async Task<IResult> Counter() => PartialView<CheckInCounter>(new { Count = await desk.CountAsync() });
}
