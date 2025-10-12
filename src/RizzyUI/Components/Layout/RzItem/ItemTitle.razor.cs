
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <summary>
/// A component for displaying the title within an <see cref="ItemContent"/>.
/// </summary>
public partial class ItemTitle : RzComponent<ItemTitle.Slots>
{
    /// <summary>
    /// Defines the default styling for the ItemTitle component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex w-fit items-center gap-2 text-sm leading-snug font-medium"
    );

    /// <summary>
    /// Gets or sets the content to be rendered as the title.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.ItemTitle;

    /// <summary>
    /// Defines the slots available for styling in the ItemTitle component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}