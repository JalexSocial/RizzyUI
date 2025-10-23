
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for media elements like icons or images within an <see cref="RzItem"/>.
/// </summary>
public partial class ItemMedia : RzComponent<ItemMedia.Slots>
{
    /// <summary>
    /// Defines the default styling for the ItemMedia component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none group-has-[[data-slot=item-description]]/item:translate-y-0.5",
        variants: new()
        {
            [m => ((ItemMedia)m).Variant] = new Variant<ItemMediaVariant, Slots>
            {
                [ItemMediaVariant.Icon] = "size-8 border rounded-sm bg-muted [&_svg:not([class*='size-'])]:size-4",
                [ItemMediaVariant.Image] = "size-10 rounded-sm overflow-hidden [&_img]:size-full [&_img]:object-cover",
                [ItemMediaVariant.Default] = "bg-transparent"
            }
        }
    );

    /// <summary>
    /// Gets or sets the content of the media container.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the visual variant of the media container.
    /// Defaults to <see cref="ItemMediaVariant.Default"/>.
    /// </summary>
    [Parameter]
    public ItemMediaVariant Variant { get; set; } = ItemMediaVariant.Default;

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.ItemMedia;

    /// <summary>
    /// Defines the slots available for styling in the ItemMedia component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}