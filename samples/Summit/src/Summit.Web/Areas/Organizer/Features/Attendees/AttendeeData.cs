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
/// <param name="EditUrl">The editor's URL, for the row's hx-get (rows are rendered by Alpine; RzDataTable processes their hx-* attributes).</param>
public sealed record AttendeeRow(string Id, string Name, string Email, string Company, string Country, string Ticket, string Status, string Tags, string Registered, string EditUrl);

/// <summary>
/// The attendees table's state, posted by RzDataTable's state input (RzDataTableState, decision D-31),
/// with Summit's defaults and limits: newest registrations first, page sizes 10, 25 and 50.
/// </summary>
public static class AttendeeTableStates
{
    public static RzDataTableInitialState ToInitialState(RzDataTableState? state, bool firstPage = false) => new()
    {
        Sorting = state?.Sorting is { Count: > 0 } sorting ? sorting : [new RzSortDescriptor { Id = "Registered", Desc = true }],
        Pagination = new RzPaginationState
        {
            PageIndex = firstPage ? 0 : Math.Max(0, state?.Pagination?.PageIndex ?? 0),
            PageSize = state?.Pagination?.PageSize is 10 or 25 or 50 ? state.Pagination.PageSize : 10,
        },
        GlobalFilter = string.IsNullOrWhiteSpace(state?.GlobalFilter) ? null : state.GlobalFilter,
        ColumnVisibility = state?.ColumnVisibility ?? [],
    };

    /// <summary>The attendee ids of the selected rows (row ids are "a-{id}").</summary>
    public static IReadOnlyList<int> SelectedIds(RzDataTableState? state) =>
        (state?.SelectedRowIds ?? []).Select(id => int.TryParse(id.Replace("a-", ""), out var n) ? n : 0).Where(n => n > 0).ToList();
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
                a.RegisteredAt.ToString("yyyy-MM-dd"), $"/organizer/attendees/{a.Id}/edit"))
            .ToList();
    }

    public Task<List<TicketType>> TicketTypesAsync() => db.TicketTypes.AsNoTracking().OrderBy(t => t.SortOrder).ToListAsync();
}
