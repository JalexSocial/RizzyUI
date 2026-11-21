namespace Summit.Web.Infrastructure;

/// <summary>Summit's own settings, bound from the "Summit" configuration section.</summary>
public sealed class SummitOptions
{
    public const string SectionName = "Summit";

    public CspOptions Csp { get; set; } = new();

    /// <summary>Maps /_test/* (database reset, forced failures). Never on in a real deployment.</summary>
    public bool EnableTestHooks { get; set; }

    public DatabaseOptions Database { get; set; } = new();

    /// <summary>A fixed "now" (ISO 8601). Tests set it so dates, countdowns and charts are stable.</summary>
    public DateTimeOffset? FixedNow { get; set; }

    public CheckInOptions CheckIn { get; set; } = new();

    public AssetOptions Assets { get; set; } = new();

    public DemoOrganizerOptions DemoOrganizer { get; set; } = new();

    public sealed class CspOptions
    {
        /// <summary>Strict nonce-based Content Security Policy and RizzyUI's CSP build (rizzyui-csp.js).</summary>
        public bool Enabled { get; set; }
    }

    public sealed class DatabaseOptions
    {
        /// <summary>SQLite database file, relative to the content root.</summary>
        public string Path { get; set; } = "App_Data/summit.db";

        /// <summary>Rebuild the database from the seed on startup.</summary>
        public bool ResetOnStart { get; set; } = true;
    }

    public sealed class CheckInOptions
    {
        /// <summary>How often the check-in desk polls the live counter.</summary>
        public int PollSeconds { get; set; } = 5;
    }

    public sealed class AssetOptions
    {
        /// <summary>Load widget libraries from RizzyUI's CDN defaults instead of wwwroot/lib.</summary>
        public bool UseCdnDefaults { get; set; }
    }

    public sealed class DemoOrganizerOptions
    {
        public string Email { get; set; } = "";
        public string Password { get; set; } = "";
        public string Name { get; set; } = "Organizer";
    }
}
