
using System;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using Rizzy.Htmx;
using RizzyUI.Localization;
using TailwindMerge.Extensions;

namespace RizzyUI;

/// <summary>
/// Provides extension methods for registering RizzyUI services with the dependency injection container.
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Adds RizzyUI services to the specified <see cref="IServiceCollection"/> and configures RizzyUI options.
    /// </summary>
    /// <param name="services">The <see cref="IServiceCollection"/> to add services to.</param>
    /// <param name="configure">An action delegate to configure the <see cref="RizzyUIConfig"/>.</param>
    /// <returns>The <see cref="IServiceCollection"/> so that additional calls can be chained.</returns>
    /// <exception cref="ArgumentNullException">Thrown if <paramref name="configure"/> is null.</exception>
    public static IServiceCollection AddRizzyUI(this IServiceCollection services, Action<RizzyUIConfig> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);
        // Register IOptions<RizzyUIConfig> and apply the user's configuration.
        services.Configure(configure);
        // Call the internal method that performs the actual service registration.
        return services.AddRizzyUIInternal();
    }

    /// <summary>
    /// Adds RizzyUI services to the specified <see cref="IServiceCollection"/> with default options.
    /// </summary>
    /// <param name="services">The <see cref="IServiceCollection"/> to add services to.</param>
    /// <returns>The <see cref="IServiceCollection"/> so that additional calls can be chained.</returns>
    public static IServiceCollection AddRizzyUI(this IServiceCollection services)
    {
        // Ensure IOptions infrastructure is registered even if no specific configuration is provided.
        services.Configure<RizzyUIConfig>(config => { });
        return services.AddRizzyUIInternal();
    }

    /// <summary>
    /// Internal helper method containing the core service registrations for RizzyUI.
    /// Sets up TailwindMerge, HTTP context access, nonce provider, and localization.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <returns>The service collection.</returns>
    private static IServiceCollection AddRizzyUIInternal(this IServiceCollection services)
    {
        // Register core dependencies used by RizzyUI.
        services.AddTailwindMerge();
        services.AddHttpContextAccessor();
        services.TryAddScoped<IRizzyNonceProvider, RizzyNonceProvider>();

        // --- Localization Setup ---

        bool localizationFactoryRegistered = services.Any(d => d.ServiceType == typeof(IStringLocalizerFactory));

        if (localizationFactoryRegistered)
        {
            // Decorate the existing factory IF localization is configured.
            services.Decorate<IStringLocalizerFactory>((innerFactory, sp) =>
            {
                var config = sp.GetRequiredService<IOptions<RizzyUIConfig>>().Value;
                // Pass the original factory, the service provider, and override config.
                return new RizzyStringLocalizerFactory(
                    innerFactory,
                    sp, // Provide IServiceProvider
                    config.LocalizationResourceType,
                    config.LocalizationResourceLocation
                );
            });
        }
        else
        {
            // If no factory registered, register the dummy for RizzyUI's needs.
            services.TryAddSingleton<IStringLocalizer<RizzyLocalization>, DummyRizzyStringLocalizer>();
        }

        return services;
    }
}