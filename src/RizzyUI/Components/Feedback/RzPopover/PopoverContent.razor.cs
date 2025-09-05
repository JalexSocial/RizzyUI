
// src/RizzyUI/Components/Feedback/RzPopover/PopoverContent.razor.cs
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// The container for content that appears when a <see cref="PopoverTrigger"/> is activated.
/// It must be a child of an <see cref="RzPopover"/> component.
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
        return TwMerge.Merge(AdditionalAttributes, Theme.RzPopover.ContentContainer);
    }
}