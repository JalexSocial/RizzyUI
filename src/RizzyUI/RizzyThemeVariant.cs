#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

namespace RizzyUI;

/// <summary>
/// Defines a base shared color theme
/// </summary>
public class RizzyThemeVariant
{
    /// <summary>
    /// Gets the surface background color
    /// </summary>
    public Color Surface { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the surface.
    /// </summary>
    public Color OnSurface { get; init; }

    /// <summary>
    /// Gets the color used for strongly emphasized content displayed on the surface.
    /// </summary>
    public Color OnSurfaceStrong { get; init; }

    /// <summary>
    /// Gets the color used for disabled or inactive text elements.
    /// </summary>
    public Color OnSurfaceMuted { get; init; }

    /// <summary>
    /// Gets the alternate surface background color.
    /// </summary>
    public Color SurfaceAlt { get; init; }

    /// <summary>
    /// Gets the tertiary surface background color.
    /// </summary>
    public Color SurfaceTertiary { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the tertiary surface.
    /// </summary>
    public Color OnSurfaceTertiary { get; init; }

    /// <summary>
    /// Gets the primary brand color.
    /// </summary>
    public Color Primary { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the primary color.
    /// </summary>
    public Color OnPrimary { get; init; }

    /// <summary>
    /// Gets the secondary brand color.
    /// </summary>
    public Color Secondary { get; init; }

    /// <summary>
    /// Gets the color used for content displayed on the secondary color.
    /// </summary>
    public Color OnSecondary { get; init; }

    /// <summary>
    /// Gets the outline color used for borders and dividers.
    /// </summary>
    public Color Outline { get; init; }

    /// <summary>
    /// Gets the stronger outline color used for heavier borders.
    /// </summary>
    public Color OutlineStrong { get; init; }

    /// <summary>
    /// Gets the code theme for this variant
    /// </summary>
    public RizzyCodeTheme Code { get; init; }
}

