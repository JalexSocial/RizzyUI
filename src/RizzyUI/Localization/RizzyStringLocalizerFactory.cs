using System.Globalization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RizzyUI.Localization;

namespace RizzyUI;

/// <summary>
/// A custom <see cref="IStringLocalizerFactory"/> implementation that decorates the
/// default ASP.NET Core factory. When creating a localizer for <see cref="RizzyLocalization"/>,
/// it ensures the library's embedded resources are found correctly, independent of the
/// application's `LocalizationOptions.ResourcesPath`, while still allowing application overrides
/// that *do* respect the application's configuration. It caches the library-specific localizer
/// for performance.
/// </summary>
internal sealed class RizzyStringLocalizerFactory : IStringLocalizerFactory
{
    private readonly IStringLocalizerFactory _originalFactory;
    private readonly IServiceProvider _serviceProvider; // Needed to create a separate factory instance
    private readonly Type? _localizationResourceType;
    private readonly string? _localizationResourceLocation;

    // Replace the field and lock with a Lazy<T> instance
    private readonly Lazy<IStringLocalizer> _cachedLibraryLocalizer;

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
        IServiceProvider serviceProvider,
        Type? localizationResourceType,
        string? localizationResourceLocation)
    {
        _originalFactory = originalFactory ?? throw new ArgumentNullException(nameof(originalFactory));
        _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
        _localizationResourceType = localizationResourceType;
        _localizationResourceLocation = localizationResourceLocation;
        
        // Initialize the lazy field with a factory delegate
        _cachedLibraryLocalizer = new Lazy<IStringLocalizer>(CreateLibraryLocalizer, LazyThreadSafetyMode.ExecutionAndPublication);
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
            // --- Get/Create the library localizer (cached) ---
            // This uses a separate factory instance with default options to ensure
            // RizzyUI's embedded resources are found regardless of app settings.
            var libraryLocalizer = GetOrCreateLibraryLocalizer();

            // --- Create the application override localizer (respects app config) ---
            // This uses the original factory passed in, so it honors the app's LocalizationOptions.
            IStringLocalizer appOverrideLocalizer = CreateAppOverrideLocalizer();

            // Return the composite localizer that handles the fallback logic.
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
        return _originalFactory.Create(baseName, location);
    }

    /// <summary>
    /// Gets the cached library-specific localizer, lazily initialized in a thread-safe manner.
    /// </summary>
    /// <returns>The <see cref="IStringLocalizer"/> for RizzyUI's internal resources.</returns>
    private IStringLocalizer GetOrCreateLibraryLocalizer()
    {
        return _cachedLibraryLocalizer.Value;
    }

    /// <summary>
    /// Creates the library-specific localizer.
    /// </summary>
    /// <returns>A new <see cref="IStringLocalizer"/> for RizzyUI's internal resources.</returns>
    private IStringLocalizer CreateLibraryLocalizer()
    {
        // Resolve dependencies needed to create a default factory instance
        var loggerFactory = _serviceProvider.GetRequiredService<ILoggerFactory>();
        // Use default (empty) LocalizationOptions to ignore app's ResourcesPath
        var defaultLocalizationOptions = Options.Create(new LocalizationOptions() { ResourcesPath = "Resources"});
        // Instantiate the default Microsoft factory directly
        var librarySpecificFactory = new ResourceManagerStringLocalizerFactory(defaultLocalizationOptions, loggerFactory);
        // Create the localizer using the type marker, ensuring it finds embedded resources
        return librarySpecificFactory.Create(typeof(RizzyLocalization));
    }

    /// <summary>
    /// Creates the localizer for the application's override resources using the original factory.
    /// </summary>
    /// <returns>An <see cref="IStringLocalizer"/> for overrides, or a dummy if not configured.</returns>
    private IStringLocalizer CreateAppOverrideLocalizer()
    {
        if (_localizationResourceType != null)
        {
            // Use the type provided by the application config
            return _originalFactory.Create(_localizationResourceType);
        }
        if (!string.IsNullOrEmpty(_localizationResourceLocation))
        {
            // Use the location and convention name provided by the application config
            return _originalFactory.Create(Constants.RizzyLocalizationResourceName, _localizationResourceLocation);
        }
        // No override config provided, return the dummy instance
        return DummyLocalizer.Instance;
    }

    /// <summary>
    /// A private dummy localizer used when no application overrides are configured.
    /// </summary>
    private sealed class DummyLocalizer : IStringLocalizer
    {
        /// <summary>
        /// Gets the singleton instance of the dummy localizer.
        /// </summary>
        public static readonly DummyLocalizer Instance = new();

        // Private constructor to prevent external instantiation.
        private DummyLocalizer() { }

        /// <inheritdoc />
        public LocalizedString this[string name] => new(name, name, resourceNotFound: true);

        /// <inheritdoc />
        public LocalizedString this[string name, params object[] arguments] => new(name, name, resourceNotFound: true);

        /// <inheritdoc />
        public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures) => [];
    }
}
