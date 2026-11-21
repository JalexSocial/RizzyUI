using Microsoft.AspNetCore.Mvc;

namespace Summit.Web.Areas.Organizer.Features.ScheduleBuilder;

public sealed class ScheduleBuilderController : OrganizerController
{
    [HttpGet("/organizer/schedule-builder")]
    public IResult Index() => View<ScheduleBuilderPage>();
}
