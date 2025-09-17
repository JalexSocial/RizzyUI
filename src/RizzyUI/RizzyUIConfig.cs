
namespace RizzyUI;

/// <summary>
/// Provides configuration options for the RizzyUI library.
/// </summary>
public sealed class RizzyUIConfig
{
    /// <summary>
    /// Gets or sets a dictionary of logical asset names to their CDN or local URLs.
    /// This allows for central management and user overrides of component dependencies.
    /// </summary>
    public Dictionary<string, string> AssetUrls { get; set; } = new();

    /// <summary>
    /// Gets or sets the default theme to be used by RizzyUI components if no theme is
    /// explicitly provided via <see cref="RzThemeProvider"/>.
    /// Defaults to <see cref="RzTheme.ArcticTheme"/>.
    /// </summary>
    public RzTheme DefaultTheme { get; set; } = RzTheme.Default;

    /// <summary>
    /// Gets or sets the list of available themes that can be used within the application.
    /// This list can be populated during startup using the <see cref="RzThemeLoader"/> or by adding themes manually.
    /// </summary>
    public List<RzTheme> AvailableThemes { get; set; } = new ();
    
    /// <summary>
    /// Gets or sets the marker <see cref="Type"/> used by the consuming application to identify
    /// its resource files (.resx) intended for overriding or augmenting RizzyUI's default translations.
    /// The resource files associated with this type should follow the naming convention `RizzyLocalization.{culture}.resx`.
    /// </summary>
    /// <remarks>
    /// <para>
    /// If this property is set, RizzyUI's localization system will first look for translations
    /// within the application's resources associated with this type. If a key (e.g., "RzButton.AssistiveLabelDefault")
    /// is found, that translation will be used. If not found, it will fall back to RizzyUI's
    /// embedded default translation (found in `RizzyLocalization.resx` within the library).
    /// </para>
    /// <para>
    /// This allows users to customize RizzyUI component text or provide translations for languages
    /// not included in the library.
    /// </para>
    /// <para>
    /// This requires standard ASP.NET Core localization services (<c>AddLocalization</c>, <c>UseRequestLocalization</c>)
    /// to be configured in the consuming application's <c>Program.cs</c>.
    /// </para>
    /// <para>
    /// If both <see cref="LocalizationResourceType"/> and <see cref="LocalizationResourceLocation"/> are set,
    /// <see cref="LocalizationResourceType"/> takes precedence.
    /// </para>
    /// <example>
    /// In Program.cs:
    /// <code>
    /// builder.Services.AddRizzyUI(config =>
    /// {
    ///     // Assumes a marker type exists in the consuming app:
    ///     // namespace MyWebApp.Localization { public class RizzyOverrides { } }
    ///     config.LocalizationResourceType = typeof(MyWebApp.Localization.RizzyOverrides);
    /// });
    /// </code>
    /// The application would then provide `Resources/MyWebApp.Localization.RizzyOverrides.es.resx`
    /// containing keys like `RzButton.AssistiveLabelDefault`.
    /// </example>
    /// </remarks>
    public Type? LocalizationResourceType { get; set; }

    /// <summary>
    /// Gets or sets the resource location (typically the assembly name or root namespace) where the
    /// consuming application stores its RizzyUI override resource files.
    /// </summary>
    /// <remarks>
    /// <para>
    /// Use this property if you don't have a specific marker <see cref="Type"/> for your override resources,
    /// but you follow the convention of naming the resource files <c>RizzyLocalization.resx</c>,
    /// <c>RizzyLocalization.es.resx</c>, etc., and place them within a designated location
    /// (e.g., a "Resources" folder within your application's project structure).
    /// </para>
    /// <para>
    /// The value should typically be the root namespace or assembly name where the resources reside,
    /// matching the configuration used in <c>AddLocalization</c>. The localization system will look
    /// for resources named `RizzyLocalization` within this location.
    /// </para>
    /// <para>
    /// <see cref="LocalizationResourceType"/> takes precedence if both are configured.
    /// </para>
    /// <para>
    /// Requires standard ASP.NET Core localization services to be configured.
    /// </para>
    /// <example>
    /// In Program.cs:
    /// <code>
    /// // Assuming override files are in WebApp/Resources/RizzyLocalization.resx
    /// builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");
    /// builder.Services.AddRizzyUI(config =>
    /// {
    ///     config.LocalizationResourceLocation = "WebApp"; // Root namespace of the application
    /// });
    /// </code>
    /// </example>
    /// </remarks>
    public string? LocalizationResourceLocation { get; set; }
}