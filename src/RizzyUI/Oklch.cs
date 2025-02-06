using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RizzyUI;

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
	private static SemanticColor None => new SemanticColor(Colors.Transparent);

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
    private static SemanticColor OnInfo => new SemanticColor(new Color("--color-on-info", "on-info"));

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

        return $"{utility}-{_tailwindClass} dark:{utility}-{_tailwindClass}";
    }
}


/// <summary>
/// Represents a CSS color variable or Oklch color
/// </summary>
public record Color
{
	protected enum ColorType
	{
		Variable,
		Oklch,
		Rgb // Unsupported for now
	};

	protected readonly ColorType _type;
	protected readonly Oklch _oklchColor;
	protected readonly string _variable;
	protected readonly string _tailwindClass;

    /// <summary>
    /// Stores a color in Oklch format
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
    /// Stores a color as a variable
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
    /// Initializes a color using another color as a base
    /// </summary>
    /// <param name="other"></param>
    public Color(Color other)
    {
	    _type = other._type;
	    _oklchColor = other._oklchColor;
	    _variable = other._variable;
	    _tailwindClass = other._tailwindClass;
    }

	/// <summary>
	/// Outputs the standard CSS function syntax: oklch(L C H / Alpha) or var(--color-rose-500)
	/// </summary>
	public string ToCssColorString()
	{
		return _type switch
        {
            ColorType.Oklch => _oklchColor.Alpha < 1f
                ? $"oklch({_oklchColor.L} {_oklchColor.C} {_oklchColor.H})"
                : $"oklch({_oklchColor.L} {_oklchColor.C} {_oklchColor.H} / {_oklchColor.Alpha})",

            ColorType.Rgb => string.Empty,

            ColorType.Variable => $"var({_variable})",
            _ => throw new NotImplementedException()
        };
    }

	/// <summary>
	/// Outputs a Tailwind class that can be directly used in a class attribute
	/// </summary>
	/// <param name="utility">bg, text, accent, etc. (as part of bg-rose-500, text-rose-500)</param>
	/// <returns></returns>
	public virtual string ToCssClassString(string utility)
	{
		return $"{utility}-{_tailwindClass}";
	}
}

/// <summary>
/// Represents a color in OKLCH space, plus an alpha (default 1.0).
/// </summary>
public readonly record struct Oklch(float L, float C, float H, float Alpha = 1.0f)
{
}