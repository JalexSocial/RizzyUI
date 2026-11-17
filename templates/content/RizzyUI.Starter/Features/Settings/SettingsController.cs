using Microsoft.AspNetCore.Mvc;
using Rizzy;
using Rizzy.Framework.Mvc;
using Rizzy.Htmx;

namespace RizzyUI.Starter.Features.Settings;

public sealed class SettingsController : RzController
{
    [HttpGet("/settings")]
    public IResult Index() => View<SettingsPage>();

    // The form posts with htmx (hx-post) and swaps the response into #settings-form.
    [HttpPost("/settings"), ValidateAntiForgeryToken]
    public IResult Save([FromForm] ProfileSettings profile)
    {
        // A server-side rule on top of the data annotations on ProfileSettings.
        if (string.Equals(profile.DisplayName, "admin", StringComparison.OrdinalIgnoreCase))
            ModelState.AddModelError("Profile.DisplayName", "That name is reserved.");

        if (!ModelState.IsValid)
        {
            // 422 with the form and its errors. htmx 4 swaps 4xx responses into the target.
            Response.Htmx().ValidationFailed();
            return PartialView<SettingsForm>();
        }

        // Save the profile here.
        return PartialView<SettingsForm>(new { Saved = true });
    }
}
