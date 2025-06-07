
// src/RizzyUI/Components/Feedback/RzPopover/RzPopover.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A component that displays a pop-up box of content when a trigger element is activated.
/// Positioning is handled by floating-ui and interactivity by Alpine.js.
/// </summary>
public partial class RzPopover : RzComponent
{
    /// <summary>
    /// Gets or sets the content that users will interact with to open the popover. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment PopoverTrigger { get; set; } = default!;

    /// <summary>
    /// Gets or sets the content to be displayed inside the popover panel. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment PopoverContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the preferred position of the popover relative to the trigger.
    /// Defaults to <see cref="AnchorPoint.BottomStart"/>.
    /// </summary>
    [Parameter]
    public AnchorPoint Anchor { get; set; } = AnchorPoint.BottomStart;

    /// <summary>
    /// Gets or sets the main axis offset in pixels from the anchor point.
    /// Defaults to 4.
    /// </summary>
    [Parameter]
    public int Offset { get; set; } = 4;

    /// <summary>
    /// Gets or sets the cross-axis offset in pixels from the anchor point.
    /// Defaults to 0.
    /// </summary>
    [Parameter]
    public int CrossAxisOffset { get; set; } = 0;

    /// <summary>
    /// Gets or sets the alignment axis offset in pixels from the anchor point.
    /// Defaults to 0.
    /// </summary>
    [Parameter]
    public int AlignmentAxisOffset { get; set; } = 0;

    /// <summary>
    /// Gets or sets the positioning strategy for the popover ('absolute' or 'fixed').
    /// Defaults to <see cref="AnchorStrategy.Absolute"/>.
    /// </summary>
    [Parameter]
    public AnchorStrategy Strategy { get; set; } = AnchorStrategy.Absolute;

    /// <summary>
    /// Gets or sets whether to enable the 'flip' middleware, which flips the popover to the opposite side to keep it in view.
    /// Defaults to true.
    /// </summary>
    [Parameter]
    public bool EnableFlip { get; set; } = true;

    /// <summary>
    /// Gets or sets whether to enable the 'shift' middleware, which shifts the popover along the axes to keep it in view.
    /// Defaults to true.
    /// </summary>
    [Parameter]
    public bool EnableShift { get; set; } = true;

    /// <summary>
    /// Gets or sets the padding (in pixels) between the popover and the edge of the viewport when shifting.
    /// Defaults to 8.
    /// </summary>
    [Parameter]
    public int ShiftPadding { get; set; } = 8;
    
    /// <summary>
    /// Gets or sets the ARIA label for the popover container, providing an accessible name.
    /// If not set, a default localized label will be applied.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets the unique ID for the trigger element.
    /// </summary>
    protected string TriggerId => $"{Id}-trigger";

    /// <summary>
    /// Gets the unique ID for the content element.
    /// </summary>
    protected string ContentId => $"{Id}-content";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzPopover.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzPopover.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes);
    }
}