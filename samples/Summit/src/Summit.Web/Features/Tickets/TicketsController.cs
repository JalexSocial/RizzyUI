using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rizzy.Framework.Mvc;
using Summit.Web.Data;
using Summit.Web.Data.Entities;

namespace Summit.Web.Features.Tickets;

public sealed class TicketsController(SummitDbContext db, TimeProvider clock) : RzController
{
    [HttpGet("/tickets")]
    public async Task<IResult> Index()
    {
        var sold = await db.Attendees.AsNoTracking()
            .Where(a => a.Status != AttendeeStatus.Cancelled)
            .GroupBy(a => a.TicketTypeId)
            .Select(g => new { g.Key, Count = g.Count() })
            .ToDictionaryAsync(g => g.Key, g => g.Count);

        var tickets = (await db.TicketTypes.AsNoTracking().OrderBy(t => t.SortOrder).ToListAsync())
            .Select(t => new TicketOffer(t, sold.GetValueOrDefault(t.Id), clock.GetUtcNow()))
            .ToList();

        var faqs = await db.Faqs.AsNoTracking().Where(f => f.Category == "Tickets").OrderBy(f => f.SortOrder).ToListAsync();
        return View<TicketsPage>(new { Tickets = tickets, Faqs = faqs });
    }
}

/// <summary>A ticket type with its availability right now.</summary>
public sealed record TicketOffer(TicketType Ticket, int Sold, DateTimeOffset Now)
{
    public int Remaining => Math.Max(0, Ticket.Capacity - Sold);
    public bool SoldOut => Remaining == 0;
    public bool NotOnSaleYet => Now < Ticket.SalesStart;
    public bool Available => !SoldOut && !NotOnSaleYet && Now < Ticket.SalesEnd;
    public double PercentSold => Ticket.Capacity == 0 ? 100 : Math.Round(100.0 * Sold / Ticket.Capacity, 1);
}
