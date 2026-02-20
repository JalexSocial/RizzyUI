namespace RizzyUI;

/// <summary>
/// Defines the output format produced by <see cref="RzColorPicker"/>.
/// </summary>
public enum ColorFormat
{
    /// <summary>
    /// Produces hexadecimal color values.
    /// </summary>
    Hex,

    /// <summary>
    /// Produces RGB color values.
    /// </summary>
    Rgb,

    /// <summary>
    /// Produces HSL color values.
    /// </summary>
    Hsl,

    /// <summary>
    /// Automatically selects the best format for the input.
    /// </summary>
    Auto,

    /// <summary>
    /// Allows mixed output formats.
    /// </summary>
    Mixed
}
