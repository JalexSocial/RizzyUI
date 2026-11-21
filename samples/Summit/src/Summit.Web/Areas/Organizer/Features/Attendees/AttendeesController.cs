using Microsoft.AspNetCore.Mvc;

namespace Summit.Web.Areas.Organizer.Features.Attendees;

public sealed class AttendeesController : OrganizerController
{
    [HttpGet("/organizer/attendees")]
    public IResult Index() => View<AttendeesPage>();
}
