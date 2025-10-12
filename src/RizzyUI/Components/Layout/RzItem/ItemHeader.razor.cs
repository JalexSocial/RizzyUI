
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <summary>
/// A container for header content within an <see cref="RzItem"/>, spanning the full width.
/// </summary>
public partial class ItemHeader : RzComponent<ItemHeader.Slots>
{
    /// <summary>
    /// Defines the default styling for the ItemHeader component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex basis-full items-center justify-between gap-2"
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the header.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.ItemHeader;

    /// <summary>
    /// Defines the slots available for styling in the ItemHeader component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}