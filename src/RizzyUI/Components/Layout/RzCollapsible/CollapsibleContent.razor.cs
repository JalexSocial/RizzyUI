
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// The container for content that can be shown or hidden by a <see cref="CollapsibleTrigger"/>.
/// It must be a child of an <see cref="RzCollapsible"/> component.
/// </summary>
public partial class CollapsibleContent : RzComponent
{
    /// <summary>
    /// Gets the parent <see cref="RzCollapsible"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzCollapsible? ParentCollapsible { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the collapsible panel.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentCollapsible == null)
        {
            throw new InvalidOperationException($"{nameof(CollapsibleContent)} must be used within an {nameof(RzCollapsible)}.");
        }
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzCollapsible.Content);
    }
}