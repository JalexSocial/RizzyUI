using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a label inside menubar content.
/// </summary>
public partial class MenubarLabel : RzComponent<MenubarLabel.Slots>
{
    /// <summary>
    /// Default styling for <see cref="MenubarLabel"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(@base: "px-2 py-1.5 text-sm font-semibold");

    /// <summary>
    /// Gets or sets label content.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.MenubarLabel;

    /// <summary>
    /// Defines slots.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Base slot.
        /// </summary>
        [Slot("menubar-label")]
        public string? Base { get; set; }
    }
}
