using Microsoft.EntityFrameworkCore;
using Summit.Web.Data;
using Summit.Web.Data.Entities;

namespace Summit.Web.Features;

/// <summary>Conference-wide data the layouts need on every page: the event, tracks, sponsors.</summary>
public sealed class ConferenceInfo(SummitDbContext db, TimeProvider clock)
{
    private Conference? _conference;
    private IReadOnlyList<Track>? _tracks;

    public async Task<Conference> GetConferenceAsync() =>
        _conference ??= await db.Conferences.AsNoTracking().SingleAsync();

    public async Task<IReadOnlyList<Track>> GetTracksAsync() =>
        _tracks ??= await db.Tracks.AsNoTracking().OrderBy(t => t.SortOrder).ToListAsync();

    public async Task<IReadOnlyList<Sponsor>> GetSponsorsAsync() =>
        await db.Sponsors.AsNoTracking().OrderBy(s => s.Tier).ThenBy(s => s.Name).ToListAsync();

    public Task<int> CountActiveAttendeesAsync() =>
        db.Attendees.CountAsync(a => a.Status != AttendeeStatus.Cancelled);

    /// <summary>"Now" in the conference time zone.</summary>
    public async Task<DateTime> LocalNowAsync()
    {
        var conference = await GetConferenceAsync();
        return TimeZoneInfo.ConvertTime(clock.GetUtcNow(), TimeZoneInfo.FindSystemTimeZoneById(conference.TimeZoneId)).DateTime;
    }
}
