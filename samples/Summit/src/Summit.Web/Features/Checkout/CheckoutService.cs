using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Summit.Web.Data;
using Summit.Web.Data.Entities;

namespace Summit.Web.Features.Checkout;

/// <summary>The checkout draft (per visitor), pricing, availability checks and placing the order.</summary>
public sealed class CheckoutService(SummitDbContext db, TimeProvider clock)
{
    private const string BadgeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    public async Task<CheckoutData> LoadAsync(string visitorId)
    {
        var draft = await db.CheckoutDrafts.AsNoTracking().SingleOrDefaultAsync(d => d.VisitorId == visitorId);
        return draft is null ? new CheckoutData() : JsonSerializer.Deserialize<CheckoutData>(draft.PayloadJson) ?? new CheckoutData();
    }

    public async Task SaveAsync(string visitorId, CheckoutData data)
    {
        var draft = await db.CheckoutDrafts.SingleOrDefaultAsync(d => d.VisitorId == visitorId);
        if (draft is null)
        {
            draft = new CheckoutDraft { VisitorId = visitorId, PayloadJson = "" };
            db.CheckoutDrafts.Add(draft);
        }
        draft.PayloadJson = JsonSerializer.Serialize(data);
        draft.UpdatedAt = clock.GetUtcNow();
        await db.SaveChangesAsync();
    }

    public async Task ClearAsync(string visitorId)
    {
        await db.CheckoutDrafts.Where(d => d.VisitorId == visitorId).ExecuteDeleteAsync();
    }

    public Task<List<TicketType>> TicketTypesAsync() =>
        db.TicketTypes.AsNoTracking().OrderBy(t => t.SortOrder).ToListAsync();

    public async Task<Dictionary<int, int>> SoldAsync() =>
        await db.Attendees.AsNoTracking()
            .Where(a => a.Status != AttendeeStatus.Cancelled)
            .GroupBy(a => a.TicketTypeId)
            .Select(g => new { g.Key, Count = g.Count() })
            .ToDictionaryAsync(g => g.Key, g => g.Count);

    /// <summary>Why a ticket cannot be bought in this quantity right now, or null.</summary>
    public async Task<string?> AvailabilityProblemAsync(string? slug, int quantity)
    {
        var ticket = await db.TicketTypes.AsNoTracking().SingleOrDefaultAsync(t => t.Slug == slug);
        if (ticket is null) return "Choose a ticket.";
        var now = clock.GetUtcNow();
        if (now < ticket.SalesStart) return $"{ticket.Name} tickets are not on sale yet.";
        if (now >= ticket.SalesEnd) return $"{ticket.Name} tickets are no longer on sale.";
        var sold = (await SoldAsync()).GetValueOrDefault(ticket.Id);
        var remaining = ticket.Capacity - sold;
        if (remaining <= 0) return $"{ticket.Name} tickets are sold out.";
        if (quantity > remaining) return $"Only {remaining} {ticket.Name} tickets are left.";
        return null;
    }

    public Task<List<Session>> WorkshopsAsync() =>
        db.Sessions.AsNoTracking().Include(s => s.Day)
            .Where(s => s.Format == SessionFormat.Workshop && s.Status == SessionStatus.Published)
            .OrderBy(s => s.StartsAt).ToListAsync();

    public async Task<Dictionary<int, int>> WorkshopSeatsTakenAsync() =>
        await db.Attendees.AsNoTracking()
            .Where(a => a.WorkshopSessionId != null && a.Status != AttendeeStatus.Cancelled)
            .GroupBy(a => a.WorkshopSessionId!.Value)
            .Select(g => new { g.Key, Count = g.Count() })
            .ToDictionaryAsync(g => g.Key, g => g.Count);

    /// <summary>Checks a discount code. Returns the percentage, or an error message.</summary>
    public async Task<(int Percent, string? Error)> CheckDiscountAsync(string? code)
    {
        var normalized = code?.Trim().ToUpperInvariant();
        var discount = await db.DiscountCodes.AsNoTracking().SingleOrDefaultAsync(d => d.Code == normalized);
        if (discount is null) return (0, "That code doesn't exist. Check for typos (codes have no O or I).");
        if (discount.ExpiresAt <= clock.GetUtcNow()) return (0, $"The code {discount.Code} has expired.");
        if (discount.Uses >= discount.MaxUses) return (0, $"The code {discount.Code} has been used up.");
        return (discount.Percent, null);
    }

    public async Task<CheckoutQuote> QuoteAsync(CheckoutData data)
    {
        var ticket = data.Ticket is null ? null : await db.TicketTypes.AsNoTracking().SingleOrDefaultAsync(t => t.Slug == data.Ticket);
        var quantity = Math.Max(1, data.Quantity);
        var addOns = CheckoutCatalog.AddOns.Where(a => data.AddOns.Contains(a.Id))
            .Select(a => (a, a.PerTicket ? a.Price * quantity : a.Price)).ToList();
        var subtotal = (ticket?.Price ?? 0m) * quantity + addOns.Sum(a => a.Item2);

        var percent = 0;
        if (data.DiscountCode is not null)
        {
            var (p, error) = await CheckDiscountAsync(data.DiscountCode);
            percent = error is null ? p : 0;
        }
        var discount = Math.Round(subtotal * percent / 100m, 2);
        return new CheckoutQuote(ticket, quantity, addOns, subtotal, percent > 0 ? data.DiscountCode : null, percent, discount, subtotal - discount);
    }

    /// <summary>Creates the order and its attendees. Returns the order, or an error if a ticket sold out meanwhile.</summary>
    public async Task<(Order? Order, string? Error)> PlaceOrderAsync(string visitorId, CheckoutData data, PaymentStepModel payment)
    {
        var problem = await AvailabilityProblemAsync(data.Ticket, data.Quantity);
        if (problem is not null)
            return (null, problem);

        var quote = await QuoteAsync(data);
        var ticket = quote.Ticket!;
        var now = clock.GetUtcNow();
        var buyer = data.Attendees[0];
        var number = $"SMT-{1001 + await db.Orders.CountAsync()}";

        var order = new Order
        {
            Number = number,
            BuyerName = buyer.Name!,
            BuyerEmail = buyer.Email!,
            Company = buyer.Company,
            Country = buyer.Country!,
            Status = payment.PaymentMethod == "invoice" ? OrderStatus.Invoiced : OrderStatus.Paid,
            Subtotal = quote.Subtotal,
            Discount = quote.Discount,
            Total = quote.Total,
            DiscountCode = quote.DiscountCode,
            AddOns = data.AddOns.Count == 0 ? null : string.Join(",", data.AddOns),
            PaymentMethod = payment.PaymentMethod,
            VisitorId = visitorId,
            CreatedAt = now,
        };

        var taken = await db.Attendees.Select(a => a.BadgeCode).ToListAsync();
        var codes = taken.ToHashSet();
        foreach (var input in data.Attendees.Take(data.Quantity))
        {
            order.Attendees.Add(new Attendee
            {
                Name = input.Name!, Email = input.Email!, Company = input.Company, Country = input.Country!,
                TicketTypeId = ticket.Id, WorkshopSessionId = ticket.IncludesWorkshop ? input.WorkshopSessionId : null,
                TShirt = input.TShirt, AccessibilityNeeds = input.AccessibilityNeeds,
                BadgeCode = NewBadgeCode(codes), Status = AttendeeStatus.Registered, RegisteredAt = now,
            });
        }

        if (quote.DiscountCode is not null)
            await db.DiscountCodes.Where(d => d.Code == quote.DiscountCode).ExecuteUpdateAsync(u => u.SetProperty(d => d.Uses, d => d.Uses + 1));

        db.Orders.Add(order);
        db.AuditEvents.Add(new AuditEvent
        {
            At = now, Actor = "Website", Action = "order.created", EntityType = "Order", EntityId = number,
            Summary = $"Order {number}: {data.Quantity} × {ticket.Name} ({quote.Total:0.00} EUR)",
        });
        await db.SaveChangesAsync();
        await ClearAsync(visitorId);
        return (order, null);
    }

    public Task<Order?> FindOrderAsync(string number, string? visitorId) =>
        db.Orders.AsNoTracking()
            .Include(o => o.Attendees).ThenInclude(a => a.TicketType)
            .Include(o => o.Attendees).ThenInclude(a => a.WorkshopSession)
            .SingleOrDefaultAsync(o => o.Number == number && o.VisitorId != null && o.VisitorId == visitorId);

    private static string NewBadgeCode(HashSet<string> taken)
    {
        while (true)
        {
            var code = new string(Enumerable.Range(0, 6).Select(_ => BadgeAlphabet[Random.Shared.Next(BadgeAlphabet.Length)]).ToArray());
            if (taken.Add(code)) return code;
        }
    }
}
