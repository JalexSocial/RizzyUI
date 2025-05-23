
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Renders an HTML heading element (h1-h4) with appropriate typography styling based on the level and active
///     <see cref="RzTheme" />.
///     Inherits common text styling options from <see cref="RzTypographyBase" />. Can register itself with an
///     <see cref="RzQuickReferenceContainer" />.
/// </xmldoc>
public partial class RzHeading : RzTypographyBase
{
    private bool _registered;

    /// <summary> Represents the heading level (H1-H4), determining the HTML tag and base styles. Required. </summary>
    [Parameter]
    [EditorRequired]
    public required HeadingLevel Level { get; set; }

    /// <summary> The content to be rendered inside the heading tag. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    ///     The title text to use when registering this heading with an <see cref="RzQuickReferenceContainer" />. If null
    ///     or empty, the heading will not be registered.
    /// </summary>
    [Parameter]
    public string? QuickReferenceTitle { get; set; }

    /// <summary> Gets the parent <see cref="RzQuickReferenceContainer" /> if this heading is nested within one. </summary>
    [CascadingParameter]
    private RzQuickReferenceContainer? QuickReferenceContainer { get; set; }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        // Initialize base (gets theme) before using it
        base.OnParametersSet();

        Element = Level switch // Set the HTML tag based on Level
        {
            HeadingLevel.H1 => "h1",
            HeadingLevel.H2 => "h2",
            HeadingLevel.H3 => "h3",
            HeadingLevel.H4 => "h4",
            _ => "h1" // Default to h1
        };

        // Apply default text colors based on level if not explicitly set
        if (TextColor is null)
            TextColor = Level is HeadingLevel.H1 or HeadingLevel.H2
                ? SemanticColor.OnSurfaceStrong
                : SemanticColor.OnSurface;

        // Register with Quick Reference if applicable
        if (!_registered && QuickReferenceContainer != null)
        {
            if (string.IsNullOrEmpty(QuickReferenceTitle))
                QuickReferenceTitle = ChildContent?.AsMarkupString() ?? "[Missing QuickReferenceTitle]";

            QuickReferenceContainer.RegisterHeading(Level, QuickReferenceTitle, Id);

            _registered = true;
        }
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        var headingStyles = Theme.RzHeading;
        // Merge base typography styles with level-specific styles
        return TwMerge.Merge(AdditionalAttributes,
            GetTypographyBaseCss(), // From RzTypographyBase
            headingStyles.GetLevelCss(Level) // From RzHeadingStyles
        );
    }
}