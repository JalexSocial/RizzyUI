
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The container for content that can be shown or hidden by a <see cref="CollapsibleTrigger"/>.
/// It must be a child of an <see cref="RzCollapsible"/> component.
/// </summary>
public partial class CollapsibleContent : RzComponent<CollapsibleContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the CollapsibleContent component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
    );

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
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CollapsibleContent;

    /// <summary>
    /// Defines the slots available for styling in the CollapsibleContent component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}