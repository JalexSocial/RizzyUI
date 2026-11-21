namespace Summit.Web.Data.Entities;

public sealed class TicketType
{
    public int Id { get; set; }
    public required string Slug { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public decimal Price { get; set; }
    public int Capacity { get; set; }
    /// <summary>One perk per line.</summary>
    public required string Perks { get; set; }
    public DateTimeOffset SalesStart { get; set; }
    public DateTimeOffset SalesEnd { get; set; }
    public bool IncludesWorkshop { get; set; }
    public int SortOrder { get; set; }

    public IEnumerable<string> PerkList => Perks.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
}

public sealed class DiscountCode
{
    public int Id { get; set; }
    /// <summary>Six letters and digits, upper case (entered with RzInputOTP).</summary>
    public required string Code { get; set; }
    public int Percent { get; set; }
    public int MaxUses { get; set; }
    public int Uses { get; set; }
    public DateTimeOffset ExpiresAt { get; set; }
}

public enum OrderStatus { Paid, Invoiced, Refunded }

public sealed class Order
{
    public int Id { get; set; }
    public required string Number { get; set; }
    public required string BuyerName { get; set; }
    public required string BuyerEmail { get; set; }
    public string? Company { get; set; }
    public required string Country { get; set; }
    public OrderStatus Status { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal Total { get; set; }
    public string? DiscountCode { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public List<Attendee> Attendees { get; set; } = [];
}

public enum AttendeeStatus { Registered, CheckedIn, Cancelled }

public enum TShirtSize { XS, S, M, L, XL, XXL }

public sealed class Attendee
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public int TicketTypeId { get; set; }
    public TicketType TicketType { get; set; } = null!;
    public int? WorkshopSessionId { get; set; }
    public Session? WorkshopSession { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string? Company { get; set; }
    public required string Country { get; set; }
    public TShirtSize TShirt { get; set; }
    public string? AccessibilityNeeds { get; set; }
    /// <summary>Six letters and digits printed on the badge, typed at the check-in desk.</summary>
    public required string BadgeCode { get; set; }
    public AttendeeStatus Status { get; set; }
    public DateTimeOffset? CheckedInAt { get; set; }
    /// <summary>Comma-separated tags set by organizers (VIP, Press, Volunteer, ...).</summary>
    public string? Tags { get; set; }
    public string? Notes { get; set; }
    public DateTimeOffset RegisteredAt { get; set; }
}

/// <summary>A checkout in progress, keyed by the visitor cookie.</summary>
public sealed class CheckoutDraft
{
    public int Id { get; set; }
    public required string VisitorId { get; set; }
    public required string PayloadJson { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}
