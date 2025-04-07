using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Rizzy.Htmx;
using TailwindMerge.Extensions;

namespace RizzyUI;

/// <summary>
///     Set of extensions to add RizzyUI services
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    ///     Adds RizzyUI services to the specified <see cref="IServiceCollection" />.
    /// </summary>
    /// <param name="services">The service collection to add RizzyUI services to.</param>
    /// <param name="configure">An action to configure RizzyUI options.</param>
    /// <returns>The updated service collection.</returns>
    // ReSharper disable once InconsistentNaming
    public static IServiceCollection AddRizzyUI(this IServiceCollection services, Action<RizzyUIConfig> configure)
    {
        if (configure == null) throw new ArgumentNullException(nameof(configure));

        // Register the options and apply the configuration
        services.Configure(configure);

        return services.AddRizzyUI();
    }

    /// <summary>
    ///     Adds RizzyUI services to the specified <see cref="IServiceCollection" />.
    /// </summary>
    /// <param name="services">The service collection to add RizzyUI services to.</param>
    /// <returns>The updated service collection.</returns>
    // ReSharper disable once InconsistentNaming
    public static IServiceCollection AddRizzyUI(this IServiceCollection services)
    {
        services.AddTailwindMerge();

        // Ensure IHttpContextAccessor is registered
        services.AddHttpContextAccessor();

        // Register the default RizzyNonceProvider only if IRizzyNonceProvider hasn't been registered
        services.TryAddScoped<IRizzyNonceProvider, RizzyNonceProvider>();
        services.Configure<RizzyUIConfig>(config => { });

        return services;
    }
}