
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Microsoft.Extensions.Localization;

namespace RizzyUI.Localization;

/// <summary>
/// Implements <see cref="IStringLocalizer{T}"/> for <see cref="RizzyLocalization"/> by first attempting
/// to find a localized string in the resources provided by the consuming application (override resources),
/// and if not found (or if the override only returned the key), falling back to the default resources
/// embedded within the RizzyUI library.
/// </summary>
/// <remarks>
/// This enables users of the RizzyUI library to override default translations or provide
/// translations for cultures not directly supported by the library. The correct culture is
/// determined by the ambient <see cref="CultureInfo.CurrentUICulture"/>.
/// </remarks>
internal sealed class RizzyStringLocalizer : IStringLocalizer<RizzyLocalization>, IStringLocalizer
{
    private readonly IStringLocalizer _applicationOverrideLocalizer;
    private readonly IStringLocalizer _rizzyLocalizer;

    /// <summary>
    /// Initializes a new instance of the <see cref="RizzyStringLocalizer"/> class.
    /// </summary>
    /// <param name="applicationOverrideLocalizer">The string localizer for the application's override resources (or a dummy if none configured).</param>
    /// <param name="rizzyLocalizer">The string localizer for RizzyUI's default embedded resources.</param>
    /// <exception cref="ArgumentNullException">Thrown if <paramref name="applicationOverrideLocalizer"/> or <paramref name="rizzyLocalizer"/> is null.</exception>
    public RizzyStringLocalizer(
        IStringLocalizer applicationOverrideLocalizer,
        IStringLocalizer rizzyLocalizer)
    {
        _applicationOverrideLocalizer = applicationOverrideLocalizer ?? throw new ArgumentNullException(nameof(applicationOverrideLocalizer));
        _rizzyLocalizer = rizzyLocalizer ?? throw new ArgumentNullException(nameof(rizzyLocalizer));
    }

    /// <summary>
    /// Gets the localized string for the specified name.
    /// It checks the application's override localizer first. If the resource is found there
    /// (and the value is not just the key itself), it returns the application's value.
    /// Otherwise, it falls back to RizzyUI's default embedded localizer.
    /// </summary>
    /// <param name="name">The name (key) of the string resource.</param>
    /// <returns>The localized string.</returns>
    public LocalizedString this[string name]
    {
        get
        {
            var appString = _applicationOverrideLocalizer[name];
            // Check if the resource was truly found in the application override
            // Some localizers might return the key if not found, so check both flags.
            if (!appString.ResourceNotFound || !appString.Value.Equals(name, StringComparison.Ordinal))
            {
                return appString;
            }

            // Fallback to the library's default localizer
            return _rizzyLocalizer[name];
        }
    }

    /// <summary>
    /// Gets the formatted localized string for the specified name.
    /// It checks the application's override localizer first. If the resource is found there
    /// (and the value is not just the key itself), it returns the application's formatted value.
    /// Otherwise, it falls back to RizzyUI's default embedded localizer for formatting.
    /// </summary>
    /// <param name="name">The name (key) of the string resource.</param>
    /// <param name="arguments">The values to format the string with.</param>
    /// <returns>The formatted localized string.</returns>
    public LocalizedString this[string name, params object[] arguments]
    {
        get
        {
            var appString = _applicationOverrideLocalizer[name, arguments];
             if (!appString.ResourceNotFound || !appString.Value.Equals(name, StringComparison.Ordinal))
            {
                return appString;
            }
            // Fallback to the library's default localizer for formatting
            return _rizzyLocalizer[name, arguments];
        }
    }

    /// <summary>
    /// Gets all localized strings for the current UI culture, merging application overrides with
    /// RizzyUI's default embedded resources. Application strings take precedence if keys conflict
    /// and the application resource was actually found (not just the key returned).
    /// </summary>
    /// <param name="includeParentCultures">Flag indicating whether strings from parent cultures should be included.</param>
    /// <returns>A collection of localized strings, with application overrides taking precedence.</returns>
    public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures)
    {
        // Start with RizzyUI's default strings as the base.
        var mergedStrings = _rizzyLocalizer.GetAllStrings(includeParentCultures)
                               .ToDictionary(ls => ls.Name, ls => ls);

        // Get application strings and merge/overwrite entries in the dictionary.
        var appStrings = _applicationOverrideLocalizer.GetAllStrings(includeParentCultures);
        foreach (var appString in appStrings)
        {
            // Only overwrite if the application resource was truly found
            if (!appString.ResourceNotFound || !appString.Value.Equals(appString.Name, StringComparison.Ordinal))
            {
                 mergedStrings[appString.Name] = appString; // Overwrites library string if key exists
            }
        }

        return mergedStrings.Values;
    }
}