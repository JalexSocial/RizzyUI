namespace RizzyUI;

/// <summary>
///     Represents a CSS color variable or Oklch color
/// </summary>
public record Color
{
    /// <summary>
    ///     Stores css color value for color (e.g. "fff" or "oklch(0.973 0.071 103.193)")
    /// </summary>
    private readonly string _cssColorValue;

    /// <summary>
    ///     Stores variable string name (if _type is ColorType.Variable)
    /// </summary>
    private readonly string _cssColorName;

    /// <summary>
    ///     Stores a color in Oklch format
    /// </summary>
    /// <param name="color">The Oklch color value.</param>
    /// <param name="colorName">The optional CSS variable name for the color.</param>
    public Color(Oklch color, string colorName = "")
    {
        _cssColorName = colorName;
        _cssColorValue = $"[{ToCssColorString()}]";
    }

    /// <summary>
    ///     Stores a color as a variable
    /// </summary>
    /// <param name="colorValue">The CSS color value (e.g., "var(--my-color)", "oklch(...)").</param>
    /// <param name="colorName">The optional CSS variable name for the color.</param>
    public Color(string colorValue, string colorName = "")
    {
        _cssColorName = colorName;
        _cssColorValue = colorValue;
    }

    /// <summary>
    ///     Initializes a color using another color as a base
    /// </summary>
    /// <param name="other">The other color to copy from.</param>
    /// <param name="alternateColorName">An optional alternate name for the new color.</param>
    public Color(Color other, string alternateColorName = "")
    {
        _cssColorName = string.IsNullOrEmpty(alternateColorName) ? other._cssColorName.ToLowerInvariant() : alternateColorName;
        _cssColorValue = other._cssColorValue;
    }

    /// <summary>
    ///     Outputs the standard CSS function syntax: oklch(L C H / Alpha) or var(--color-rose-500)
    /// </summary>
    /// <returns>The CSS color string.</returns>
    public string ToCssColorString() => _cssColorValue;

    /// <summary>
    ///     Outputs a Tailwind class that can be directly used in a class attribute
    /// </summary>
    /// <param name="utility">bg, text, accent, etc. (as part of bg-rose-500, text-rose-500)</param>
    /// <returns>The Tailwind CSS class string.</returns>
    public virtual string ToCssClassString(string utility)
    {
        return string.IsNullOrEmpty(_cssColorName) ? $"{utility}-[{_cssColorValue}]" : $"{utility}-{_cssColorName}";
    }
}

/// <summary>
///     Represents a color in OKLCH space, plus an alpha (default 1.0).
/// </summary>
/// <param name="L">Lightness component.</param>
/// <param name="C">Chroma component.</param>
/// <param name="H">Hue component.</param>
/// <param name="Alpha">Alpha (transparency) component.</param>
// ReSharper disable once IdentifierTypo
public readonly record struct Oklch(float L, float C, float H, float Alpha = 1.0f)
{
    /// <summary>
    /// Provides a string representation of the color in CSS format.
    /// </summary>
    /// <returns>The CSS color string.</returns>
    public string ToCssColorString()
    {
        return Alpha < 1f
            ? $"oklch({L} {C} {H})"
            : $"oklch({L} {C} {H} / {Alpha})";

    }
}