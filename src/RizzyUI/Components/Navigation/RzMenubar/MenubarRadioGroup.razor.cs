using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a radio group within a menubar menu.
/// </summary>
public partial class MenubarRadioGroup : RzComponent<MenubarRadioGroup.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="MenubarRadioGroup"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(@base: "p-1");

    /// <summary>
    /// Gets or sets radio item content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the logical group name.
    /// </summary>
    [Parameter]
    public string Name { get; set; } = Guid.NewGuid().ToString("N");

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.MenubarRadioGroup;

    /// <summary>
    /// Defines slots for <see cref="MenubarRadioGroup"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot.
        /// </summary>
        [Slot("menubar-radio-group")]
        public string? Base { get; set; }
    }
}
