using System.Globalization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RizzyUI;
using RizzyUI.Localization;

/// <summary>
/// A custom <see cref="IStringLocalizerFactory"/> implementation that decorates the
/// default ASP.NET Core factory. When creating a localizer for <see cref="RizzyLocalization"/>,
/// it ensures the library's embedded resources are found correctly, independent of the
/// application's `LocalizationOptions.ResourcesPath`, while still allowing application overrides
/// that *do* respect the application's configuration.
/// </summary>
internal sealed class RizzyStringLocalizerFactory : IStringLocalizerFactory
{
    private readonly IStringLocalizerFactory _originalFactory;
    private readonly IServiceProvider _serviceProvider; // Needed to create a separate factory instance
    private readonly Type? _localizationResourceType;
    private readonly string? _localizationResourceLocation;

    /// <summary>
    /// Initializes a new instance of the <see cref="RizzyStringLocalizerFactory"/> class.
    /// </summary>
    /// <param name="originalFactory">The original <see cref="IStringLocalizerFactory"/> being decorated.</param>
    /// <param name="serviceProvider">The service provider to resolve dependencies for creating a default factory.</param>
    /// <param name="localizationResourceType">The application-provided marker type for override resources (optional).</param>
    /// <param name="localizationResourceLocation">The application-provided location for override resources (optional).</param>
    /// <exception cref="ArgumentNullException">Thrown if <paramref name="originalFactory"/> or <paramref name="serviceProvider"/> is null.</exception>
    public RizzyStringLocalizerFactory(
        IStringLocalizerFactory originalFactory,
        IServiceProvider serviceProvider, // Inject IServiceProvider
        Type? localizationResourceType,
        string? localizationResourceLocation)
    {
        _originalFactory = originalFactory ?? throw new ArgumentNullException(nameof(originalFactory));
        _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
        _localizationResourceType = localizationResourceType;
        _localizationResourceLocation = localizationResourceLocation;
    }

    /// <summary>
    /// Creates an <see cref="IStringLocalizer"/> using the specified resource source type.
    /// If the type is <see cref="RizzyLocalization"/>, it returns a composite
    /// <see cref="RizzyStringLocalizer"/>. Otherwise, it delegates to the original factory.
    /// </summary>
    /// <param name="resourceSource">The <see cref="Type"/> to create a localizer for.</param>
    /// <returns>An appropriate <see cref="IStringLocalizer"/> instance.</returns>
    /// <exception cref="ArgumentNullException">Thrown if <paramref name="resourceSource"/> is null.</exception>
    public IStringLocalizer Create(Type resourceSource)
    {
        ArgumentNullException.ThrowIfNull(resourceSource);

        if (resourceSource == typeof(RizzyLocalization))
        {
            // --- Create the localizer for RizzyUI's own default embedded resources ---
            // Create a *new* factory instance with default options to bypass app's ResourcesPath.
            var loggerFactory = _serviceProvider.GetRequiredService<ILoggerFactory>();
            // Create default (empty) LocalizationOptions
            var defaultLocalizationOptions = Options.Create(new LocalizationOptions() { ResourcesPath = "Resources" });
            // Instantiate the default factory directly
            var librarySpecificFactory = new ResourceManagerStringLocalizerFactory(defaultLocalizationOptions, loggerFactory);
            // Use Create(Type) on *this specific factory instance*
            IStringLocalizer libraryLocalizer = librarySpecificFactory.Create(typeof(RizzyLocalization));

            // --- Create the localizer responsible for finding the application's override resources ---
            // This uses the *original* factory, thus respecting the application's configuration.
            IStringLocalizer appOverrideLocalizer;
            if (_localizationResourceType != null)
            {
                appOverrideLocalizer = _originalFactory.Create(_localizationResourceType);
            }
            else if (!string.IsNullOrEmpty(_localizationResourceLocation))
            {
                appOverrideLocalizer = _originalFactory.Create(Constants.RizzyLocalizationResourceName, _localizationResourceLocation);
            }
            else
            {
                appOverrideLocalizer = DummyLocalizer.Instance;
            }

            // Return the composite localizer.
            return new RizzyStringLocalizer(appOverrideLocalizer, libraryLocalizer);
        }

        // For any other type request, delegate directly to the original factory.
        return _originalFactory.Create(resourceSource);
    }

    /// <summary>
    /// Creates an <see cref="IStringLocalizer"/> using the specified base name and location.
    /// Delegates directly to the original factory.
    /// </summary>
    /// <param name="baseName">The base name of the resource.</param>
    /// <param name="location">The location (assembly name) to search for the resource.</param>
    /// <returns>An <see cref="IStringLocalizer"/> instance.</returns>
    /// <exception cref="ArgumentNullException">Thrown if <paramref name="baseName"/> or <paramref name="location"/> is null.</exception>
    public IStringLocalizer Create(string baseName, string location)
    {
        ArgumentNullException.ThrowIfNull(baseName);
        ArgumentNullException.ThrowIfNull(location);

        // Standard behavior: Delegate directly to the decorated factory.
        return _originalFactory.Create(baseName, location);
    }

    /// <summary>
    /// A private dummy localizer used when no application overrides are configured.
    /// </summary>
    private sealed class DummyLocalizer : IStringLocalizer
    {
        public static readonly DummyLocalizer Instance = new();
        private DummyLocalizer() { }
        public LocalizedString this[string name] => new(name, name, resourceNotFound: true);
        public LocalizedString this[string name, params object[] arguments] => new(name, name, resourceNotFound: true);
        public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures) => [];
    }
}