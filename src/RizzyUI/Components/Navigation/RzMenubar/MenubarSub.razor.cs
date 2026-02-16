using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a submenu container in menubar content.
/// </summary>
public partial class MenubarSub : RzComponent<MenubarSub.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="MenubarSub"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(@base: "relative");

    /// <summary>
    /// Gets or sets submenu content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.MenubarSub;

    /// <summary>
    /// Defines slots.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot.
        /// </summary>
        [Slot("menubar-sub")]
        public string? Base { get; set; }
    }
}
