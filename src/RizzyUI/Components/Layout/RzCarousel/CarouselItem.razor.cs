
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A wrapper for a single slide within the carousel.
/// </summary>
public partial class CarouselItem : RzComponent<CarouselItem.Slots>
{
    /// <summary>
    /// Defines the default styling for the CarouselItem component. The padding (<c>pl-4</c>, or <c>pt-4</c> in a
    /// vertical carousel) is the gap between slides; <see cref="CarouselContent"/>'s negative margin offsets it.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "min-w-0 shrink-0 grow-0 basis-full pl-4 group-data-[orientation=vertical]/carousel:pl-0 group-data-[orientation=vertical]/carousel:pt-4"
    );

    /// <summary>
    /// Gets or sets the content of the carousel item.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override string DefaultElement => "div";

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CarouselItem;

    /// <summary>
    /// Defines the slots available for styling in the CarouselItem component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}