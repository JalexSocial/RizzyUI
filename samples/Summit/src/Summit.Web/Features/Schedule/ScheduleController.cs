using Microsoft.AspNetCore.Mvc;
using Rizzy.Framework.Mvc;

namespace Summit.Web.Features.Schedule;

public sealed class ScheduleController : RzController
{
    [HttpGet("/schedule")]
    public IResult Index() => View<SchedulePage>();
}
