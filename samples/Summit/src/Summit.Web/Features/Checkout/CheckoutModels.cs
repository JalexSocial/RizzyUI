using System.ComponentModel.DataAnnotations;
using System.Globalization;
using Summit.Web.Data.Entities;

namespace Summit.Web.Features.Checkout;

/// <summary>The checkout steps, in order.</summary>
public enum CheckoutStep { Tickets, Attendees, Payment, Done }

public static class CheckoutSteps
{
    public static string Slug(this CheckoutStep step) => step.ToString().ToLowerInvariant();

    public static bool TryParse(string? slug, out CheckoutStep step) =>
        Enum.TryParse(slug, ignoreCase: true, out step) && step != CheckoutStep.Done;

    public static string Title(this CheckoutStep step) => step switch
    {
        CheckoutStep.Tickets => "Tickets",
        CheckoutStep.Attendees => "Attendees",
        CheckoutStep.Payment => "Payment",
        _ => "Done",
    };
}

/// <summary>Optional extras, priced per ticket or per order.</summary>
public sealed record AddOn(string Id, string Name, string Description, decimal Price, bool PerTicket);

public static class CheckoutCatalog
{
    public static readonly AddOn[] AddOns =
    [
        new("materials", "Printed workshop materials", "A bound copy of every workshop's handout.", 19m, PerTicket: true),
        new("offset", "Offset your travel", "We buy certified carbon removal for an average trip.", 12m, PerTicket: true),
        new("party-guest", "Bring a guest to the party", "One extra wristband for the evening party on day 2.", 39m, PerTicket: false),
    ];

    public const int MaxTicketsPerOrder = 5;

    /// <summary>Country names in English, for the country combobox.</summary>
    public static readonly string[] Countries = CultureInfo.GetCultures(CultureTypes.SpecificCultures)
        .Select(c => { try { return new RegionInfo(c.Name).EnglishName; } catch (ArgumentException) { return null; } })
        .Where(n => n is not null)
        .Select(n => n!)
        .Distinct()
        .Order(StringComparer.Ordinal)
        .ToArray();
}

/// <summary>What the visitor has entered so far, stored as JSON in CheckoutDraft.</summary>
public sealed class CheckoutData
{
    public string? Ticket { get; set; }
    public int Quantity { get; set; } = 1;
    public List<string> AddOns { get; set; } = [];
    public List<AttendeeInput> Attendees { get; set; } = [];
    public string? DiscountCode { get; set; }
    public CheckoutStep Reached { get; set; } = CheckoutStep.Tickets;
}

public sealed class TicketsStepModel
{
    [Required(ErrorMessage = "Choose a ticket.")]
    [Display(Name = "Ticket")]
    public string? Ticket { get; set; }

    [Range(1, CheckoutCatalog.MaxTicketsPerOrder, ErrorMessage = "Buy between 1 and 5 tickets per order. For larger groups, contact us.")]
    [Display(Name = "Number of tickets")]
    public int Quantity { get; set; } = 1;

    [Display(Name = "Add-ons")]
    public IList<string> AddOns { get; set; } = new List<string>();
}

public sealed class AttendeesStepModel
{
    public List<AttendeeInput> Attendees { get; set; } = [];
}

public sealed class AttendeeInput
{
    [Required(ErrorMessage = "Enter the attendee's name.")]
    [StringLength(100)]
    [Display(Name = "Full name")]
    public string? Name { get; set; }

    [Required(ErrorMessage = "Enter an email address for the ticket.")]
    [EmailAddress(ErrorMessage = "Enter a valid email address.")]
    [Display(Name = "Email")]
    public string? Email { get; set; }

    [Display(Name = "Company")]
    public string? Company { get; set; }

    [Required(ErrorMessage = "Choose a country.")]
    [Display(Name = "Country")]
    public string? Country { get; set; }

    [Display(Name = "T-shirt size")]
    public TShirtSize TShirt { get; set; } = TShirtSize.M;

    [Display(Name = "Workshop")]
    public int? WorkshopSessionId { get; set; }

    [StringLength(500)]
    [Display(Name = "Accessibility needs")]
    public string? AccessibilityNeeds { get; set; }
}

public sealed class PaymentStepModel
{
    [Required(ErrorMessage = "Choose how you want to pay.")]
    [Display(Name = "Payment method")]
    public string? PaymentMethod { get; set; }

    [Range(typeof(bool), "true", "true", ErrorMessage = "Accept the code of conduct to continue.")]
    [Display(Name = "I accept the code of conduct")]
    public bool AcceptCodeOfConduct { get; set; }

    [Display(Name = "Send me the newsletter")]
    public bool Newsletter { get; set; }
}

public sealed class DiscountModel
{
    [Required(ErrorMessage = "Enter the six-character code.")]
    [StringLength(6, MinimumLength = 6, ErrorMessage = "Discount codes have six letters and digits.")]
    [Display(Name = "Discount code")]
    public string? Code { get; set; }
}

/// <summary>The priced order for the summary panel.</summary>
public sealed record CheckoutQuote(
    TicketType? Ticket, int Quantity, IReadOnlyList<(AddOn AddOn, decimal Amount)> AddOns,
    decimal Subtotal, string? DiscountCode, int DiscountPercent, decimal Discount, decimal Total);
