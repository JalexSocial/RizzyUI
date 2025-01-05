namespace RizzyUI;

/// <summary>
/// Represents an RGB color.
/// </summary>
/// <param name="R">The red component of the color (0-255).</param>
/// <param name="G">The green component of the color (0-255).</param>
/// <param name="B">The blue component of the color (0-255).</param>
public readonly record struct RgbColor(byte R, byte G, byte B)
{
    /// <summary>
    /// Returns a CSS rgb() string for this color.
    /// </summary>
    public string ToCssRgbString() => $"{R} {G} {B}";
}