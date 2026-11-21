using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using RizzyUI;
using Summit.Web.Data;
using Summit.Web.Data.Entities;

namespace Summit.Web.Areas.Organizer.Features.Attendees;

/// <summary>
/// One attendee as the table sees it. RzDataTable serializes every property of every row into the page
/// (RZUI-033), so this DTO carries only what the table shows: no badge code, no accessibility notes.
/// </summary>
public sealed record AttendeeRow(string Id, string Name, string Email, string Company, string Country, string Ticket, string Status, string Tags, string Registered);

/// <summary>
/// The table's client state, posted back by the hidden inputs of the AttendeeTableState component (summit-findings.md
/// SF-001: RzDataTable has no way to send its own state with a request). The server rebuilds the table
/// with the same sort, page, filter and visible columns.
/// </summary>
public sealed class AttendeeTableRequest
{
    public string? Sort { get; set; }
    public bool Desc { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; } = 10;
    /// <summary>
    /// The table's search text. Not called Filter: a query key that matches an action parameter's name
    /// ("filter") makes MVC bind that parameter with the key as prefix, so Status and Ticket were lost (SF-051).
    /// </summary>
    public string? Search { get; set; }
    /// <summary>Comma-separated ids of hidden columns.</summary>
    public string? Hidden { get; set; }
    /// <summary>Comma-separated ids of selected rows (used by bulk actions).</summary>
    public string? Selected { get; set; }

    public RzDataTableInitialState ToInitialState() => new()
    {
        Sorting = string.IsNullOrEmpty(Sort) ? [new RzSortDescriptor { Id = "Registered", Desc = true }] : [new RzSortDescriptor { Id = Sort, Desc = Desc }],
        Pagination = new RzPaginationState { PageIndex = Math.Max(0, Page), PageSize = PageSize is 10 or 25 or 50 ? PageSize : 10 },
        GlobalFilter = string.IsNullOrWhiteSpace(Search) ? null : Search,
        ColumnVisibility = (Hidden ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries).ToDictionary(id => id, _ => false),
    };

    public IReadOnlyList<int> SelectedIds =>
        (Selected ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(id => int.TryParse(id.Replace("a-", ""), out var n) ? n : 0).Where(n => n > 0).ToList();
}

/// <summary>Server-side filters (the table filters the rest in the browser).</summary>
public sealed class AttendeeServerFilter
{
    public string? Status { get; set; }
    public string? Ticket { get; set; }
}

public sealed class AttendeeEditModel
{
    [Required(ErrorMessage = "Enter a name.")]
    [StringLength(100)]
    [Display(Name = "Name")]
    public string? Name { get; set; }

    [Required(ErrorMessage = "Enter an email address.")]
    [EmailAddress(ErrorMessage = "Enter a valid email address.")]
    [Display(Name = "Email")]
    public string? Email { get; set; }

    [Display(Name = "Company")]
    public string? Company { get; set; }

    [Display(Name = "Ticket")]
    public int TicketTypeId { get; set; }

    [Display(Name = "Status")]
    public AttendeeStatus Status { get; set; }

    [Display(Name = "Tags")]
    public List<string> Tags { get; set; } = [];

    [StringLength(1000)]
    [Display(Name = "Notes for the team")]
    public string? Notes { get; set; }
}

public sealed class AttendeeQuery(SummitDbContext db)
{
    public static readonly string[] Statuses = Enum.GetNames<AttendeeStatus>();

    /// <summary>The tags the editor suggests; organizers can type new ones.</summary>
    public static IReadOnlyList<string> KnownTags => Data.Seeding.SeedContent.AttendeeTags;

    public async Task<IReadOnlyList<AttendeeRow>> RowsAsync(AttendeeServerFilter filter)
    {
        var query = db.Attendees.AsNoTracking().Include(a => a.TicketType).AsQueryable();
        if (Enum.TryParse<AttendeeStatus>(filter.Status, out var status))
            query = query.Where(a => a.Status == status);
        if (!string.IsNullOrEmpty(filter.Ticket))
            query = query.Where(a => a.TicketType.Slug == filter.Ticket);

        var attendees = await query.ToListAsync();
        return attendees
            .OrderByDescending(a => a.RegisteredAt)
            .Select(a => new AttendeeRow(
                $"a-{a.Id}", a.Name, a.Email, a.Company ?? "", a.Country, a.TicketType.Name, a.Status.ToString(), a.Tags ?? "",
                a.RegisteredAt.ToString("yyyy-MM-dd")))
            .ToList();
    }

    public Task<List<TicketType>> TicketTypesAsync() => db.TicketTypes.AsNoTracking().OrderBy(t => t.SortOrder).ToListAsync();
}
