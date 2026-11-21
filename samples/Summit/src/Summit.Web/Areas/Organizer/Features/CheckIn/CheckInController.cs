using Microsoft.AspNetCore.Mvc;

namespace Summit.Web.Areas.Organizer.Features.CheckIn;

public sealed class CheckInController : OrganizerController
{
    [HttpGet("/organizer/check-in")]
    public IResult Index() => View<CheckInPage>();
}
