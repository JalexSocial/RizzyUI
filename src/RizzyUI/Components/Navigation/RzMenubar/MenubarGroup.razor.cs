using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Groups related menubar items.
/// </summary>
public partial class MenubarGroup : RzComponent<MenubarGroup.Slots>
{
    /// <summary>
    /// Default styling for <see cref="MenubarGroup"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(@base: "p-1");

    /// <summary>
    /// Gets or sets child content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.MenubarGroup;

    /// <summary>
    /// Defines slots.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot.
        /// </summary>
        [Slot("menubar-group")]
        public string? Base { get; set; }
    }
}
