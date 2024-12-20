using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RizzyUI;

/// <summary>
/// Represents the theme data for the application. Holds semantic colors and other design tokens.
/// </summary>
public class RizzyTheme (string name, string themeCode)
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
    /// Gets the surface background color in light mode.
    /// </summary>
    public RgbColor Surface { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the surface in light mode.
    /// </summary>
    public RgbColor OnSurface { get; init; }

    /// <summary>
    /// Gets the color used for strongly emphasized content displayed on the surface in light mode.
    /// </summary>
    public RgbColor OnSurfaceStrong { get; init; }

    /// <summary>
    /// Gets the alternate surface background color in light mode.
    /// </summary>
    public RgbColor SurfaceAlt { get; init; }

    /// <summary>
    /// Gets the primary brand color in light mode.
    /// </summary>
    public RgbColor Primary { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the primary color in light mode.
    /// </summary>
    public RgbColor OnPrimary { get; init; }

    /// <summary>
    /// Gets the secondary brand color in light mode.
    /// </summary>
    public RgbColor Secondary { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the secondary color in light mode.
    /// </summary>
    public RgbColor OnSecondary { get; init; }

    /// <summary>
    /// Gets the outline color used for borders and dividers in light mode.
    /// </summary>
    public RgbColor Outline { get; init; }

    /// <summary>
    /// Gets the stronger outline color used for heavier borders in light mode.
    /// </summary>
    public RgbColor OutlineStrong { get; init; }

    /// <summary>
    /// Gets the surface background color in dark mode.
    /// </summary>
    public RgbColor SurfaceDark { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the surface in dark mode.
    /// </summary>
    public RgbColor OnSurfaceDark { get; init; }

    /// <summary>
    /// Gets the color used for strongly emphasized content displayed on the surface in dark mode.
    /// </summary>
    public RgbColor OnSurfaceStrongDark { get; init; }

    /// <summary>
    /// Gets the alternate surface background color in dark mode.
    /// </summary>
    public RgbColor SurfaceAltDark { get; init; }

    /// <summary>
    /// Gets the primary brand color in dark mode.
    /// </summary>
    public RgbColor PrimaryDark { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the primary color in dark mode.
    /// </summary>
    public RgbColor OnPrimaryDark { get; init; }

    /// <summary>
    /// Gets the secondary brand color in dark mode.
    /// </summary>
    public RgbColor SecondaryDark { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the secondary color in dark mode.
    /// </summary>
    public RgbColor OnSecondaryDark { get; init; }

    /// <summary>
    /// Gets the outline color used for borders and dividers in dark mode.
    /// </summary>
    public RgbColor OutlineDark { get; init; }

    /// <summary>
    /// Gets the stronger outline color used for heavier borders in dark mode.
    /// </summary>
    public RgbColor OutlineStrongDark { get; init; }

    /// <summary>
    /// Gets the color used to indicate dangerous or error states.
    /// </summary>
    public RgbColor Danger { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on a dangerous or error surface.
    /// </summary>
    public RgbColor OnDanger { get; init; }

    /// <summary>
    /// Gets the color used to indicate informational states.
    /// </summary>
    public RgbColor Info { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on an informational surface.
    /// </summary>
    public RgbColor OnInfo { get; init; }

    /// <summary>
    /// Gets the color used to indicate warning states.
    /// </summary>
    public RgbColor Warning { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on a warning surface.
    /// </summary>
    public RgbColor OnWarning { get; init; }

    /// <summary>
    /// Gets the color used to indicate success states.
    /// </summary>
    public RgbColor Success { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on a success surface.
    /// </summary>
    public RgbColor OnSuccess { get; init; }

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