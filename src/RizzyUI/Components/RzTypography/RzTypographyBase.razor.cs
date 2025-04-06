using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions; // Required for TwMerge if used directly (though RootClass does it)
using RizzyUI.Styling;

namespace RizzyUI;

/// <xmldoc>
/// Base class for typography components like <see cref="RzHeading"/> and <see cref="RzParagraph"/>.
/// Provides common parameters for text styling (color, weight, size, etc.) and access to the theme's typography styles.
/// </xmldoc>
public abstract partial class RzTypographyBase : RzComponent
{
    /// <summary> Get the currently active theme via Cascading Parameter. </summary>
    [CascadingParameter] protected RzTheme? CascadedTheme { get; set; }
    /// <summary> Injected configuration to get the default theme as fallback. </summary>
    [Inject] private IOptions<RizzyUIConfig>? Config { get; set; }
    /// <summary> The effective theme being used (Cascaded or Default). </summary>
    protected RzTheme Theme { get; set; } = default!;

    /// <summary> Gets or sets the text color. If null, defaults are often applied by inheriting components. </summary>
	[Parameter] public SemanticColor? TextColor { get; set; }
	/// <summary> Gets or sets the font weight. </summary>
	[Parameter] public TextWeight? Weight { get; set; }
	/// <summary> Gets or sets the text size. </summary>
	[Parameter] public TextSize? Size { get; set; }
	/// <summary> Gets or sets the line height (leading). </summary>
	[Parameter] public Leading? LineHeight { get; set; }
	/// <summary> Gets or sets the text decoration (underline, etc.). </summary>
	[Parameter] public TextDecoration? Decoration { get; set; }
	/// <summary> Gets or sets the text transformation (uppercase, etc.). </summary>
	[Parameter] public TextTransform? Transform { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Theme = CascadedTheme ?? Config?.Value.DefaultTheme ?? RzTheme.Default;
        if (Theme == null)
            throw new InvalidOperationException($"{GetType()} requires a cascading RzTheme or a default theme configured.");
    }

    /// <summary> Builds a string of combined typography CSS classes based on the component's parameters and the active theme. </summary>
    /// <returns>A string containing Tailwind CSS classes for typography styling.</returns>
    protected virtual string GetTypographyBaseCss()
    {
        return Theme.RzTypography.GetBaseCss(TextColor, Weight, Size, LineHeight, Decoration, Transform);
    }
}

