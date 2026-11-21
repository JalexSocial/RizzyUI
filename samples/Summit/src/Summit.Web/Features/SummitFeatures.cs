using Summit.Web.Features.Agenda;

namespace Summit.Web.Features;

/// <summary>Registration for feature services and the minimal-API fragment endpoints.</summary>
public static class SummitFeatures
{
    public static IServiceCollection AddSummitFeatures(this IServiceCollection services)
    {
        services.AddScoped<ConferenceInfo>();
        services.AddScoped<AgendaService>();
        return services;
    }

    /// <summary>
    /// Read-only fragments and JSON, served by minimal APIs (IRizzyService). Pages and anything that
    /// writes are MVC controllers. See docs/engineering/summit-demo-plan.md, section 3.4.
    /// </summary>
    public static IEndpointRouteBuilder MapSummitFragments(this IEndpointRouteBuilder endpoints)
    {
        var fragments = endpoints.MapGroup("/fragments");
        return endpoints;
    }
}
