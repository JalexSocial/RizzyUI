using Microsoft.EntityFrameworkCore;
using Summit.Web.Data;
using Summit.Web.Data.Entities;
using Summit.Web.Features.Agenda;

namespace Summit.Web.Features.Schedule;

/// <summary>
/// The schedule filters. Bound from the query string (GET), so links like /schedule?tracks=web work.
/// The names match what the filter controls post: RzCheckboxGroup Name="tracks", RzSlider Name="length"
/// (length[0], length[1]).
/// </summary>
public sealed class ScheduleFilter
{
    public const int ShortestSession = 15;
    public const int LongestSession = 90;

    public int Day { get; set; } = 1;
    public IList<string> Tracks { get; set; } = new List<string>();
    public double[]? Length { get; set; }
    public string? Format { get; set; }
    public bool Mine { get; set; }

    public int MinLength => Length is { Length: > 0 } ? (int)Length[0] : ShortestSession;
    public int MaxLength => Length is { Length: > 1 } ? (int)Length[1] : LongestSession;

    public bool IsFiltered => Tracks.Count > 0 || MinLength > ShortestSession || MaxLength < LongestSession || Format is not null || Mine;

    /// <summary>The canonical page URL for these filters (pushed into the address bar).</summary>
    public string ToPageUrl()
    {
        var query = new List<string> { $"day={Day}" };
        query.AddRange(Tracks.Select(t => $"tracks={Uri.EscapeDataString(t)}"));
        if (MinLength > ShortestSession || MaxLength < LongestSession)
        {
            query.Add($"length%5B0%5D={MinLength}");
            query.Add($"length%5B1%5D={MaxLength}");
        }
        if (Format is not null) query.Add($"format={Uri.EscapeDataString(Format)}");
        if (Mine) query.Add("mine=true");
        return "/schedule?" + string.Join("&", query);
    }
}

public sealed record ScheduleDay(ConferenceDay Day, IReadOnlyList<ScheduleSlot> Slots, int Count);

public sealed record ScheduleSlot(DateTime StartsAt, IReadOnlyList<Session> Sessions);

public sealed record ScheduleResult(ScheduleFilter Filter, IReadOnlyList<ScheduleDay> Days, IReadOnlyList<Track> Tracks, HashSet<int> Saved)
{
    public int Count => Days.Sum(d => d.Count);
}

public sealed class ScheduleQuery(SummitDbContext db, AgendaService agenda)
{
    public async Task<ScheduleResult> RunAsync(ScheduleFilter filter, string? visitorId)
    {
        var saved = await agenda.SessionIdsAsync(visitorId);
        var tracks = await db.Tracks.AsNoTracking().OrderBy(t => t.SortOrder).ToListAsync();
        var days = await db.Days.AsNoTracking().OrderBy(d => d.Number).ToListAsync();
        filter.Day = Math.Clamp(filter.Day, 1, days.Count);

        var query = db.Sessions.AsNoTracking()
            .Include(s => s.Track).Include(s => s.Room)
            .Include(s => s.Speakers).ThenInclude(s => s.Speaker)
            .Where(s => s.Status == SessionStatus.Published)
            .Where(s => s.LengthMinutes >= filter.MinLength && s.LengthMinutes <= filter.MaxLength);

        if (filter.Tracks.Count > 0)
            query = query.Where(s => filter.Tracks.Contains(s.Track.Slug));
        if (Enum.TryParse<SessionFormat>(filter.Format, ignoreCase: true, out var format))
            query = query.Where(s => s.Format == format);
        if (filter.Mine)
            query = query.Where(s => saved.Contains(s.Id));

        var sessions = await query.OrderBy(s => s.StartsAt).ThenBy(s => s.Room.Id).ToListAsync();

        var result = days.Select(day =>
        {
            var daySessions = sessions.Where(s => s.DayId == day.Id).ToList();
            var slots = daySessions.GroupBy(s => s.StartsAt).Select(g => new ScheduleSlot(g.Key, g.ToList())).ToList();
            return new ScheduleDay(day, slots, daySessions.Count);
        }).ToList();

        return new ScheduleResult(filter, result, tracks, saved);
    }
}
