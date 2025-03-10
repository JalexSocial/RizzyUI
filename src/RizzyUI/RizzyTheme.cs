#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.
namespace RizzyUI;

/// <summary>
/// Represents the theme data for the application. Holds semantic colors and other design tokens,
/// now using OKLCH instead of RGB.
/// </summary>
public class RizzyTheme(string name, string themeCode)
{
    /// <summary>
    /// Full proper name of the theme.
    /// </summary>
    public string Name { get; init; } = name;

    /// <summary>
    /// Short code name of the theme (no spaces)
    /// </summary>
    public string ThemeCode { get; init; } = themeCode;

    /// <summary>
    /// Color scheme for light mode variant
    /// </summary>
    public RizzyThemeVariant Light { get; set; } = new();

    /// <summary>
    /// Color scheme for dark mode variant
    /// </summary>
    public RizzyThemeVariant Dark { get; set; } = new();

    /// <summary>
    /// Gets the color used to indicate dangerous or error states.
    /// </summary>
    public Color Danger { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on a dangerous or error surface.
    /// </summary>
    public Color OnDanger { get; init; }

    /// <summary>
    /// Gets the color used to indicate informational states.
    /// </summary>
    public Color Info { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on an informational surface.
    /// </summary>
    public Color OnInfo { get; init; }

    /// <summary>
    /// Gets the color used to indicate warning states.
    /// </summary>
    public Color Warning { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on a warning surface.
    /// </summary>
    public Color OnWarning { get; init; }

    /// <summary>
    /// Gets the color used to indicate success states.
    /// </summary>
    public Color Success { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on a success surface.
    /// </summary>
    public Color OnSuccess { get; init; }

    /// <summary>
    /// Gets the default border width.
    /// </summary>
    public string BorderWidth { get; init; }

    /// <summary>
    /// Gets the default border radius.
    /// </summary>
    public string BorderRadius { get; init; }

    /// <summary>
    /// A default theme instance, using the values from the provided Tailwind configuration.
    /// </summary>
    public static RizzyTheme Default => RizzyTheme.ArcticTheme;

    /// <summary>
    /// Icy theme with cool blues and neutral grays
    /// </summary>
    public static RizzyTheme ArcticTheme => new ArcticTheme();

    /// <summary>
    /// High contrast theme
    /// </summary>
    public static RizzyTheme HighContrastTheme = new HighContrastTheme();

    /// <summary>
    /// Professional theme with neutral colors
    /// </summary>
    public static RizzyTheme ModernTheme = new ModernTheme();

    /// <summary>
    /// Newsy theme
    /// </summary>
    public static RizzyTheme NewsTheme = new NewsTheme();
}
