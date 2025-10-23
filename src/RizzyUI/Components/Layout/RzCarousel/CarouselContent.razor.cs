
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A container for the carousel items. This component is the scrollable area managed by Embla Carousel.
/// </summary>
public partial class CarouselContent : RzComponent<CarouselContent.Slots>
{
    /// <summary>
    /// Defines the default styling for the CarouselContent component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex",
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
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentCarousel == null)
        {
            throw new InvalidOperationException($"{nameof(CarouselContent)} must be used within an {nameof(RzCarousel)}.");
        }
        Element = "div";
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