using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Summit.Web.Data;
using Summit.Web.Data.Entities;

namespace Summit.Web.Areas.Organizer.Features.ScheduleBuilder;

/// <summary>One session in the builder's list.</summary>
public sealed record BuilderItem(int Id, string Title, DateTime StartsAt, int LengthMinutes, string Room, string Track, string TrackColor, int TrackId, bool Published);

public sealed class SessionEditModel
{
    [Required(ErrorMessage = "Enter a title.")]
    [StringLength(120, ErrorMessage = "Keep the title under 120 characters.")]
    [Display(Name = "Title")]
    public string? Title { get; set; }

    [Required(ErrorMessage = "Choose a start time.")]
    [Display(Name = "Starts at")]
    public DateTime? StartsAt { get; set; }

    [Range(15, 240, ErrorMessage = "A session lasts between 15 and 240 minutes.")]
    [Display(Name = "Length in minutes")]
    public int LengthMinutes { get; set; } = 45;

    [Range(1, 2000, ErrorMessage = "Capacity is between 1 and 2,000 seats.")]
    [Display(Name = "Capacity")]
    public int Capacity { get; set; } = 100;

    [Display(Name = "Room")]
    public int RoomId { get; set; }

    [Display(Name = "Track")]
    public int TrackId { get; set; }

    [RegularExpression("^#[0-9a-fA-F]{6}$", ErrorMessage = "Use a color like #4f46e5.")]
    [Display(Name = "Track color")]
    public string? TrackColor { get; set; }

    [Display(Name = "Published")]
    public bool Published { get; set; }
}

/// <summary>Everything the editor needs besides the form values.</summary>
public sealed record EditorContext(int? SessionId, IReadOnlyList<Room> Rooms, IReadOnlyList<Track> Tracks, IReadOnlyList<ConferenceDay> Days);

public sealed class ScheduleBuilder(SummitDbContext db, TimeProvider clock)
{
    public async Task<IReadOnlyList<BuilderItem>> ItemsAsync()
    {
        var sessions = await db.Sessions.AsNoTracking().Include(s => s.Room).Include(s => s.Track).ToListAsync();
        return sessions.OrderBy(s => s.StartsAt).ThenBy(s => s.Room.Name).Select(Item).ToList();
    }

    public async Task<BuilderItem?> ItemAsync(int id)
    {
        var session = await db.Sessions.AsNoTracking().Include(s => s.Room).Include(s => s.Track).SingleOrDefaultAsync(s => s.Id == id);
        return session is null ? null : Item(session);
    }

    public async Task<EditorContext> ContextAsync(int? sessionId) => new(
        sessionId,
        await db.Rooms.AsNoTracking().OrderBy(r => r.Name).ToListAsync(),
        await db.Tracks.AsNoTracking().OrderBy(t => t.SortOrder).ToListAsync(),
        await db.Days.AsNoTracking().OrderBy(d => d.Number).ToListAsync());

    public async Task<SessionEditModel?> ModelAsync(int id)
    {
        var s = await db.Sessions.AsNoTracking().Include(x => x.Track).SingleOrDefaultAsync(x => x.Id == id);
        return s is null ? null : new SessionEditModel
        {
            Title = s.Title, StartsAt = s.StartsAt, LengthMinutes = s.LengthMinutes, Capacity = s.Capacity,
            RoomId = s.RoomId, TrackId = s.TrackId, TrackColor = s.Track.Color, Published = s.Status == SessionStatus.Published,
        };
    }

    public async Task<SessionEditModel> NewModelAsync()
    {
        var day = await db.Days.AsNoTracking().OrderBy(d => d.Number).FirstAsync();
        var track = await db.Tracks.AsNoTracking().OrderBy(t => t.SortOrder).FirstAsync();
        var room = await db.Rooms.AsNoTracking().OrderBy(r => r.Name).FirstAsync();
        return new SessionEditModel
        {
            StartsAt = day.Date.ToDateTime(new TimeOnly(18, 0)), LengthMinutes = 45, Capacity = Math.Min(100, room.Capacity),
            RoomId = room.Id, TrackId = track.Id, TrackColor = track.Color,
        };
    }

    /// <summary>The rules a save must pass beyond the attributes; errors use the form's field names.</summary>
    public async Task<List<(string Field, string Message)>> ValidateAsync(int? id, SessionEditModel model)
    {
        var errors = new List<(string, string)>();
        var room = await db.Rooms.AsNoTracking().SingleOrDefaultAsync(r => r.Id == model.RoomId);
        if (room is null)
            errors.Add(("Model.RoomId", "Choose a room."));
        else if (model.Capacity > room.Capacity)
            errors.Add(("Model.Capacity", $"{room.Name} has {room.Capacity} seats."));
        if (!await db.Tracks.AnyAsync(t => t.Id == model.TrackId))
            errors.Add(("Model.TrackId", "Choose a track."));

        if (model.StartsAt is { } start)
        {
            var days = await db.Days.AsNoTracking().Select(d => d.Date).ToListAsync();
            var end = start.AddMinutes(model.LengthMinutes);
            if (!days.Contains(DateOnly.FromDateTime(start)) || start.TimeOfDay < TimeSpan.FromHours(8) || end.TimeOfDay > TimeSpan.FromHours(20) || end.Date != start.Date)
                errors.Add(("Model.StartsAt", "Sessions run between 08:00 and 20:00 on a conference day."));
            else if (room is not null)
            {
                var clash = (await db.Sessions.AsNoTracking().Where(s => s.RoomId == room.Id && s.Id != (id ?? 0)).ToListAsync())
                    .FirstOrDefault(s => s.StartsAt < end && start < s.StartsAt.AddMinutes(s.LengthMinutes));
                if (clash is not null)
                    errors.Add(("Model.StartsAt", $"{room.Name} is taken by “{clash.Title}” at {clash.StartsAt:HH:mm}."));
            }
        }
        return errors;
    }

    /// <summary>Creates or updates the session (and the track's color). Returns its id.</summary>
    public async Task<int> SaveAsync(int? id, SessionEditModel model, string actor)
    {
        Session session;
        if (id is { } existing)
            session = await db.Sessions.SingleAsync(s => s.Id == existing);
        else
        {
            var title = model.Title!.Trim();
            session = new Session
            {
                Slug = $"{Slugify(title)}-{clock.GetUtcNow().ToUnixTimeMilliseconds() % 100000}", Title = title,
                Summary = "", AbstractMarkdown = "", Format = SessionFormat.Talk, Level = SessionLevel.Intermediate,
            };
            db.Sessions.Add(session);
        }

        var day = await db.Days.SingleAsync(d => d.Date == DateOnly.FromDateTime(model.StartsAt!.Value));
        session.Title = model.Title!.Trim();
        session.StartsAt = model.StartsAt!.Value;
        session.LengthMinutes = model.LengthMinutes;
        session.Capacity = model.Capacity;
        session.RoomId = model.RoomId;
        session.TrackId = model.TrackId;
        session.DayId = day.Id;
        session.Status = model.Published ? SessionStatus.Published : SessionStatus.Draft;

        if (model.TrackColor is { } color)
        {
            var track = await db.Tracks.SingleAsync(t => t.Id == model.TrackId);
            if (!string.Equals(track.Color, color, StringComparison.OrdinalIgnoreCase))
                track.Color = color.ToLowerInvariant();
        }

        Audit(actor, id is null ? "session.created" : "session.updated", session.Id, $"{(id is null ? "Created" : "Updated")} “{session.Title}”");
        await db.SaveChangesAsync();
        return session.Id;
    }

    public async Task<string?> DeleteAsync(int id, string actor)
    {
        var session = await db.Sessions.SingleOrDefaultAsync(s => s.Id == id);
        if (session is null) return null;
        db.Sessions.Remove(session);
        Audit(actor, "session.deleted", id, $"Deleted “{session.Title}”");
        await db.SaveChangesAsync();
        return session.Title;
    }

    public async Task<int> PublishAllAsync(string actor)
    {
        var drafts = await db.Sessions.Where(s => s.Status == SessionStatus.Draft).ToListAsync();
        foreach (var draft in drafts) draft.Status = SessionStatus.Published;
        if (drafts.Count > 0) Audit(actor, "session.published_all", null, $"Published {drafts.Count} draft sessions");
        await db.SaveChangesAsync();
        return drafts.Count;
    }

    private void Audit(string actor, string action, int? entityId, string summary) =>
        db.AuditEvents.Add(new AuditEvent
        {
            At = clock.GetUtcNow(), Actor = actor, Action = action, EntityType = "Session",
            EntityId = entityId is > 0 ? entityId.ToString() : null, Summary = summary,
        });

    private static BuilderItem Item(Session s) =>
        new(s.Id, s.Title, s.StartsAt, s.LengthMinutes, s.Room.Name, s.Track.Name, s.Track.Color, s.TrackId, s.Status == SessionStatus.Published);

    private static string Slugify(string text) =>
        string.Join('-', new string(text.ToLowerInvariant().Select(c => char.IsLetterOrDigit(c) ? c : ' ').ToArray())
            .Split(' ', StringSplitOptions.RemoveEmptyEntries)).Trim('-');
}
