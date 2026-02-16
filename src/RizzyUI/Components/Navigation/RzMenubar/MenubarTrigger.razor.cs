using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents the trigger element for a top-level menubar menu.
/// </summary>
public partial class MenubarTrigger : RzAsChildComponent<MenubarTrigger.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="MenubarTrigger"/>.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
    );

    /// <summary>
    /// Gets or sets trigger content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets the parent menu.
    /// </summary>
    [CascadingParameter]
    protected MenubarMenu? ParentMenu { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentMenu is null)
            throw new InvalidOperationException($"{nameof(MenubarTrigger)} must be used within {nameof(MenubarMenu)}.");

        Element = "button";
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes?.ToDictionary(kvp => kvp.Key, kvp => (object?)kvp.Value) ?? new(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["type"] = "button",
            ["class"] = SlotClasses.GetBase(),
            ["role"] = "menuitem",
            ["tabindex"] = "0",
            ["aria-haspopup"] = "menu",
            ["aria-expanded"] = "false",
            ["data-menu-value"] = ParentMenu?.Value,
            ["x-on:pointerdown"] = "handleTriggerPointerDown",
            ["x-on:pointerenter"] = "handleTriggerPointerEnter",
            ["x-on:keydown"] = "handleTriggerKeydown",
            ["data-slot"] = "menubar-trigger"
        };
        return attributes;
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.MenubarTrigger;

    /// <summary>
    /// Defines slots for <see cref="MenubarTrigger"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot.
        /// </summary>
        [Slot("menubar-trigger")]
        public string? Base { get; set; }
    }
}
