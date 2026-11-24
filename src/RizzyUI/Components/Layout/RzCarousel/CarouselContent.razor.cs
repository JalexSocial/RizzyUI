
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for the carousel items. This component is the scrollable area managed by Embla Carousel.
/// </summary>
public partial class CarouselContent : RzComponent<CarouselContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the CarouselContent component. As in shadcn/ui, a negative margin
    /// (<c>-ml-4</c>, or <c>-mt-4</c> in a vertical carousel) offsets the <c>pl-4</c>/<c>pt-4</c> of each
    /// <see cref="CarouselItem"/>, so slides have a 16px gap and the first one lines up with the carousel's edge.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex -ml-4 group-data-[orientation=vertical]/carousel:ml-0 group-data-[orientation=vertical]/carousel:-mt-4 group-data-[orientation=vertical]/carousel:flex-col",
        slots: new()
        {
            [s => s.Viewport] = "overflow-hidden"
        }
    );

    /// <summary>
    /// Gets the parent <see cref="RzCarousel"/> component.
    /// </summary>
    [CascadingParameter]
    protected RzCarousel? ParentCarousel { get; set; }

    /// <summary>
    /// Gets or sets the content of the carousel, which should be a series of <see cref="CarouselItem"/> components.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override string DefaultElement => "div";

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentCarousel == null)
        {
            throw new InvalidOperationException($"{nameof(CarouselContent)} must be used within an {nameof(RzCarousel)}.");
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CarouselContent;

    /// <summary>
    /// Defines the slots available for styling in the CarouselContent component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the main content container.
        /// </summary>
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the viewport wrapper.
        /// </summary>
        public string? Viewport { get; set; }
    }
}