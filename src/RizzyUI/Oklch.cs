using System;
using System.Collections.Generic;
using System.Drawing;
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
    public string ToCssString()
    {
        if (Colors.ColorMap.TryGetValue(this, out var varName))
        {
            return $"var({varName})";
        }

        return Alpha < 1f ? $"oklch({L} {C} {H})" : $"oklch({L} {C} {H} / {Alpha})";
    } 
}