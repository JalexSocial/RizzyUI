using Microsoft.AspNetCore.Mvc;

namespace Summit.Web.Areas.Organizer.Features.Settings;

public sealed class SettingsController : OrganizerController
{
    [HttpGet("/organizer/settings")]
    public IResult Index() => View<SettingsPage>();
}
