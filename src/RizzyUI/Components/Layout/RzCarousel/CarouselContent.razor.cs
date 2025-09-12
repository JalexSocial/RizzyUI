
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A container for the carousel items. This component is the scrollable area managed by Embla Carousel.
/// </summary>
public partial class CarouselContent : RzComponent
{
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
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzCarousel.Content);
    }
}