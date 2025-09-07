using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// The content panel of a <see cref="RzPopover"/> that appears when the trigger is activated.
/// </summary>
public partial class PopoverContent : RzComponent
{
    /// <summary>
    /// Gets the parent <see cref="RzPopover"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzPopover? ParentPopover { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the popover panel. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets the ID for the content element.
    /// </summary>
    protected string ContentId => $"{ParentPopover?.Id}-content";

    /// <summary>
    /// Gets the ID of the trigger element that controls this content.
    /// </summary>
    protected string TriggerId => $"{ParentPopover?.Id}-trigger";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentPopover == null)
        {
            throw new InvalidOperationException($"{nameof(PopoverContent)} must be used within an {nameof(RzPopover)}.");
        }
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.PopoverContent.ContentContainer);
    }
}