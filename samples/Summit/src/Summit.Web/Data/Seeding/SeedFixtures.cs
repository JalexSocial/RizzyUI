namespace Summit.Web.Data.Seeding;

/// <summary>
/// Known values in the seeded data that tests and the demo rely on. tests/e2e/support/fixtures.ts
/// repeats them; keep the two in sync.
/// </summary>
public static class SeedFixtures
{
    public const int RandomSeed = 2027;

    /// <summary>The conference starts this many days after "now".</summary>
    public const int DaysUntilConference = 1;

    /// <summary>An attendee who has not checked in yet.</summary>
    public const string RegisteredBadgeCode = "HTMX4U";
    public const string RegisteredAttendeeName = "Avery Quinn";

    /// <summary>An attendee who already checked in.</summary>
    public const string CheckedInBadgeCode = "ALPN3S";
    public const string CheckedInAttendeeName = "Jules Moreau";

    /// <summary>20% off, valid.</summary>
    public const string ValidDiscountCode = "SUMMIT";
    public const int ValidDiscountPercent = 20;

    /// <summary>Expired yesterday.</summary>
    public const string ExpiredDiscountCode = "WINTER";

    /// <summary>All uses taken.</summary>
    public const string UsedUpDiscountCode = "FRIEND";

    /// <summary>The session whose abstract carries unsafe HTML, to prove RzMarkdown's safe default.</summary>
    public const string UnsafeMarkdownSessionSlug = "rendering-untrusted-markdown-safely";

    public const string FeaturedSpeakerSlug = "amara-okafor";

    public const string SoldOutTicketSlug = "student";
    public const string NotOnSaleTicketSlug = "supporter";
    public const string ConferencePassSlug = "conference";
}
