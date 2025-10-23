
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// The interactive element that triggers the opening of a <see cref="RzPopover"/>.
/// It can be rendered as a button or merge its behavior into a child element using the AsChild pattern.
/// </summary>
public partial class PopoverTrigger : RzAsChildComponent<PopoverTrigger.Slots>
{
    /// <summary>
    /// Defines the default styling for the PopoverTrigger component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex"
    );

    /// <summary>
    /// Gets the parent <see cref="RzPopover"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzPopover? ParentPopover { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered as the trigger. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets the ID for the trigger element.
    /// </summary>
    protected string TriggerId => $"{ParentPopover?.Id}-trigger";

    /// <summary>
    /// Gets the ID of the content element this trigger controls.
    /// </summary>
    protected string ContentId => $"{ParentPopover?.Id}-content";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentPopover == null)
        {
            throw new InvalidOperationException($"{nameof(PopoverTrigger)} must be used within an {nameof(RzPopover)}.");
        }
        Element = "button";
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes ?? new(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = TriggerId,
            ["class"] = SlotClasses.GetBase(),
            ["x-ref"] = "trigger",
            ["x-on:click"] = "toggle",
            ["aria-haspopup"] = "dialog",
            ["aria-controls"] = ContentId,
            ["x-bind:aria-expanded"] = "ariaExpanded",
            ["data-slot"] = "popover-trigger"
        };
        return attributes;
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.PopoverTrigger;

    /// <summary>
    /// Defines the slots available for styling in the PopoverTrigger component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}