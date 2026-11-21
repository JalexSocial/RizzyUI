namespace Summit.Web.Infrastructure;

/// <summary>A clock that always returns the same instant (Summit:FixedNow), for stable tests.</summary>
public sealed class FixedTimeProvider(DateTimeOffset now) : TimeProvider
{
    public override DateTimeOffset GetUtcNow() => now;
}

public static class SummitClock
{
    public static IServiceCollection AddSummitClock(this IServiceCollection services, IConfiguration configuration)
    {
        var fixedNow = configuration.GetValue<DateTimeOffset?>($"{SummitOptions.SectionName}:FixedNow");
        services.AddSingleton<TimeProvider>(fixedNow is { } now ? new FixedTimeProvider(now) : TimeProvider.System);
        return services;
    }
}
