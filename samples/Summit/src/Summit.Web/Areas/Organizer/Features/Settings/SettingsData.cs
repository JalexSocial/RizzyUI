using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Summit.Web.Data;
using Summit.Web.Data.Entities;

namespace Summit.Web.Areas.Organizer.Features.Settings;

public static class SettingsSections
{
    public const string General = "general";
    public const string Appearance = "appearance";
    public const string ApiKeys = "api-keys";
    public const string Audit = "audit-log";
    public const string Developer = "developer";

    public static readonly (string Slug, string Title)[] All =
    [
        (General, "General"), (Appearance, "Appearance"), (ApiKeys, "API keys"), (Audit, "Audit log"), (Developer, "Developer"),
    ];

    public static bool IsKnown(string? slug) => All.Any(s => s.Slug == slug);
}

public sealed class GeneralSettingsModel
{
    [Required(ErrorMessage = "Enter the address attendees can write to.")]
    [EmailAddress(ErrorMessage = "Enter a valid email address.")]
    [Display(Name = "Support email")]
    public string? SupportEmail { get; set; }

    [Display(Name = "Registration is open")]
    public bool RegistrationOpen { get; set; }

    [Display(Name = "Check-in desks are open")]
    public bool CheckInOpen { get; set; }

    [Display(Name = "Show remaining tickets")]
    public bool ShowRemainingTickets { get; set; }
}

public sealed class CreateKeyModel
{
    public static readonly (string Value, string Description)[] KnownScopes =
    [
        ("attendees:read", "Read attendees and their check-in status"),
        ("orders:read", "Read orders and payments"),
        ("sessions:read", "Read the published schedule"),
        ("speakers:read", "Read speaker profiles"),
    ];

    [Required(ErrorMessage = "Name the key after what uses it.")]
    [StringLength(60, ErrorMessage = "Keep the name under 60 characters.")]
    [Display(Name = "Key name")]
    public string? Name { get; set; }

    [MinLength(1, ErrorMessage = "Choose at least one scope.")]
    [Display(Name = "Scopes")]
    public IList<string> Scopes { get; set; } = [];
}

public sealed record ApiKeyRow(int Id, string Name, string Prefix, IReadOnlyList<string> Scopes, DateTimeOffset CreatedAt, DateTimeOffset? LastUsedAt, DateTimeOffset? RevokedAt);

public sealed record AuditRow(int Id, DateTimeOffset At, string Actor, string Action, string Summary, string? DataJson);
public sealed record AuditPage(IReadOnlyList<AuditRow> Rows, int Page, int Pages);

public sealed class SettingsStore(SummitDbContext db, TimeProvider clock)
{
    public const int AuditPerPage = 10;

    public async Task<GeneralSettingsModel> GeneralAsync()
    {
        var s = await db.Settings.AsNoTracking().SingleAsync();
        return new GeneralSettingsModel
        {
            SupportEmail = s.SupportEmail, RegistrationOpen = s.RegistrationOpen, CheckInOpen = s.CheckInOpen, ShowRemainingTickets = s.ShowRemainingTickets,
        };
    }

    public async Task SaveGeneralAsync(GeneralSettingsModel model, string actor)
    {
        var s = await db.Settings.SingleAsync();
        s.SupportEmail = model.SupportEmail!.Trim();
        s.RegistrationOpen = model.RegistrationOpen;
        s.CheckInOpen = model.CheckInOpen;
        s.ShowRemainingTickets = model.ShowRemainingTickets;
        Audit(actor, "settings.updated", "EventSettings", null, "Updated the general settings");
        await db.SaveChangesAsync();
    }

    public async Task<IReadOnlyList<ApiKeyRow>> KeysAsync()
    {
        var keys = await db.ApiKeys.AsNoTracking().ToListAsync();
        return keys.OrderBy(k => k.RevokedAt is not null).ThenByDescending(k => k.CreatedAt)
            .Select(k => new ApiKeyRow(k.Id, k.Name, k.Prefix, k.Scopes.Split(',', StringSplitOptions.RemoveEmptyEntries), k.CreatedAt, k.LastUsedAt, k.RevokedAt))
            .ToList();
    }

    /// <summary>Creates a key and returns its secret, which is shown once and stored only as a hash.</summary>
    public async Task<string> CreateKeyAsync(CreateKeyModel model, string actor)
    {
        var secret = "smt_live_" + Convert.ToHexStringLower(RandomNumberGenerator.GetBytes(16));
        db.ApiKeys.Add(new ApiKey
        {
            Name = model.Name!.Trim(), Prefix = secret[..13], Hash = Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(secret))),
            Scopes = string.Join(",", model.Scopes.Distinct()), CreatedAt = clock.GetUtcNow(),
        });
        Audit(actor, "apikey.created", "ApiKey", null, $"Created the API key “{model.Name!.Trim()}”");
        await db.SaveChangesAsync();
        return secret;
    }

    public async Task<string?> RevokeKeyAsync(int id, string actor)
    {
        var key = await db.ApiKeys.SingleOrDefaultAsync(k => k.Id == id && k.RevokedAt == null);
        if (key is null) return null;
        key.RevokedAt = clock.GetUtcNow();
        Audit(actor, "apikey.revoked", "ApiKey", id, $"Revoked the API key “{key.Name}”");
        await db.SaveChangesAsync();
        return key.Name;
    }

    public async Task<AuditPage> AuditAsync(int page)
    {
        var all = await db.AuditEvents.AsNoTracking().ToListAsync();
        var pages = Math.Max(1, (int)Math.Ceiling(all.Count / (double)AuditPerPage));
        page = Math.Clamp(page, 1, pages);
        var rows = all.OrderByDescending(e => e.At).ThenByDescending(e => e.Id)
            .Skip((page - 1) * AuditPerPage).Take(AuditPerPage)
            .Select(e => new AuditRow(e.Id, e.At, e.Actor, e.Action, e.Summary, e.DataJson))
            .ToList();
        return new AuditPage(rows, page, pages);
    }

    private void Audit(string actor, string action, string entityType, int? entityId, string summary) =>
        db.AuditEvents.Add(new AuditEvent
        {
            At = clock.GetUtcNow(), Actor = actor, Action = action, EntityType = entityType, EntityId = entityId?.ToString(), Summary = summary,
        });
}
