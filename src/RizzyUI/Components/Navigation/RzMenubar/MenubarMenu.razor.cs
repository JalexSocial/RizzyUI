using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents an individual top-level menu within a <see cref="RzMenubar"/>.
/// </summary>
public partial class MenubarMenu : RzComponent<MenubarMenu.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="MenubarMenu"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(@base: "relative");

    /// <summary>
    /// Gets or sets the child content containing trigger and content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the unique menu value.
    /// </summary>
    [Parameter]
    public string Value { get; set; } = Guid.NewGuid().ToString("N");

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.MenubarMenu;

    /// <summary>
    /// Defines slots for <see cref="MenubarMenu"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot.
        /// </summary>
        [Slot("menubar-menu")]
        public string? Base { get; set; }
    }
}
