
using System;
using System.IO;
using System.Linq;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;

namespace RizzyUI.Localization;

/// <summary>
/// A custom <see cref="IStringLocalizerFactory"/> implementation that decorates the
/// default ASP.NET Core factory. Its primary role is to intercept requests for
/// <c>IStringLocalizer&lt;RizzyLocalization&gt;</c> and provide a specialized
/// <see cref="RizzyStringLocalizer"/> instance. This instance allows consuming applications
/// to override or augment RizzyUI's default translations by providing their own resource files.
/// </summary>
internal sealed class RizzyStringLocalizerFactory : IStringLocalizerFactory
{
    private readonly IStringLocalizerFactory _originalFactory;
    private readonly Type? _localizationResourceType;
    private readonly string? _localizationResourceLocation;
    private const string OverrideResourceBaseName = Constants.RizzyLocalizationResourceName; // Convention for user override files

    /// <summary>
    /// Initializes a new instance of the <see cref="RizzyStringLocalizerFactory"/> class.
    /// </summary>
    /// <param name="originalFactory">The original <see cref="IStringLocalizerFactory"/> being decorated.</param>
    /// <param name="localizationResourceType">The application-provided marker type for override resources (optional).</param>
    /// <param name="localizationResourceLocation">The application-provided location for override resources (optional).</param>
    /// <exception cref="ArgumentNullException">Thrown if <paramref name="originalFactory"/> is null.</exception>
    /// <exception cref="ArgumentException">Thrown if neither <paramref name="localizationResourceType"/> nor <paramref name="localizationResourceLocation"/> is provided, as overrides cannot be located.</exception>
    public RizzyStringLocalizerFactory(
        IStringLocalizerFactory originalFactory,
        Type? localizationResourceType,
        string? localizationResourceLocation)
    {
        _originalFactory = originalFactory ?? throw new ArgumentNullException(nameof(originalFactory));
        _localizationResourceType = localizationResourceType;
        _localizationResourceLocation = localizationResourceLocation;

        // Validate that the consuming application provided configuration for overrides.
        if (_localizationResourceType == null && string.IsNullOrEmpty(_localizationResourceLocation))
        {
             throw new ArgumentException($"To enable RizzyUI localization overrides, either {nameof(RizzyUIConfig.LocalizationResourceType)} or {nameof(RizzyUIConfig.LocalizationResourceLocation)} must be configured via AddRizzyUI() in Program.cs.");
        }
    }

    /// <summary>
    /// Creates an <see cref="IStringLocalizer"/> using the specified resource source type.
    /// If the type is <see cref="RizzyLocalization"/>, it returns a composite
    /// <see cref="RizzyStringLocalizer"/> that checks application overrides first;
    /// otherwise, it delegates to the original factory.
    /// </summary>
    /// <param name="resourceSource">The <see cref="Type"/> to create a localizer for.</param>
    /// <returns>An appropriate <see cref="IStringLocalizer"/> instance.</returns>
    /// <exception cref="ArgumentNullException">Thrown if <paramref name="resourceSource"/> is null.</exception>
    public IStringLocalizer Create(Type resourceSource)
    {
        ArgumentNullException.ThrowIfNull(resourceSource);

        // Check if the request is specifically for RizzyUI's internal localizer marker.
        if (resourceSource == typeof(RizzyLocalization))
        {
            // Create the localizer responsible for finding the application's override resources.
            IStringLocalizer appOverrideLocalizer;
            if (_localizationResourceType != null)
            {
                // User provided a specific marker type for their overrides.
                appOverrideLocalizer = _originalFactory.Create(_localizationResourceType);
            }
            else // User provided a location string (e.g., "WebApp.Resources")
            {
                // Use the location provided by the application config and the convention name.
                appOverrideLocalizer = _originalFactory.Create(OverrideResourceBaseName, _localizationResourceLocation!);
            }

            // Create the localizer for RizzyUI's own default embedded resources using its marker type.
            IStringLocalizer libraryLocalizer = _originalFactory.Create(typeof(RizzyLocalization));

            // Return the composite localizer that prioritizes the application's overrides.
            return new RizzyStringLocalizer(appOverrideLocalizer, libraryLocalizer);
        }

        // For any other type request, delegate directly to the original factory.
        return _originalFactory.Create(resourceSource);
    }

    /// <summary>
    /// Creates an <see cref="IStringLocalizer"/> using the specified base name and location.
    /// This overload typically delegates directly to the original factory, as the
    /// type-based <see cref="Create(Type)"/> overload is the primary mechanism for
    /// intercepting requests for RizzyUI's specific localizer.
    /// </summary>
    /// <param name="baseName">The base name of the resource.</param>
    /// <param name="location">The location (assembly name or root namespace) to search for the resource.</param>
    /// <returns>An <see cref="IStringLocalizer"/> instance.</returns>
    /// <exception cref="ArgumentNullException">Thrown if <paramref name="baseName"/> or <paramref name="location"/> is null.</exception>
    public IStringLocalizer Create(string baseName, string location)
    {
        ArgumentNullException.ThrowIfNull(baseName);
        ArgumentNullException.ThrowIfNull(location);

        // Standard behavior: Delegate directly to the decorated factory.
        return _originalFactory.Create(baseName, location);
    }
}