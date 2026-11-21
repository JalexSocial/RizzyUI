namespace Summit.Web.Data.Entities;

public sealed class OrganizerAccount
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string Name { get; set; }
    public required string PasswordHash { get; set; }
}

/// <summary>Event-wide switches edited on the organizer settings page. There is exactly one row.</summary>
public sealed class EventSettings
{
    public int Id { get; set; }
    public bool RegistrationOpen { get; set; } = true;
    public bool CheckInOpen { get; set; } = true;
    public bool ShowRemainingTickets { get; set; } = true;
    public required string SupportEmail { get; set; }
}

public sealed class ApiKey
{
    public int Id { get; set; }
    public required string Name { get; set; }
    /// <summary>The first characters of the key, shown in lists (smt_live_ab12…).</summary>
    public required string Prefix { get; set; }
    /// <summary>SHA-256 of the full key. The key itself is shown once and never stored.</summary>
    public required string Hash { get; set; }
    /// <summary>Comma-separated scopes.</summary>
    public required string Scopes { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? LastUsedAt { get; set; }
    public DateTimeOffset? RevokedAt { get; set; }
}

public sealed class AuditEvent
{
    public int Id { get; set; }
    public DateTimeOffset At { get; set; }
    public required string Actor { get; set; }
    public required string Action { get; set; }
    public required string EntityType { get; set; }
    public string? EntityId { get; set; }
    public required string Summary { get; set; }
    public string? DataJson { get; set; }
}
