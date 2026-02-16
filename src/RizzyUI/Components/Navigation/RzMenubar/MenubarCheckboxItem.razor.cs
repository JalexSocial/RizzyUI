using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a checkable command item inside menubar content.
/// </summary>
public partial class MenubarCheckboxItem : RzComponent<MenubarCheckboxItem.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="MenubarCheckboxItem"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        slots: new()
        {
            [s => s.Indicator] = "absolute left-2 flex size-3.5 items-center justify-center opacity-0 data-[state=checked]:opacity-100"
        }
    );

    /// <summary>
    /// Gets or sets the visible item content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets optional shortcut content.
    /// </summary>
    [Parameter]
    public RenderFragment? ShortcutContent { get; set; }

    /// <summary>
    /// Gets or sets whether the item is checked by default.
    /// </summary>
    [Parameter]
    public bool Checked { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrWhiteSpace(Element)) Element = "button";
        if (Element.Equals("button", StringComparison.OrdinalIgnoreCase) && (AdditionalAttributes is null || !AdditionalAttributes.ContainsKey("type")))
        {
            AdditionalAttributes ??= new Dictionary<string, object>();
            AdditionalAttributes["type"] = "button";
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.MenubarCheckboxItem;

    /// <summary>
    /// Defines slots for <see cref="MenubarCheckboxItem"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot.
        /// </summary>
        [Slot("menubar-checkbox-item")]
        public string? Base { get; set; }

        /// <summary>
        /// Slot for the check indicator.
        /// </summary>
        [Slot("item-indicator")]
        public string? Indicator { get; set; }
    }
}
