
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
    // ReSharper disable once InconsistentNaming
    private static IServiceCollection AddRizzyUIInternal(this IServiceCollection services)
    {
        // Register core dependencies used by RizzyUI.
        services.AddTailwindVariants(); // Add TailwindVariants.NET service
        services.AddTailwindMerge();
        services.AddHttpContextAccessor();
        services.TryAddScoped<IRizzyNonceProvider, RizzyNonceProvider>();

        // Post-configure the options to ensure the default theme is always available.
        // This runs after any user-provided `configure` action.
        services.PostConfigure<RizzyUIConfig>(config =>
        {
            // Check if a theme with the same code as the default already exists.
            if (config.AvailableThemes.All(t => t.ThemeCode != config.DefaultTheme.ThemeCode))
            {
                // Add the default theme to the beginning of the list if it's not already there.
                config.AvailableThemes.Insert(0, config.DefaultTheme);
            }

            config.AvailableThemes.Add(RzTheme.VercelTheme);

            // Add default asset URLs, allowing users to override them.
            config.AssetUrls.TryAdd("EmblaCore", "https://cdn.jsdelivr.net/npm/embla-carousel@8.1.7/embla-carousel.umd.js");
            config.AssetUrls.TryAdd("EmblaAutoplay", "https://cdn.jsdelivr.net/npm/embla-carousel-autoplay@8.1.7/embla-carousel-autoplay.umd.js");
            config.AssetUrls.TryAdd("EmblaAutoScroll", "https://cdn.jsdelivr.net/npm/embla-carousel-auto-scroll@8.1.7/embla-carousel-auto-scroll.umd.js");
            config.AssetUrls.TryAdd("EmblaAutoHeight", "https://cdn.jsdelivr.net/npm/embla-carousel-auto-height@8.1.7/embla-carousel-auto-height.umd.js");
            config.AssetUrls.TryAdd("EmblaClassNames", "https://cdn.jsdelivr.net/npm/embla-carousel-class-names@8.1.7/embla-carousel-class-names.umd.js");
            config.AssetUrls.TryAdd("EmblaFade", "https://cdn.jsdelivr.net/npm/embla-carousel-fade@8.1.7/embla-carousel-fade.umd.js");
            config.AssetUrls.TryAdd("EmblaWheelGestures", "https://cdn.jsdelivr.net/npm/embla-carousel-wheel-gestures@8.1.7/embla-carousel-wheel-gestures.umd.js");

            config.AssetUrls.TryAdd("HighlightJsCore", Constants.ContentUrl("vendor/highlightjs/highlight.js"));
            config.AssetUrls.TryAdd("HighlightJsRazor", Constants.ContentUrl("js/lib/highlightjs-plugin/cshtml-razor.min.js"));
            config.AssetUrls.TryAdd("FlatpickrCore", "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.js");
            config.AssetUrls.TryAdd("Coloris", "https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.js");
            config.AssetUrls.TryAdd("ColorisCss", "https://cdn.jsdelivr.net/gh/mdbassit/Coloris@latest/dist/coloris.min.css");            config.AssetUrls.TryAdd("TomSelect", "https://cdn.jsdelivr.net/npm/tom-select@2.4.1/dist/js/tom-select.complete.min.js");
            
            config.AssetUrls.TryAdd("VanillaCalendarPro", "https://cdn.jsdelivr.net/npm/vanilla-calendar-pro/index.js");
            config.AssetUrls.TryAdd("VanillaCalendarCss", "https://cdn.jsdelivr.net/npm/vanilla-calendar-pro/styles/index.css");            
        });

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
