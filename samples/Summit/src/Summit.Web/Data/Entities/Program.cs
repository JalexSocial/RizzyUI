namespace Summit.Web.Data.Entities;

/// <summary>The conference itself. There is exactly one row.</summary>
public sealed class Conference
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Tagline { get; set; }
    public required string City { get; set; }
    public required string Venue { get; set; }
    public DateOnly StartsOn { get; set; }
    public DateOnly EndsOn { get; set; }
    public required string TimeZoneId { get; set; }
    public required string Currency { get; set; }
}

public sealed class ConferenceDay
{
    public int Id { get; set; }
    public int Number { get; set; }
    public DateOnly Date { get; set; }
    public required string Theme { get; set; }
}

public sealed class Track
{
    public int Id { get; set; }
    public required string Slug { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    /// <summary>Hex color, edited in the schedule builder with RzInputColor.</summary>
    public required string Color { get; set; }
    public required string Image { get; set; }
    public int SortOrder { get; set; }
}

public sealed class Room
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Floor { get; set; }
    public int Capacity { get; set; }
}

public enum SessionLevel { Beginner, Intermediate, Advanced }

public enum SessionFormat { Keynote, Talk, Workshop, Lightning, Panel }

public enum SessionStatus { Draft, Published }

public sealed class Session
{
    public int Id { get; set; }
    public required string Slug { get; set; }
    public required string Title { get; set; }
    public required string Summary { get; set; }
    public required string AbstractMarkdown { get; set; }
    public string? CodeSample { get; set; }
    public string? CodeLanguage { get; set; }
    public SessionLevel Level { get; set; }
    public SessionFormat Format { get; set; }
    public SessionStatus Status { get; set; } = SessionStatus.Published;
    public int TrackId { get; set; }
    public Track Track { get; set; } = null!;
    public int RoomId { get; set; }
    public Room Room { get; set; } = null!;
    public int DayId { get; set; }
    public ConferenceDay Day { get; set; } = null!;
    /// <summary>Local start time in the conference time zone.</summary>
    public DateTime StartsAt { get; set; }
    public int LengthMinutes { get; set; }
    public int Capacity { get; set; }
    public List<SessionSpeaker> Speakers { get; set; } = [];

    public DateTime EndsAt => StartsAt.AddMinutes(LengthMinutes);
}

public sealed class Speaker
{
    public int Id { get; set; }
    public required string Slug { get; set; }
    public required string Name { get; set; }
    public required string Title { get; set; }
    public required string Company { get; set; }
    public required string Country { get; set; }
    public required string BioMarkdown { get; set; }
    /// <summary>A portrait in wwwroot/images/speakers, for featured speakers only.</summary>
    public string? Portrait { get; set; }
    public bool Featured { get; set; }
    public List<SessionSpeaker> Sessions { get; set; } = [];

    public string Initials => string.Concat(Name.Split(' ', StringSplitOptions.RemoveEmptyEntries).Take(2).Select(part => part[0]));
}

public sealed class SessionSpeaker
{
    public int SessionId { get; set; }
    public Session Session { get; set; } = null!;
    public int SpeakerId { get; set; }
    public Speaker Speaker { get; set; } = null!;
    public int Order { get; set; }
}

public enum SponsorTier { Platinum, Gold, Silver, Community }

public sealed class Sponsor
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public SponsorTier Tier { get; set; }
    /// <summary>A generated wordmark in wwwroot/images/sponsors.</summary>
    public required string Logo { get; set; }
}
