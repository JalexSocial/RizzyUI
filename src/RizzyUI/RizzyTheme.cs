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
    /// Gets the surface background color in light mode
    /// </summary>
    public Color Surface { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the surface in light mode.
    /// </summary>
    public Color OnSurface { get; init; }

    /// <summary>
    /// Gets the color used for strongly emphasized content displayed on the surface in light mode.
    /// </summary>
    public Color OnSurfaceStrong { get; init; }

    /// <summary>
    /// Gets the color used for disabled or inactive text elements.
    /// </summary>
    public Color OnSurfaceMuted { get; init; }

    /// <summary>
    /// Gets the alternate surface background color in light mode.
    /// </summary>
    public Color SurfaceAlt { get; init; }

    /// <summary>
    /// Gets the primary brand color in light mode.
    /// </summary>
    public Color Primary { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the primary color in light mode.
    /// </summary>
    public Color OnPrimary { get; init; }

    /// <summary>
    /// Gets the secondary brand color in light mode.
    /// </summary>
    public Color Secondary { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the secondary color in light mode.
    /// </summary>
    public Color OnSecondary { get; init; }

    /// <summary>
    /// Gets the outline color used for borders and dividers in light mode.
    /// </summary>
    public Color Outline { get; init; }

    /// <summary>
    /// Gets the stronger outline color used for heavier borders in light mode.
    /// </summary>
    public Color OutlineStrong { get; init; }

    /// <summary>
    /// Gets the surface background color in dark mode.
    /// </summary>
    public Color SurfaceDark { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the surface in dark mode.
    /// </summary>
    public Color OnSurfaceDark { get; init; }

    /// <summary>
    /// Gets the color used for strongly emphasized content displayed on the surface in dark mode.
    /// </summary>
    public Color OnSurfaceDarkStrong { get; init; }

    /// <summary>
    /// Gets the color used for disabled or inactive text elements.
    /// </summary>
    public Color OnSurfaceDarkMuted { get; init; }


    /// <summary>
    /// Gets the alternate surface background color in dark mode.
    /// </summary>
    public Color SurfaceAltDark { get; init; }

    /// <summary>
    /// Gets the primary brand color in dark mode.
    /// </summary>
    public Color PrimaryDark { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the primary color in dark mode.
    /// </summary>
    public Color OnPrimaryDark { get; init; }

    /// <summary>
    /// Gets the secondary brand color in dark mode.
    /// </summary>
    public Color SecondaryDark { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the secondary color in dark mode.
    /// </summary>
    public Color OnSecondaryDark { get; init; }

    /// <summary>
    /// Gets the outline color used for borders and dividers in dark mode.
    /// </summary>
    public Color OutlineDark { get; init; }

    /// <summary>
    /// Gets the stronger outline color used for heavier borders in dark mode.
    /// </summary>
    public Color OutlineDarkStrong { get; init; }

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
    public static RizzyTheme Default => new ArcticTheme();
}
