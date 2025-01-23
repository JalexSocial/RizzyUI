using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RizzyUI;

/// <summary>
/// Represents a color in OKLCH space, plus an alpha (default 1.0).
/// </summary>
public readonly record struct Oklch(float L, float C, float H, float Alpha = 1.0f)
{
    /// <summary>
    /// Outputs the standard CSS function syntax: oklch(L C H / Alpha).
    /// </summary>
    public string ToCssString() => $"oklch({L} {C} {H})";
}