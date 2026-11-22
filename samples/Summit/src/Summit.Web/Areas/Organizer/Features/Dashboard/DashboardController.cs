using Microsoft.AspNetCore.Mvc;
using Rizzy;
using Rizzy.Htmx;
using Summit.Web.Infrastructure;

namespace Summit.Web.Areas.Organizer.Features.Dashboard;

/// <summary>
/// The dashboard. The page renders the filters and skeletons; the panels load with one request
/// (hx-trigger="load") that returns the charts and, out of band, the stats, capacity and orders, so
/// every region reflects the same filter. A filter change repeats that request and pushes the URL.
/// </summary>
public sealed class DashboardController(DashboardQuery query, IHtmxSwapService swaps) : OrganizerController
{
    [HttpGet("/organizer")]
    public async Task<IResult> Index([FromQuery] DashboardFilter filter) =>
        View<DashboardPage>(new { Filter = filter.Normalize(query.Today), Today = query.Today, TicketTypes = await query.TicketTypesAsync() });

    [HttpGet("/organizer/dashboard/panels")]
    public async Task<IResult> Panels([FromQuery] DashboardFilter filter, [FromQuery] bool push = false)
    {
        filter = filter.Normalize(query.Today);
        var panels = await query.PanelsAsync(filter);
        swaps.AddSwappableComponent<DashboardStatsPanel>("dashboard-stats", new { Panels = panels });
        swaps.AddSwappableComponent<DashboardCapacity>("dashboard-capacity", new { Rows = panels.Capacity });
        swaps.AddSwappableComponent<RecentOrders>("recent-orders", new { Orders = panels.Orders });
        // The filter form asks for a pushed URL (hx-vals); the first load does not add a history entry.
        if (push)
            Response.Htmx(h => h.PushUrl($"/organizer?{filter.Query()}"));
        return PartialView<DashboardCharts>(new { Panels = panels });
    }

    [HttpGet("/organizer/dashboard/orders")]
    public async Task<IResult> Orders([FromQuery] DashboardFilter filter, [FromQuery] int page = 1) =>
        PartialView<RecentOrders>(new { Orders = await query.OrdersPageAsync(filter.Normalize(query.Today), page) });
}
