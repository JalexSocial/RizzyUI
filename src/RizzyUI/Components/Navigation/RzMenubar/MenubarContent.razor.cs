using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents the floating content panel for a <see cref="MenubarMenu"/>.
/// </summary>
public partial class MenubarContent : RzComponent<MenubarContent.Slots>
{
    /// <summary>
    /// Defines default styling for <see cref="MenubarContent"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "absolute z-50 min-w-[12rem] origin-[--radix-menubar-content-transform-origin] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        slots: new()
        {
            [s => s.InnerContainer] = ""
        }
    );

    /// <summary>
    /// Gets or sets content.
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
            throw new InvalidOperationException($"{nameof(MenubarContent)} must be used within {nameof(MenubarMenu)}.");
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.MenubarContent;

    /// <summary>
    /// Defines slots for <see cref="MenubarContent"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot.
        /// </summary>
        [Slot("menubar-content")]
        public string? Base { get; set; }

        /// <summary>
        /// Inner container slot.
        /// </summary>
        [Slot("inner-container")]
        public string? InnerContainer { get; set; }
    }
}
