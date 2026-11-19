
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using Rizzy.Htmx;
using RizzyUI.Localization;
using RizzyUI.Services.RzToast;
using RizzyUI.Services.RzToast.Internal;
using TailwindMerge.Extensions;

namespace RizzyUI;

/// <summary>
/// Provides extension methods for registering RizzyUI services with the dependency injection container.
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// The default CDN assets: logical key, exact-version URL and Subresource Integrity hash. Hashes
    /// are the SHA-256 of the published files as reported by the jsDelivr metadata API; update the
    /// URL and the hash together when upgrading a dependency.
    /// </summary>
    internal static readonly (string Key, string Url, string Integrity)[] DefaultCdnAssets =
    [
        ("EmblaCore", "https://cdn.jsdelivr.net/npm/embla-carousel@8.1.7/embla-carousel.umd.js", "sha256-xjAInPySUpna7ayafTYdc80xbUT3Sox6lfT0cRUi+ZU="),
        ("EmblaAutoplay", "https://cdn.jsdelivr.net/npm/embla-carousel-autoplay@8.1.7/embla-carousel-autoplay.umd.js", "sha256-kIqXUl7+KqVBJ4XQdLlPROBxyckzVpJW+1E9JYBG81Y="),
        ("EmblaAutoScroll", "https://cdn.jsdelivr.net/npm/embla-carousel-auto-scroll@8.1.7/embla-carousel-auto-scroll.umd.js", "sha256-SnxZoE97Nn7ixJa9glr6+ntpRC/MA1GSPm8lXMWdZbo="),
        ("EmblaAutoHeight", "https://cdn.jsdelivr.net/npm/embla-carousel-auto-height@8.1.7/embla-carousel-auto-height.umd.js", "sha256-5rp3yW1t0ABXnhD0f1/ewaG2DKxNd0jZiq3KBMeRjRM="),
        ("EmblaClassNames", "https://cdn.jsdelivr.net/npm/embla-carousel-class-names@8.1.7/embla-carousel-class-names.umd.js", "sha256-NtQxUy92r1g7d3fCHjhE5NFq6XQLMfH/HVO2iUiMYY0="),
        ("EmblaFade", "https://cdn.jsdelivr.net/npm/embla-carousel-fade@8.1.7/embla-carousel-fade.umd.js", "sha256-qtWt6EGh0093WNejH427efDQ1aIN6wZGYRispM42hBM="),
        ("EmblaWheelGestures", "https://cdn.jsdelivr.net/npm/embla-carousel-wheel-gestures@8.1.0/dist/embla-carousel-wheel-gestures.umd.js", "sha256-I0zdNudxKn9sYekWogTkZyVe1HMQuzy6pWIJEwB17Tw="),
        ("FlatpickrCore", "https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.js", "sha256-Huqxy3eUcaCwqqk92RwusapTfWlvAasF6p2rxV6FJaE="),
        ("TomSelect", "https://cdn.jsdelivr.net/npm/tom-select@2.4.1/dist/js/tom-select.complete.min.js", "sha256-5Ay2s7ymZ00Z+YWosdB7f+yaDOinoQZizY/y92yLwEQ="),
        ("Coloris", "https://cdn.jsdelivr.net/gh/mdbassit/Coloris@v0.25.1/dist/coloris.min.js", "sha256-zGw5MsLATyj/mrXzq62BPEvGYrrEq+IoROtvBAflZgM="),
        ("ChartJs", "https://cdn.jsdelivr.net/npm/chart.js@4.6.1/dist/chart.umd.js", "sha256-M4OZ+1uv5ZjSHPxHGwWQthzrMhqYX63k9oSZsVH2f78="),
        ("RzHighlighterCoreScript", "https://cdn.jsdelivr.net/npm/rough-notation@0.5.1/lib/rough-notation.iife.js", "sha256-+QqgCQ42H/SGlLdOAxnhCYVt7LPnV8KA3+JeNgfzX6w="),
        ("VanillaCalendarPro", "https://cdn.jsdelivr.net/npm/vanilla-calendar-pro@3.4.0/index.js", "sha256-MQSQHkDQLlYNcigmKBTcHOtS/8qzWsZDnr3FbURMVU0="),
        ("VanillaCalendarCss", "https://cdn.jsdelivr.net/npm/vanilla-calendar-pro@3.4.0/styles/index.css", "sha256-hW/VCmZ8+1hXcGA1ipqcuuEIzQX5VNzL+8pvvk9rDSQ="),
    ];

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
        // Idempotent (RZUI-036): a second AddRizzyUI() adds its configure action (above) but does not
        // register services, post-configuration or localization again.
        if (services.Any(d => d.ServiceType == typeof(RizzyUIRegistrationMarker)))
            return services;
        services.AddSingleton<RizzyUIRegistrationMarker>();

        // Register core dependencies used by RizzyUI.
        services.AddTailwindVariants(); // Add TailwindVariants.NET service
        services.AddTailwindMerge();
        services.AddHttpContextAccessor();
        services.TryAddScoped<IRizzyNonceProvider, RizzyNonceProvider>();
        services.TryAddScoped<RzToastCommandQueue>();
        services.TryAddScoped<IRzToastService, RzToastService>();
        services.TryAddSingleton<RzAlpineModuleResolver>();

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

            if (config.AvailableThemes.All(t => t.ThemeCode != RzTheme.VercelTheme.ThemeCode))
                config.AvailableThemes.Add(RzTheme.VercelTheme);

            // Add default asset URLs, allowing users to override them. CDN defaults are pinned to
            // exact versions and carry Subresource Integrity hashes (keyed by URL, so an override
            // with a different URL does not inherit the default hash).
            foreach (var (key, url, integrity) in DefaultCdnAssets)
            {
                config.AssetUrls.TryAdd(key, url);
                config.AssetIntegrity.TryAdd(url, integrity);
            }

            config.AssetUrls.TryAdd("HighlightJsCore", Constants.ContentUrl("vendor/highlightjs/highlight.min.js"));
            config.AssetUrls.TryAdd("HighlightJsRazor", Constants.ContentUrl("js/lib/highlightjs-plugin/cshtml-razor.min.js"));
        });

        // --- Localization ---
        // Decided when the localizer is first resolved, not here, so AddLocalization() may come before
        // or after AddRizzyUI() (RZUI-037). Without AddLocalization() RizzyUI uses its own embedded
        // resources instead of rendering resource keys.
        services.TryAddSingleton<IStringLocalizer<RizzyLocalization>>(RizzyLocalizerProvider.Create);

        return services;
    }
}

/// <summary>Marks that <c>AddRizzyUI()</c> has registered RizzyUI's services.</summary>
internal sealed class RizzyUIRegistrationMarker;
