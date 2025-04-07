using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Renders a paragraph (<c>p</c>) element with standard typography styling.
///     Inherits text styling options from <see cref="RzTypographyBase" />.
///     Styling, including prose width, is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public class RzParagraph : RzTypographyBase // Inherits RzTypographyBase for common text props
{
    // Theme is inherited from RzTypographyBase

    /// <summary> The content to be rendered inside the paragraph. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary> Gets or sets the maximum character width of the paragraph. Defaults to Full. </summary>
    [Parameter]
    public ProseWidth ProseWidth { get; set; } = ProseWidth.Full;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        // Initialize inherited properties first
        base.OnInitialized();

        Element = "p"; // Set the specific element tag
        TextColor ??= SemanticColor.OnSurface; // Default paragraph text color if not set by base or parameter
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        var styles = Theme.RzParagraph;
        return TwMerge.Merge(AdditionalAttributes,
            styles.Paragraph, // Base paragraph styles (margin, leading)
            GetTypographyBaseCss(), // Common typography styles (color, weight, size etc. from base)
            styles.GetProseWidthCss(ProseWidth) // Prose width class
        );
    }
}