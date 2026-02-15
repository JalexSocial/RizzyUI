using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a selectable radio item within <see cref="MenubarRadioGroup"/>.
/// </summary>
public partial class MenubarRadioItem : RzComponent<MenubarRadioItem.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="MenubarRadioItem"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        slots: new() { [s => s.Indicator] = "absolute left-2 flex size-3.5 items-center justify-center" }
    );

    /// <summary>
    /// Gets the parent radio group.
    /// </summary>
    [CascadingParameter]
    protected MenubarRadioGroup? ParentRadioGroup { get; set; }

    /// <summary>
    /// Gets or sets the item content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the item value.
    /// </summary>
    [Parameter, EditorRequired]
    public string Value { get; set; } = default!;

    /// <summary>
    /// Gets or sets whether this item is checked by default.
    /// </summary>
    [Parameter]
    public bool Checked { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentRadioGroup is null)
            throw new InvalidOperationException($"{nameof(MenubarRadioItem)} must be used within {nameof(MenubarRadioGroup)}.");
        if (string.IsNullOrWhiteSpace(Element)) Element = "button";
        if (Element.Equals("button", StringComparison.OrdinalIgnoreCase) && (AdditionalAttributes is null || !AdditionalAttributes.ContainsKey("type")))
        {
            AdditionalAttributes ??= new Dictionary<string, object>();
            AdditionalAttributes["type"] = "button";
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.MenubarRadioItem;

    /// <summary>
    /// Defines slots for <see cref="MenubarRadioItem"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot.
        /// </summary>
        [Slot("menubar-radio-item")]
        public string? Base { get; set; }

        /// <summary>
        /// Indicator slot.
        /// </summary>
        [Slot("item-indicator")]
        public string? Indicator { get; set; }
    }
}
