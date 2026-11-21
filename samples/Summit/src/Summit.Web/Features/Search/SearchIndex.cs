using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Summit.Web.Data;
using Summit.Web.Data.Entities;

namespace Summit.Web.Features.Search;

/// <summary>
/// One result in the search palette. The shape RzCommand expects from ItemsUrl (value, name, group,
/// keywords), plus a description the item template shows. The value is the page to open.
/// </summary>
public sealed record SearchItem(
    [property: JsonPropertyName("value")] string Value,
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("group")] string Group,
    [property: JsonPropertyName("description")] string Description,
    [property: JsonPropertyName("keywords")] string[] Keywords);

public sealed class SearchIndex(SummitDbContext db)
{
    private static readonly SearchItem[] Pages =
    [
        new("/schedule", "Schedule", "Pages", "Three days, five tracks", ["agenda", "program", "talks"]),
        new("/speakers", "Speakers", "Pages", "Everyone on stage", ["people"]),
        new("/tickets", "Tickets", "Pages", "Passes and prices", ["buy", "price", "register"]),
        new("/help", "Help & FAQ", "Pages", "Venue, travel, accessibility", ["contact", "faq", "venue"]),
        new("/schedule?mine=true", "My agenda", "Pages", "The talks you saved", ["saved", "bookmarks"]),
    ];

    public async Task<IReadOnlyList<SearchItem>> SearchAsync(string? query, int limit = 12)
    {
        var q = query?.Trim() ?? "";
        if (q.Length == 0)
            return Pages;

        var like = $"%{q}%";
        var sessions = await db.Sessions.AsNoTracking()
            .Where(s => s.Status == SessionStatus.Published)
            .Where(s => EF.Functions.Like(s.Title, like) || EF.Functions.Like(s.Summary, like) || EF.Functions.Like(s.Track.Name, like))
            .OrderBy(s => s.StartsAt)
            .Select(s => new { s.Slug, s.Title, Track = s.Track.Name, s.StartsAt, Room = s.Room.Name })
            .Take(limit)
            .ToListAsync();

        var speakers = await db.Speakers.AsNoTracking()
            .Where(s => EF.Functions.Like(s.Name, like) || EF.Functions.Like(s.Company, like))
            .OrderBy(s => s.Name)
            .Select(s => new { s.Name, s.Company, s.Title })
            .Take(6)
            .ToListAsync();

        return Pages.Where(p => p.Name.Contains(q, StringComparison.OrdinalIgnoreCase) || p.Keywords.Any(k => k.Contains(q, StringComparison.OrdinalIgnoreCase)))
            .Concat(sessions.Select(s => new SearchItem($"/sessions/{s.Slug}", s.Title, "Sessions",
                $"{s.Track} · {s.StartsAt:ddd HH:mm} · {s.Room}", [q])))
            .Concat(speakers.Select(s => new SearchItem($"/speakers?q={Uri.EscapeDataString(s.Name)}", s.Name, "Speakers",
                $"{s.Title}, {s.Company}", [q])))
            .ToList();
    }
}
