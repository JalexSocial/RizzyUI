using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;

// Required for TwMerge if used directly (though RootClass does it)

namespace RizzyUI;

/// <xmldoc>
///     Base class for typography components like <see cref="RzHeading" /> and <see cref="RzParagraph" />.
///     Provides common parameters for text styling (color, weight, size, etc.) and access to the theme's typography
///     styles.
/// </xmldoc>
public abstract class RzTypographyBase : RzComponent
{
    /// <summary> Gets or sets the text color. If null, defaults are often applied by inheriting components. </summary>
    [Parameter]
    public SemanticColor? TextColor { get; set; }

    /// <summary> Gets or sets the font weight. </summary>
    [Parameter]
    public TextWeight? Weight { get; set; }

    /// <summary> Gets or sets the text size. </summary>
    [Parameter]
    public TextSize? Size { get; set; }

    /// <summary> Gets or sets the line height (leading). </summary>
    [Parameter]
    public Leading? LineHeight { get; set; }

    /// <summary> Gets or sets the text decoration (underline, etc.). </summary>
    [Parameter]
    public TextDecoration? Decoration { get; set; }

    /// <summary> Gets or sets the text transformation (uppercase, etc.). </summary>
    [Parameter]
    public TextTransform? Transform { get; set; }

    /// <summary> Builds a string of combined typography CSS classes based on the component's parameters and the active theme. </summary>
    /// <returns>A string containing Tailwind CSS classes for typography styling.</returns>
    protected virtual string GetTypographyBaseCss()
    {
        return Theme.RzTypography.GetBaseCss(TextColor, Weight, Size, LineHeight, Decoration, Transform);
    }
}