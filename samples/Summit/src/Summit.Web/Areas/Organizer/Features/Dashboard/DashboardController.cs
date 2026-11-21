using Microsoft.AspNetCore.Mvc;

namespace Summit.Web.Areas.Organizer.Features.Dashboard;

public sealed class DashboardController : OrganizerController
{
    [HttpGet("/organizer")]
    public IResult Index() => View<DashboardPage>();
}
