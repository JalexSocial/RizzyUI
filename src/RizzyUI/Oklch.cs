﻿using System.Text.RegularExpressions;

namespace RizzyUI;

/*
/// <summary>
/// Represents a defined Semantic theme color
/// </summary>
public record SemanticColor : Color
{
    private Color? _dark;

    private SemanticColor(Color color) : base(color)
    {
    }

    private SemanticColor(Color light, Color dark) : base(light)
    {
        _dark = dark;
    }

    /// <summary>No color specified.</summary>
    public static SemanticColor None => new SemanticColor(Colors.Transparent);

    /// <summary>Surface color, typically for backgrounds.</summary>
    public static SemanticColor Surface => new SemanticColor(new ("--color-surface", "surface"),
        new ("--color-surface-dark", "surface-dark"));

    /// <summary>Foreground color on surface.</summary>
    public static SemanticColor OnSurface => new SemanticColor(new ("--color-on-surface", "on-surface"),
        new ("--color-on-surface-dark", "on-surface-dark"));

    /// <summary>Strong foreground color on surface.</summary>
    public static SemanticColor OnSurfaceStrong => new SemanticColor(new ("--color-on-surface-strong", "on-surface-strong"),
        new ("--color-on-surface-dark-strong", "on-surface-dark-strong"));

    /// <summary>Muted foreground color on surface.</summary>
    public static SemanticColor OnSurfaceMuted => new SemanticColor(new("--color-on-surface-muted", "on-surface-muted"),
        new("--color-on-surface-dark-muted", "on-surface-dark-muted"));

    /// <summary>Alternate surface color for secondary areas.</summary>
    public static SemanticColor SurfaceAlt => new SemanticColor(new ("--color-surface-alt", "surface-alt"),
        new ("--color-surface-dark-alt", "surface-dark-alt"));

    /// <summary>Primary color for highlights or accents.</summary>
    public static SemanticColor Primary => new SemanticColor(new Color("--color-primary", "primary"));

    /// <summary>Foreground color on primary background.</summary>
    public static SemanticColor OnPrimary => new SemanticColor(new ("--color-on-primary", "on-primary"),
        new ("--color-on-primary-dark", "on-primary-dark"));

    /// <summary>Secondary color for less emphasized elements.</summary>
    public static SemanticColor Secondary => new SemanticColor(new Color("--color-secondary", "secondary"),
        new Color("--color-secondary-dark", "secondary-dark"));

    /// <summary>Foreground color on secondary background.</summary>
    public static SemanticColor OnSecondary => new SemanticColor(new Color("--color-on-secondary", "on-secondary"),
        new Color("--color-on-secondary-dark", "on-secondary-dark"));

    /// <summary>Outline color for borders or separators.</summary>
    public static SemanticColor Outline => new SemanticColor(new Color("--color-outline", "outline"),
        new Color("--color-outline-dark", "outline-dark"));

    /// <summary>Strong outline color for emphasis.</summary>
    public static SemanticColor OutlineStrong => new SemanticColor(new Color("--color-outline-strong", "outline-strong"),
        new Color("--color-outline-dark-strong", "outline-dark-strong"));

    /// <summary>Danger color, often red for errors.</summary>
    public static SemanticColor Danger => new SemanticColor(new Color("--color-danger", "danger"));

    /// <summary>Foreground color on danger background.</summary>
    public static SemanticColor OnDanger => new SemanticColor(new Color("--color-on-danger", "on-danger"));

    /// <summary>Informational color, often blue or neutral.</summary>
    public static SemanticColor Info => new SemanticColor(new Color("--color-info", "info"));

    /// <summary>Foreground color on info background.</summary>
    public static SemanticColor OnInfo => new SemanticColor(new Color("--color-on-info", "on-info"));

    /// <summary>Warning color, often yellow for caution.</summary>
    public static SemanticColor Warning => new SemanticColor(new Color("--color-warning", "warning"));

    /// <summary>Foreground color on warning background.</summary>
    public static SemanticColor OnWarning => new SemanticColor(new Color("--color-on-warning", "on-warning"));

    /// <summary>Success color, often green for positive feedback.</summary>
    public static SemanticColor Success => new SemanticColor(new Color("--color-success", "success"));

    /// <summary>Foreground color on success background.</summary>
    public static SemanticColor OnSuccess => new SemanticColor(new Color("--color-on-success", "on-success"));

    /// <summary>
    /// Creates a Tailwind class string that optionally includes a dark mode class
    /// </summary>
    /// <param name="utility"></param>
    /// <returns></returns>
    public override string ToCssClassString(string utility)
    {
        if (_dark == null)
            return base.ToCssClassString(utility);

        return $"{utility}-{_tailwindClass} dark:{_dark.ToCssClassString(utility)}";
    }
}
*/

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