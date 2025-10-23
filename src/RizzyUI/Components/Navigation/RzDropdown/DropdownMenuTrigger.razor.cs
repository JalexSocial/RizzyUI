
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents the trigger element for an <see cref="RzDropdownMenu"/>.
/// This component wraps the content that users will click or interact with to open the dropdown.
/// </summary>
public partial class DropdownMenuTrigger : RzAsChildComponent<DropdownMenuTrigger.Slots>
{
    /// <summary>
    /// Defines the default styling for the DropdownMenuTrigger component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex"
    );

    /// <summary>
    /// Gets the parent <see cref="RzDropdownMenu"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzDropdownMenu? ParentDropdownMenu { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered as the trigger. Required.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets the ID for the trigger element.
    /// </summary>
    protected string TriggerId => $"{ParentDropdownMenu?.Id}-trigger";

    /// <summary>
    /// Gets the ID of the content element this trigger controls.
    /// </summary>
    protected string ContentId => $"{ParentDropdownMenu?.Id}-content";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentDropdownMenu == null)
        {
            throw new InvalidOperationException($"{nameof(DropdownMenuTrigger)} must be used within an {nameof(RzDropdownMenu)}.");
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
            ["aria-haspopup"] = "menu",
            ["aria-controls"] = ContentId,
            ["x-bind:aria-expanded"] = "ariaExpanded",
            ["x-on:click"] = "toggle",
            ["x-on:mouseover"] = "handleTriggerMouseover",
            ["x-on:keydown.enter.prevent"] = "handleTriggerKeydown",
            ["x-on:keydown.space.prevent"] = "handleTriggerKeydown",
            ["x-on:keydown.down.prevent"] = "handleTriggerKeydown",
            ["x-on:keydown.up.prevent"] = "handleTriggerKeydown",
            ["data-slot"] = "dropdown-menu-trigger"
        };
        return attributes;
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.DropdownMenuTrigger;

    /// <summary>
    /// Defines the slots available for styling in the DropdownMenuTrigger component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}