using Blazicons;
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a command item within menubar content.
/// </summary>
public partial class MenubarItem : RzComponent<MenubarItem.Slots>
{
    /// <summary>
    /// Default styling for <see cref="MenubarItem"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        slots: new()
        {
            [s => s.Icon] = "mr-2 size-4"
        }
    );

    /// <summary>
    /// Gets or sets the content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets optional icon.
    /// </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <summary>
    /// Gets or sets optional shortcut fragment.
    /// </summary>
    [Parameter]
    public RenderFragment? ShortcutContent { get; set; }

    /// <summary>
    /// Gets or sets whether the item is disabled.
    /// </summary>
    [Parameter]
    public bool Disabled { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrWhiteSpace(Element))
            Element = "button";
        if (Element.Equals("button", StringComparison.OrdinalIgnoreCase) && (AdditionalAttributes is null || !AdditionalAttributes.ContainsKey("type")))
        {
            AdditionalAttributes ??= new Dictionary<string, object>();
            AdditionalAttributes["type"] = "button";
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.MenubarItem;

    /// <summary>
    /// Defines slots.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot.
        /// </summary>
        [Slot("menubar-item")]
        public string? Base { get; set; }

        /// <summary>
        /// Icon slot.
        /// </summary>
        [Slot("icon")]
        public string? Icon { get; set; }
    }
}
