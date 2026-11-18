using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;

namespace RizzyUI.Localization;

/// <summary>
/// Creates RizzyUI's <see cref="IStringLocalizer{RizzyLocalization}"/> when it is first resolved, so
/// the result does not depend on whether the application called <c>AddLocalization()</c> before or
/// after <c>AddRizzyUI()</c> (RZUI-037).
/// </summary>
/// <remarks>
/// With ASP.NET Core localization registered, application overrides
/// (<see cref="RizzyUIConfig.LocalizationResourceType"/> or
/// <see cref="RizzyUIConfig.LocalizationResourceLocation"/>) are tried first, then RizzyUI's embedded
/// resources. Without it, RizzyUI's embedded resources are used directly, so components never render
/// resource keys (such as <c>RzSheet.CloseButtonAriaLabel</c>) as text or accessible names.
/// </remarks>
internal static class RizzyLocalizerProvider
{
    public static IStringLocalizer<RizzyLocalization> Create(IServiceProvider services)
    {
        var config = services.GetRequiredService<IOptions<RizzyUIConfig>>().Value;
        var appFactory = services.GetService<IStringLocalizerFactory>()
            ?? new ResourceManagerStringLocalizerFactory(
                Options.Create(new LocalizationOptions()),
                services.GetService<ILoggerFactory>() ?? NullLoggerFactory.Instance);

        var factory = new RizzyStringLocalizerFactory(
            appFactory,
            services,
            config.LocalizationResourceType,
            config.LocalizationResourceLocation);

        return new StringLocalizer<RizzyLocalization>(factory);
    }
}
