using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Summit.Web.Data;
using Summit.Web.Data.Entities;

namespace Summit.Web.Areas.Organizer.Features.Dashboard;

/// <summary>The dashboard's filters: a date range (inclusive, in UTC days) and an optional ticket type.</summary>
public sealed class DashboardFilter
{
    public DateOnly? From { get; set; }
    public DateOnly? To { get; set; }
    public string? Ticket { get; set; }

    /// <summary>Fills in the default range (the last 30 days) and puts the dates in order.</summary>
    public DashboardFilter Normalize(DateOnly today)
    {
        var to = To ?? today;
        var from = From ?? to.AddDays(-29);
        if (from > to) (from, to) = (to, from);
        return new DashboardFilter { From = from, To = to, Ticket = string.IsNullOrWhiteSpace(Ticket) ? null : Ticket };
    }

    public string Query()
    {
        var parts = new List<string> { $"from={From:yyyy-MM-dd}", $"to={To:yyyy-MM-dd}" };
        if (Ticket is not null) parts.Add($"ticket={Uri.EscapeDataString(Ticket)}");
        return string.Join("&", parts);
    }
}

public sealed record DashboardStats(decimal Revenue, int Tickets, int CheckedIn, decimal AverageOrder, int Orders);
public sealed record DailyPoint(DateOnly Day, int Tickets);
public sealed record NamedCount(string Name, int Count);
public sealed record CapacityRow(string Name, int Sold, int Capacity);
public sealed record OrderRow(string Number, string Buyer, string Country, string Ticket, int Tickets, decimal Total, OrderStatus Status, DateTimeOffset CreatedAt);
public sealed record OrderPage(IReadOnlyList<OrderRow> Rows, int Page, int Pages, int Total, DashboardFilter Filter);

public sealed record DashboardPanels(
    DashboardFilter Filter,
    DashboardStats Stats,
    IReadOnlyList<DailyPoint> Daily,
    IReadOnlyList<NamedCount> ByTicket,
    IReadOnlyList<NamedCount> ByCountry,
    IReadOnlyList<CapacityRow> Capacity,
    OrderPage Orders)
{
    public bool IsEmpty => Stats.Orders == 0;
}

public sealed class DashboardQuery(SummitDbContext db, TimeProvider clock)
{
    public const int OrdersPerPage = 8;

    public DateOnly Today => DateOnly.FromDateTime(clock.GetUtcNow().UtcDateTime);

    public Task<List<TicketType>> TicketTypesAsync() => db.TicketTypes.AsNoTracking().OrderBy(t => t.SortOrder).ToListAsync();

    /// <summary>Orders in the range (refunds excluded), with attendees and ticket types.</summary>
    private async Task<List<Order>> OrdersAsync(DashboardFilter filter)
    {
        // SQLite stores DateTimeOffset as ticks here, so the range is applied in memory after a coarse load.
        var orders = await db.Orders.AsNoTracking()
            .Include(o => o.Attendees).ThenInclude(a => a.TicketType)
            .Where(o => o.Status != OrderStatus.Refunded)
            .ToListAsync();
        var from = filter.From!.Value;
        var to = filter.To!.Value;
        return orders
            .Where(o => DateOnly.FromDateTime(o.CreatedAt.UtcDateTime) is var day && day >= from && day <= to)
            .Where(o => filter.Ticket is null || o.Attendees.Any(a => a.TicketType.Slug == filter.Ticket))
            .OrderByDescending(o => o.CreatedAt)
            .ToList();
    }

    public async Task<DashboardPanels> PanelsAsync(DashboardFilter filter)
    {
        var orders = await OrdersAsync(filter);
        var attendees = orders.SelectMany(o => o.Attendees)
            .Where(a => filter.Ticket is null || a.TicketType.Slug == filter.Ticket)
            .Where(a => a.Status != AttendeeStatus.Cancelled)
            .ToList();

        var revenue = orders.Sum(o => o.Total);
        var stats = new DashboardStats(
            revenue, attendees.Count, attendees.Count(a => a.Status == AttendeeStatus.CheckedIn),
            orders.Count == 0 ? 0 : Math.Round(revenue / orders.Count, 2), orders.Count);

        var byDay = attendees.GroupBy(a => DateOnly.FromDateTime(a.RegisteredAt.UtcDateTime)).ToDictionary(g => g.Key, g => g.Count());
        var daily = new List<DailyPoint>();
        for (var day = filter.From!.Value; day <= filter.To!.Value; day = day.AddDays(1))
            daily.Add(new DailyPoint(day, byDay.GetValueOrDefault(day)));

        var byTicket = attendees.GroupBy(a => (a.TicketType.SortOrder, a.TicketType.Name))
            .OrderBy(g => g.Key.SortOrder).Select(g => new NamedCount(g.Key.Name, g.Count())).ToList();
        var byCountry = orders.GroupBy(o => o.Country).Select(g => new NamedCount(g.Key, g.Count()))
            .OrderByDescending(c => c.Count).ThenBy(c => c.Name).Take(8).ToList();

        return new DashboardPanels(filter, stats, daily, byTicket, byCountry, await CapacityAsync(), Page(orders, filter, 1));
    }

    public async Task<OrderPage> OrdersPageAsync(DashboardFilter filter, int page) => Page(await OrdersAsync(filter), filter, page);

    /// <summary>Sold seats per ticket type over the whole sale (not the range): capacity is a total.</summary>
    private async Task<IReadOnlyList<CapacityRow>> CapacityAsync()
    {
        var types = await TicketTypesAsync();
        var sold = await db.Attendees.AsNoTracking().Where(a => a.Status != AttendeeStatus.Cancelled)
            .GroupBy(a => a.TicketTypeId).Select(g => new { g.Key, Count = g.Count() }).ToDictionaryAsync(g => g.Key, g => g.Count);
        return types.Select(t => new CapacityRow(t.Name, sold.GetValueOrDefault(t.Id), t.Capacity)).ToList();
    }

    private static OrderPage Page(List<Order> orders, DashboardFilter filter, int page)
    {
        var pages = Math.Max(1, (int)Math.Ceiling(orders.Count / (double)OrdersPerPage));
        page = Math.Clamp(page, 1, pages);
        var rows = orders.Skip((page - 1) * OrdersPerPage).Take(OrdersPerPage)
            .Select(o => new OrderRow(
                o.Number, o.BuyerName, o.Country,
                o.Attendees.Select(a => a.TicketType.Name).Distinct().FirstOrDefault() ?? "",
                o.Attendees.Count, o.Total, o.Status, o.CreatedAt))
            .ToList();
        return new OrderPage(rows, page, pages, orders.Count, filter);
    }
}

public static class DashboardFormat
{
    public static string Day(DateOnly day) => day.ToString("d MMM", CultureInfo.CurrentCulture);
}
