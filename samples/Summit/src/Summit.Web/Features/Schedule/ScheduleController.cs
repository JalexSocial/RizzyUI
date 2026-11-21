using Microsoft.AspNetCore.Mvc;
using Rizzy.Framework.Mvc;
using Rizzy.Htmx;
using Summit.Web.Infrastructure;

namespace Summit.Web.Features.Schedule;

public sealed class ScheduleController(ScheduleQuery query) : RzController
{
    [HttpGet("/schedule")]
    public async Task<IResult> Index([FromQuery] ScheduleFilter filter) =>
        View<SchedulePage>(new { Result = await query.RunAsync(filter, HttpContext.GetVisitorId()) });

    // The filter form (hx-get, hx-trigger="change") swaps only the grid and pushes the page URL.
    [HttpGet("/schedule/grid")]
    public async Task<IResult> Grid([FromQuery] ScheduleFilter filter)
    {
        var result = await query.RunAsync(filter, HttpContext.GetVisitorId());
        Response.Htmx(h => h.PushUrl(filter.ToPageUrl()));
        return PartialView<ScheduleGrid>(new { Result = result });
    }
}
