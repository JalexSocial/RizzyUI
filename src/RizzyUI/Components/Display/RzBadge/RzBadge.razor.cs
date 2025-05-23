
using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     A badge component for displaying labels with various styles and colors, determined by the active
///     <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzBadge : RzComponent
{
    /// <summary> The semantic color of the badge. Defaults to SurfaceAlt. </summary>
    [Parameter]
    public SemanticColor Color { get; set; } = SemanticColor.SurfaceAlt;

    /// <summary> When set to true, applies a softer styling to the badge. </summary>
    [Parameter]
    public bool Soft { get; set; }

    /// <summary> Optional icon to display within the badge. </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <summary> Optional text label for the badge. Used if ChildContent is not provided. </summary>
    [Parameter]
    public string Label { get; set; } = string.Empty;

    /// <summary> Child content for the badge, allowing for text and additional elements. Overrides Label if set. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Initializes the component, setting the default element type if not specified.
    /// </summary>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "span"; // Default element for a badge
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        var styles = Theme.RzBadge;
        return TwMerge.Merge(AdditionalAttributes,
            styles.Badge,
            Soft ? styles.GetVariantSoftCss(Color) : styles.GetVariantCss(Color));
    }
}