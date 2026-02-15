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
        @base: "absolute z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
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
