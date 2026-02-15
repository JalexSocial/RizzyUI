using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents the floating panel for submenu items.
/// </summary>
public partial class MenubarSubContent : RzComponent<MenubarSubContent.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="MenubarSubContent"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "absolute left-full top-0 z-50 min-w-[10rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
    );

    /// <summary>
    /// Gets or sets submenu content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.MenubarSubContent;

    /// <summary>
    /// Defines slots.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot.
        /// </summary>
        [Slot("menubar-sub-content")]
        public string? Base { get; set; }
    }
}
