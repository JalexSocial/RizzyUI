using System.Text.RegularExpressions;

namespace RizzyUI;

/// <summary>
///     Represents a CSS color variable or Oklch color
/// </summary>
public record Color
{
    /// <summary>
    ///     Stores oklch color (if _type is ColorType.Oklch)
    /// </summary>
    private readonly Oklch _oklchColor;

    /// <summary>
    ///     Stores tailwind classname for color (e.g. rose-500)
    /// </summary>
    private readonly string _tailwindClass;

    /// <summary>
    ///     Type of color
    /// </summary>
    protected readonly ColorType _type;

    /// <summary>
    ///     Stores variable string name (if _type is ColorType.Variable)
    /// </summary>
    private readonly string _variable;

    /// <summary>
    ///     Stores a color in Oklch format
    /// </summary>
    /// <param name="color"></param>
    public Color(Oklch color)
    {
        _type = ColorType.Oklch;
        _oklchColor = color;
        _variable = string.Empty;
        _tailwindClass = $"[{ToCssColorString()}]";
    }

    /// <summary>
    ///     Stores a color as a variable
    /// </summary>
    /// <param name="colorVariable"></param>
    /// <param name="colorName"></param>
    public Color(string colorVariable, string colorName)
    {
        _type = ColorType.Variable;
        _variable = colorVariable;
        _tailwindClass = colorName;
    }

    /// <summary>
    ///     Stores a color as RGB
    /// </summary>
    /// <param name="rgbHexColor">Hex color starting with a pound sign</param>
    public Color(string rgbHexColor)
    {
        if (!IsValidHexColor(rgbHexColor))
            throw new ArgumentException($"{nameof(rgbHexColor)} must be a valid CSS rgb hex color starting with a #");

        _type = ColorType.Rgb;
        _variable = rgbHexColor;
        _tailwindClass = string.Empty;
    }

    /// <summary>
    ///     Initializes a color using another color as a base
    /// </summary>
    /// <param name="other"></param>
    public Color(Color other)
    {
        _type = other._type;
        _oklchColor = other._oklchColor;
        _variable = other._variable.ToLowerInvariant();
        _tailwindClass = other._tailwindClass;
    }

    /// <summary>
    ///     Returns a Tailwind CSS utility class fragment corresponding to this color.
    ///     - For Variable: The provided tailwind class name (e.g., "primary", "red-500").
    ///     - For OKLCH/RgbHex: An arbitrary value class (e.g., "[oklch(0.5_0.1_20)]", "[#ff0000]").
    /// </summary>
    public string TailwindClassName => _tailwindClass;

    private static bool IsValidHexColor(string color)
    {
        return Regex.IsMatch(color, @"^#(?:[0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6,8})$");
    }

    /// <summary>
    ///     Outputs the standard CSS function syntax: oklch(L C H / Alpha) or var(--color-rose-500)
    /// </summary>
    public string ToCssColorString()
    {
        return _type switch
        {
            ColorType.Oklch => _oklchColor.Alpha < 1f
                ? $"oklch({_oklchColor.L} {_oklchColor.C} {_oklchColor.H})"
                : $"oklch({_oklchColor.L} {_oklchColor.C} {_oklchColor.H} / {_oklchColor.Alpha})",

            ColorType.Rgb => _variable,

            ColorType.Variable => $"var({_variable})",
            _ => throw new NotImplementedException()
        };
    }

    /// <summary>
    ///     Outputs a Tailwind class that can be directly used in a class attribute
    /// </summary>
    /// <param name="utility">bg, text, accent, etc. (as part of bg-rose-500, text-rose-500)</param>
    /// <returns></returns>
    public virtual string ToCssClassString(string utility)
    {
        return $"{utility}-{_tailwindClass}";
    }

    /// <summary>
    ///     Identifies color type internally
    /// </summary>
    protected enum ColorType
    {
        /// <summary>
        ///     Color is a CSS variable
        /// </summary>
        Variable,

        /// <summary>
        ///     Color is in Oklch format
        /// </summary>
        Oklch,

        /// <summary>
        ///     Color is in Rgb format (unsupported for now)
        /// </summary>
        Rgb
    }
}

/// <summary>
///     Represents a color in OKLCH space, plus an alpha (default 1.0).
/// </summary>
// ReSharper disable once IdentifierTypo
public readonly record struct Oklch(float L, float C, float H, float Alpha = 1.0f)
{
}