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
    /// Gets the surface background color in light mode, in Okclh.
    /// </summary>
    public Oklch Surface { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the surface in light mode.
    /// </summary>
    public Oklch OnSurface { get; init; }

    /// <summary>
    /// Gets the color used for strongly emphasized content displayed on the surface in light mode.
    /// </summary>
    public Oklch OnSurfaceStrong { get; init; }

    /// <summary>
    /// Gets the color used for disabled or inactive text elements.
    /// </summary>
    public Oklch OnSurfaceMuted { get; init; }

    /// <summary>
    /// Gets the alternate surface background color in light mode.
    /// </summary>
    public Oklch SurfaceAlt { get; init; }

    /// <summary>
    /// Gets the primary brand color in light mode.
    /// </summary>
    public Oklch Primary { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the primary color in light mode.
    /// </summary>
    public Oklch OnPrimary { get; init; }

    /// <summary>
    /// Gets the secondary brand color in light mode.
    /// </summary>
    public Oklch Secondary { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the secondary color in light mode.
    /// </summary>
    public Oklch OnSecondary { get; init; }

    /// <summary>
    /// Gets the outline color used for borders and dividers in light mode.
    /// </summary>
    public Oklch Outline { get; init; }

    /// <summary>
    /// Gets the stronger outline color used for heavier borders in light mode.
    /// </summary>
    public Oklch OutlineStrong { get; init; }

    /// <summary>
    /// Gets the surface background color in dark mode.
    /// </summary>
    public Oklch SurfaceDark { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the surface in dark mode.
    /// </summary>
    public Oklch OnSurfaceDark { get; init; }

    /// <summary>
    /// Gets the color used for strongly emphasized content displayed on the surface in dark mode.
    /// </summary>
    public Oklch OnSurfaceDarkStrong { get; init; }

    /// <summary>
    /// Gets the color used for disabled or inactive text elements.
    /// </summary>
    public Oklch OnSurfaceDarkMuted { get; init; }


    /// <summary>
    /// Gets the alternate surface background color in dark mode.
    /// </summary>
    public Oklch SurfaceAltDark { get; init; }

    /// <summary>
    /// Gets the primary brand color in dark mode.
    /// </summary>
    public Oklch PrimaryDark { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the primary color in dark mode.
    /// </summary>
    public Oklch OnPrimaryDark { get; init; }

    /// <summary>
    /// Gets the secondary brand color in dark mode.
    /// </summary>
    public Oklch SecondaryDark { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the secondary color in dark mode.
    /// </summary>
    public Oklch OnSecondaryDark { get; init; }

    /// <summary>
    /// Gets the outline color used for borders and dividers in dark mode.
    /// </summary>
    public Oklch OutlineDark { get; init; }

    /// <summary>
    /// Gets the stronger outline color used for heavier borders in dark mode.
    /// </summary>
    public Oklch OutlineDarkStrong { get; init; }

    /// <summary>
    /// Gets the color used to indicate dangerous or error states.
    /// </summary>
    public Oklch Danger { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on a dangerous or error surface.
    /// </summary>
    public Oklch OnDanger { get; init; }

    /// <summary>
    /// Gets the color used to indicate informational states.
    /// </summary>
    public Oklch Info { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on an informational surface.
    /// </summary>
    public Oklch OnInfo { get; init; }

    /// <summary>
    /// Gets the color used to indicate warning states.
    /// </summary>
    public Oklch Warning { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on a warning surface.
    /// </summary>
    public Oklch OnWarning { get; init; }

    /// <summary>
    /// Gets the color used to indicate success states.
    /// </summary>
    public Oklch Success { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on a success surface.
    /// </summary>
    public Oklch OnSuccess { get; init; }

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
