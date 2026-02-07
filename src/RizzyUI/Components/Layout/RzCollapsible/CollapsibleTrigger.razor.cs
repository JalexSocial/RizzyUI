
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// An interactive element that toggles the visibility of its associated <see cref="CollapsibleContent"/>.
/// It must be a child of an <see cref="RzCollapsible"/> component.
/// </summary>
public partial class CollapsibleTrigger : RzAsChildComponent<CollapsibleTrigger.Slots>
{
    /// <summary>
    /// Defines the default styling for the CollapsibleTrigger component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new();

    /// <summary>
    /// Gets the parent <see cref="RzCollapsible"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzCollapsible? ParentCollapsible { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered as the trigger. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentCollapsible == null)
        {
            throw new InvalidOperationException($"{nameof(CollapsibleTrigger)} must be used within an {nameof(RzCollapsible)}.");
        }
        Element = "button";
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes?.ToDictionary(kvp => kvp.Key, kvp => (object?)kvp.Value) ?? new Dictionary<string, object?>(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = $"{ParentCollapsible?.Id}-trigger",
            ["class"] = SlotClasses.GetBase(),
            ["x-on:click"] = "toggle",
            ["aria-controls"] = $"{ParentCollapsible?.Id}-content",
            ["x-bind:aria-expanded"] = "isOpen",
            ["x-bind:data-state"] = "state",
            ["data-slot"] = "collapsible-trigger"
        };
        return attributes;
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.CollapsibleTrigger;

    /// <summary>
    /// Defines the slots available for styling in the CollapsibleTrigger component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}