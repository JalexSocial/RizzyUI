
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging; // Required for ILogger

namespace RizzyUI.Localization;

/// <summary>
/// A dummy implementation of <see cref="IStringLocalizer{T}"/> for <see cref="RizzyLocalization"/>.
/// This is registered as a fallback when the consuming application has not configured
/// standard ASP.NET Core localization services. It returns the requested resource key
/// as the localized value and logs a warning upon creation.
/// </summary>
internal sealed class DummyRizzyStringLocalizer : IStringLocalizer<RizzyLocalization>
{
    private readonly ILogger<DummyRizzyStringLocalizer> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="DummyRizzyStringLocalizer"/> class
    /// and logs a warning indicating that localization services are missing.
    /// </summary>
    /// <param name="logger">The logger instance.</param>
    public DummyRizzyStringLocalizer(ILogger<DummyRizzyStringLocalizer> logger)
    {
        _logger = logger;
        // Log the warning only once when this dummy localizer is instantiated.
        _logger.LogWarning("RizzyUI: ASP.NET Core Localization services (AddLocalization) were not detected or IStringLocalizerFactory is missing. RizzyUI components will display resource keys instead of localized text. Configure localization in Program.cs to enable translations.");
    }

    /// <summary>
    /// Returns a <see cref="LocalizedString"/> where the value is the resource key itself,
    /// indicating that the resource was not found because localization is not configured.
    /// </summary>
    /// <param name="name">The name (key) of the string resource.</param>
    /// <returns>A <see cref="LocalizedString"/> with the key as the value and ResourceNotFound set to true.</returns>
    public LocalizedString this[string name] =>
        // Return the key itself as the value, marking it as not found.
        new(name, name, resourceNotFound: true);

    /// <summary>
    /// Returns a formatted <see cref="LocalizedString"/> where the value is the resource key itself,
    /// indicating that the resource was not found because localization is not configured.
    /// Formatting arguments are ignored as there is no format string.
    /// </summary>
    /// <param name="name">The name (key) of the string resource.</param>
    /// <param name="arguments">The formatting arguments (ignored).</param>
    /// <returns>A <see cref="LocalizedString"/> with the key as the value and ResourceNotFound set to true.</returns>
    public LocalizedString this[string name, params object[] arguments] =>
        // Return the key itself, arguments are ignored as there's no format string.
        new(name, name, resourceNotFound: true);

    /// <summary>
    /// Returns an empty enumeration, as no localized strings are available
    /// when using this dummy implementation.
    /// </summary>
    /// <param name="includeParentCultures">This parameter is ignored.</param>
    /// <returns>An empty <see cref="IEnumerable{LocalizedString}"/>.</returns>
    public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures)
    {
        // No strings are technically "found" in this dummy implementation.
        return [];
    }
}