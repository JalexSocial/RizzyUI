using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Rizzy;
using Rizzy.Htmx;
using RizzyUI.Services.RzToast;
using Summit.Web.Data;
using Summit.Web.Data.Entities;
using Summit.Web.Infrastructure;

namespace Summit.Web.Areas.Organizer.Features.Attendees;

/// <summary>
/// Attendees: an RzDataTable (sorting, filtering, paging, selection and column visibility in the
/// browser), server filters that rebuild the table, an editor in a sheet, and bulk actions. Every
/// rebuild carries the table's client state (the AttendeeTableState component) so the organizer keeps their place.
/// </summary>
public sealed class AttendeesController(SummitDbContext db, AttendeeQuery query, IHtmxSwapService swaps, IRzToastService toasts, TimeProvider clock) : OrganizerController
{
    [HttpGet("/organizer/attendees")]
    public async Task<IResult> Index([FromQuery] AttendeeServerFilter filter, [FromQuery] AttendeeTableRequest state) =>
        View<AttendeesPage>(new { Table = await TableAsync(filter, state), Filter = filter, TicketTypes = await query.TicketTypesAsync() });

    // Server filters (status, ticket): rebuild the table with the client state sent along.
    [HttpGet("/organizer/attendees/table")]
    public async Task<IResult> Table([FromQuery] AttendeeServerFilter filter, [FromQuery] AttendeeTableRequest state)
    {
        Response.HtmxIfRequested(h => h.PushUrl(PageUrl(filter)));
        state.Page = 0; // a different set of rows starts on its first page
        return PartialView<AttendeeTable>(new { Model = await TableAsync(filter, state) });
    }

    [HttpGet("/organizer/attendees/{id:int}/edit")]
    public async Task<IResult> Edit(int id)
    {
        var attendee = await db.Attendees.AsNoTracking().SingleOrDefaultAsync(a => a.Id == id);
        if (attendee is null)
            return Results.NotFound();

        var model = new AttendeeEditModel
        {
            Name = attendee.Name, Email = attendee.Email, Company = attendee.Company, TicketTypeId = attendee.TicketTypeId,
            Status = attendee.Status, Notes = attendee.Notes,
            Tags = (attendee.Tags ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList(),
        };
        return PartialView<AttendeeEditor>(new { AttendeeId = id, Initial = model, TicketTypes = await query.TicketTypesAsync() });
    }

    // Save: 422 back into the sheet's form, or close the sheet and rebuild the table, both out of band.
    [HttpPost("/organizer/attendees/{id:int}"), ValidateAntiForgeryToken]
    public async Task<IResult> Save(int id, [FromForm(Name = "Model")] AttendeeEditModel model, [FromForm] AttendeeServerFilter filter, [FromForm] AttendeeTableRequest state)
    {
        var attendee = await db.Attendees.SingleOrDefaultAsync(a => a.Id == id);
        if (attendee is null)
            return Results.NotFound();

        if (model.Email is not null && await db.Attendees.AnyAsync(a => a.Id != id && a.Email == model.Email && a.OrderId == attendee.OrderId))
            ModelState.AddModelError("Model.Email", "Another attendee on the same order already uses this email address.");
        if (!await db.TicketTypes.AnyAsync(t => t.Id == model.TicketTypeId))
            ModelState.AddModelError("Model.TicketTypeId", "Choose a ticket type.");

        if (!ModelState.IsValid)
        {
            Response.Htmx().ValidationFailed();
            Response.Htmx(h => h.Retarget("#attendee-edit-form").Reswap(SwapStyle.outerHTML));
            return PartialView<AttendeeEditForm>(new { AttendeeId = id, TicketTypes = await query.TicketTypesAsync() });
        }

        var wasCheckedIn = attendee.Status == AttendeeStatus.CheckedIn;
        attendee.Name = model.Name!;
        attendee.Email = model.Email!;
        attendee.Company = string.IsNullOrWhiteSpace(model.Company) ? null : model.Company;
        attendee.TicketTypeId = model.TicketTypeId;
        attendee.Status = model.Status;
        attendee.CheckedInAt = model.Status == AttendeeStatus.CheckedIn ? attendee.CheckedInAt ?? clock.GetUtcNow() : null;
        attendee.Tags = model.Tags.Count == 0 ? null : string.Join(",", model.Tags.Select(t => t.Trim()).Where(t => t.Length > 0).Distinct());
        attendee.Notes = model.Notes;
        Audit("attendee.updated", attendee.Id, $"Updated attendee {attendee.Name}{(wasCheckedIn != (attendee.Status == AttendeeStatus.CheckedIn) ? $" (now {attendee.Status})" : "")}");
        await db.SaveChangesAsync();

        // The sheet's form posts with hx-swap="none": everything changes out of band.
        swaps.AddSwappableComponent<AttendeeTable>("attendee-table", new { Model = await TableAsync(filter, state) });
        swaps.AddSwappableContent("attendee-editor", new Microsoft.AspNetCore.Components.MarkupString(""), SwapStyle.innerHTML);
        toasts.Success($"{attendee.Name} was updated.", "Saved");
        return PartialView<Components.Shared.Nothing>();
    }

    // Bulk actions on the selected rows, confirmed in an alert dialog.
    [HttpPost("/organizer/attendees/bulk"), ValidateAntiForgeryToken]
    public async Task<IResult> Bulk([FromForm] string action, [FromForm] AttendeeServerFilter filter, [FromForm] AttendeeTableRequest state)
    {
        var ids = state.SelectedIds;
        var attendees = await db.Attendees.Where(a => ids.Contains(a.Id)).ToListAsync();
        var now = clock.GetUtcNow();
        string message;
        switch (action)
        {
            case "check-in":
                foreach (var a in attendees.Where(a => a.Status == AttendeeStatus.Registered)) { a.Status = AttendeeStatus.CheckedIn; a.CheckedInAt = now; }
                message = $"{attendees.Count} {(attendees.Count == 1 ? "attendee" : "attendees")} checked in.";
                break;
            case "cancel":
                foreach (var a in attendees) { a.Status = AttendeeStatus.Cancelled; a.CheckedInAt = null; }
                message = $"{attendees.Count} {(attendees.Count == 1 ? "registration" : "registrations")} cancelled.";
                break;
            case "resend":
                message = $"Tickets sent again to {attendees.Count} {(attendees.Count == 1 ? "attendee" : "attendees")}.";
                break;
            default:
                return Results.BadRequest();
        }
        Audit($"attendee.bulk_{action.Replace('-', '_')}", null, message);
        await db.SaveChangesAsync();

        state.Selected = null;
        swaps.AddSwappableComponent<AttendeeTable>("attendee-table", new { Model = await TableAsync(filter, state) });
        toasts.Success(message, "Done");
        // Close only this dialog: the default close event would close every dialog on the page (SF-003).
        Response.Htmx(h => h.Trigger("attendees:bulk-close"));
        return PartialView<Components.Shared.Nothing>();
    }

    private async Task<AttendeeTableModel> TableAsync(AttendeeServerFilter filter, AttendeeTableRequest state) =>
        new(await query.RowsAsync(filter), state.ToInitialState(), filter);

    private void Audit(string action, int? entityId, string summary) =>
        db.AuditEvents.Add(new AuditEvent
        {
            At = clock.GetUtcNow(), Actor = User.Identity?.Name ?? "Organizer", Action = action, EntityType = "Attendee",
            EntityId = entityId?.ToString(), Summary = summary,
        });

    private static string PageUrl(AttendeeServerFilter filter)
    {
        var parts = new List<string>();
        if (!string.IsNullOrEmpty(filter.Status)) parts.Add($"status={Uri.EscapeDataString(filter.Status)}");
        if (!string.IsNullOrEmpty(filter.Ticket)) parts.Add($"ticket={Uri.EscapeDataString(filter.Ticket)}");
        return parts.Count == 0 ? "/organizer/attendees" : "/organizer/attendees?" + string.Join("&", parts);
    }
}

public sealed record AttendeeTableModel(IReadOnlyList<AttendeeRow> Rows, RizzyUI.RzDataTableInitialState State, AttendeeServerFilter Filter);
