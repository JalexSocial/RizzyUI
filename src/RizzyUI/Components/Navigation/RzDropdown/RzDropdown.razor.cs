
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents a dropdown component with a customizable trigger and content area.
///     It manages its open/close state and keyboard navigation via Alpine.js.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzDropdown : RzComponent
{
    /// <summary> Gets or sets the render fragment that defines the dropdown trigger. Required. </summary>
    [Parameter]
    [EditorRequired]
    public RenderFragment? Trigger { get; set; }

    /// <summary> Gets or sets the render fragment that defines the dropdown content. Required. </summary>
    [Parameter]
    [EditorRequired]
    public RenderFragment? Content { get; set; }

    /// <summary> Gets or sets the point on the trigger where the dropdown menu attaches. Defaults to BottomCenter. </summary>
    [Parameter]
    public AnchorPoint Anchor { get; set; } = AnchorPoint.Bottom;

    /// <summary>
    /// Offset in pixels from the anchor point where the dropdown menu appears.
    /// </summary>
    [Parameter]
    public int Offset { get; set; } = 6;

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzDropdown.Container);
        // Apply base style from theme
    }
}