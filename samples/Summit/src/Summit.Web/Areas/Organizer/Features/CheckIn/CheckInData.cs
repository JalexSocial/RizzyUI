using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Summit.Web.Data;
using Summit.Web.Data.Entities;

namespace Summit.Web.Areas.Organizer.Features.CheckIn;

public sealed class CheckInModel
{
    [Required(ErrorMessage = "Enter the six characters on the badge.")]
    [RegularExpression("^[A-Za-z0-9]{6}$", ErrorMessage = "A badge code has six letters and digits.")]
    [Display(Name = "Badge code")]
    public string? BadgeCode { get; set; }
}

public enum CheckInOutcome { CheckedIn, AlreadyCheckedIn, Cancelled }

/// <summary>What the desk shows after a code: who it is and what happened.</summary>
public sealed record CheckInResult(CheckInOutcome Outcome, string Name, string Initials, string Ticket, string? Company, string? Tags, DateTimeOffset? CheckedInAt);

public sealed record CheckInCount(int CheckedIn, int Expected);

public sealed record RecentCheckIn(int Id, string Name, string Ticket, string Code, DateTimeOffset At);

public sealed class CheckInDesk(SummitDbContext db, TimeProvider clock)
{
    public const int RecentCount = 8;

    public async Task<CheckInCount> CountAsync()
    {
        var checkedIn = await db.Attendees.CountAsync(a => a.Status == AttendeeStatus.CheckedIn);
        var expected = await db.Attendees.CountAsync(a => a.Status != AttendeeStatus.Cancelled);
        return new CheckInCount(checkedIn, expected);
    }

    public async Task<IReadOnlyList<RecentCheckIn>> RecentAsync()
    {
        var attendees = await db.Attendees.AsNoTracking().Include(a => a.TicketType)
            .Where(a => a.Status == AttendeeStatus.CheckedIn && a.CheckedInAt != null).ToListAsync();
        return attendees.OrderByDescending(a => a.CheckedInAt).Take(RecentCount).Select(ToRecent).ToList();
    }

    /// <summary>Checks the badge in. Null when no attendee has the code.</summary>
    public async Task<(CheckInResult Result, RecentCheckIn? Row)?> CheckInAsync(string code)
    {
        code = code.Trim().ToUpperInvariant();
        var attendee = await db.Attendees.Include(a => a.TicketType).SingleOrDefaultAsync(a => a.BadgeCode == code);
        if (attendee is null)
            return null;

        if (attendee.Status == AttendeeStatus.Cancelled)
            return (Result(attendee, CheckInOutcome.Cancelled), null);
        if (attendee.Status == AttendeeStatus.CheckedIn)
            return (Result(attendee, CheckInOutcome.AlreadyCheckedIn), null);

        attendee.Status = AttendeeStatus.CheckedIn;
        attendee.CheckedInAt = clock.GetUtcNow();
        db.AuditEvents.Add(new AuditEvent
        {
            At = clock.GetUtcNow(), Actor = "Check-in desk", Action = "attendee.checked_in", EntityType = "Attendee",
            EntityId = attendee.Id.ToString(), Summary = $"Checked in {attendee.Name} ({attendee.BadgeCode})",
        });
        await db.SaveChangesAsync();
        return (Result(attendee, CheckInOutcome.CheckedIn), ToRecent(attendee));
    }

    private static CheckInResult Result(Attendee a, CheckInOutcome outcome) =>
        new(outcome, a.Name, Initials(a.Name), a.TicketType.Name, a.Company, a.Tags, a.CheckedInAt);

    private static RecentCheckIn ToRecent(Attendee a) => new(a.Id, a.Name, a.TicketType.Name, a.BadgeCode, a.CheckedInAt!.Value);

    private static string Initials(string name) =>
        string.Concat(name.Split(' ', StringSplitOptions.RemoveEmptyEntries).Take(2).Select(part => char.ToUpperInvariant(part[0])));
}
