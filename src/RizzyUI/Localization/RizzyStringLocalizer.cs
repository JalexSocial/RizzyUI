using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Microsoft.Extensions.Localization;

namespace RizzyUI.Localization;

/// <summary>
/// Implements <see cref="IStringLocalizer"/> by first attempting to find a localized string
/// in the resources provided by the consuming application (override resources), and if not found,
/// falling back to the default resources embedded within the RizzyUI library.
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
    /// <param name="applicationOverrideLocalizer">The string localizer for the application's override resources.</param>
    /// <param name="rizzyLocalizer">The string localizer for RizzyUI's default embedded resources.</param> 
    /// <exception cref="ArgumentNullException">Thrown if applicationOverrideLocalizer or rizzyLocalizer is null.</exception>
    public RizzyStringLocalizer(
        IStringLocalizer applicationOverrideLocalizer,
        IStringLocalizer rizzyLocalizer) 
    {
        _applicationOverrideLocalizer = applicationOverrideLocalizer ?? throw new ArgumentNullException(nameof(applicationOverrideLocalizer));
        _rizzyLocalizer = rizzyLocalizer ?? throw new ArgumentNullException(nameof(rizzyLocalizer)); 
    }

    /// <summary>
    /// Gets the localized string for the specified name, prioritizing the application's resources
    /// for the current UI culture, then falling back to RizzyUI's default embedded resources.
    /// </summary>
    /// <param name="name">The name of the string resource.</param>
    /// <returns>The localized string.</returns>
    public LocalizedString this[string name]
    {
        get
        {
            var appString = _applicationOverrideLocalizer[name];
            // Use the application's string if it was found.
            if (!appString.ResourceNotFound)
            {
                return appString;
            }
            // Otherwise, fall back to the RizzyUI library's default string.
            return _rizzyLocalizer[name]; // Use renamed field
        }
    }

    /// <summary>
    /// Gets the formatted localized string for the specified name, prioritizing the application's resources
    /// for the current UI culture, then falling back to RizzyUI's default embedded resources.
    /// </summary>
    /// <param name="name">The name of the string resource.</param>
    /// <param name="arguments">The values to format the string with.</param>
    /// <returns>The formatted localized string.</returns>
    public LocalizedString this[string name, params object[] arguments]
    {
        get
        {
            var appString = _applicationOverrideLocalizer[name, arguments];
            if (!appString.ResourceNotFound)
            {
                return appString;
            }
            return _rizzyLocalizer[name, arguments]; 
        }
    }

    /// <summary>
    /// Gets all localized strings for the current UI culture, merging application overrides with
    /// RizzyUI's default embedded resources. Application strings take precedence if keys conflict.
    /// </summary>
    /// <param name="includeParentCultures">
    /// A flag indicating whether strings from parent cultures should be included in the results.
    /// </param>
    /// <returns>A collection of localized strings.</returns>
    public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures)
    {
        // Start with RizzyUI's default strings as the base.
        var mergedStrings = _rizzyLocalizer.GetAllStrings(includeParentCultures) 
                               .ToDictionary(ls => ls.Name, ls => ls);

        // Get application strings and add/overwrite entries in the dictionary.
        var appStrings = _applicationOverrideLocalizer.GetAllStrings(includeParentCultures);
        foreach (var appString in appStrings)
        {
            mergedStrings[appString.Name] = appString; // Overwrites library string if key exists
        }

        return mergedStrings.Values;
    }
}