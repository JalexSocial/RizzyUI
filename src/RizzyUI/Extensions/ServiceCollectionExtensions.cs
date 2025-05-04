using System;
using System.Linq;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging; 
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
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <returns>The service collection.</returns>
    private static IServiceCollection AddRizzyUIInternal(this IServiceCollection services)
    {
        // Register core dependencies used by RizzyUI components.
        services.AddTailwindMerge();
        services.AddHttpContextAccessor();
        services.TryAddScoped<IRizzyNonceProvider, RizzyNonceProvider>();

        // --- Localization Setup ---

        // Check if standard localization services (IStringLocalizerFactory) are registered by the application.
        bool localizationFactoryRegistered = services.Any(d => d.ServiceType == typeof(IStringLocalizerFactory));

        if (localizationFactoryRegistered)
        {
            // Localization is available. Now, conditionally decorate the factory based on RizzyUIConfig.
            // The decision is made *when the factory is resolved*, not during initial configuration.
            services.Decorate<IStringLocalizerFactory>((innerFactory, sp) =>
            {
                // Resolve RizzyUIConfig using the provided service provider (sp)
                // This gives us the correctly configured options instance for the current scope/request.
                var config = sp.GetRequiredService<IOptions<RizzyUIConfig>>().Value;

                // Check if the user configured application-specific resources for overrides.
                if (config?.LocalizationResourceType != null || !string.IsNullOrEmpty(config?.LocalizationResourceLocation))
                {
                    // If overrides are configured, return our custom factory, wrapping the original one.
                    return new RizzyStringLocalizerFactory(
                        innerFactory,
                        config.LocalizationResourceType,
                        config.LocalizationResourceLocation
                    );
                }
                else
                {
                    // If overrides are NOT configured, return the original factory unmodified.
                    return innerFactory;
                }
            });

            //var assembly = typeof(RizzyLocalization).Assembly;
            //var assemblyName = assembly.GetName();
            
            // Ensure IStringLocalizer<RizzyLocalization> can be resolved.
            // It will use the potentially decorated factory.
            /*
            services.TryAddTransient<IStringLocalizer<RizzyLocalization>>(sp =>
            {
                var factory = sp.GetRequiredService<IStringLocalizerFactory>();

                return factory.Create(typeof(RizzyLocalization)) as IStringLocalizer<RizzyLocalization>
                       ?? throw new InvalidOperationException(
                           $"Failed to create IStringLocalizer<RizzyLocalization> using the factory. Ensure the factory is correctly registered and configured.");
            });
            */
        }
        else
        {
            // Standard localization services are NOT registered by the application.
            // Register the DummyRizzyStringLocalizer as a fallback.
            // This requires ILogger<DummyRizzyStringLocalizer>, which should typically be available.
            services.TryAddSingleton<IStringLocalizer<RizzyLocalization>, DummyRizzyStringLocalizer>();

            // Log a warning during startup to inform the developer.
            // This is still useful for immediate feedback.
            Console.WriteLine("Warning: ASP.NET Core Localization services (AddLocalization) were not detected. RizzyUI components will display resource keys instead of localized text. Configure localization in Program.cs to enable translations.");
        }
        // --- End Localization Setup ---

        return services;
    }
}