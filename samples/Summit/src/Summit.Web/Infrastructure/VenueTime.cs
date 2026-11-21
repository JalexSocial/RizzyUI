namespace Summit.Web.Infrastructure;

/// <summary>
/// Times shown to organizers are venue times (Europe/Berlin), not the server's local time, so pages
/// and tests read the same on every machine.
/// </summary>
public static class VenueTime
{
    private static readonly TimeZoneInfo Zone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Berlin");

    public static DateTimeOffset AtVenue(this DateTimeOffset time) => TimeZoneInfo.ConvertTime(time, Zone);
}
