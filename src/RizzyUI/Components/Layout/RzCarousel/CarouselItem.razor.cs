
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using RizzyUI.TailwindVariants;

namespace RizzyUI;

/// <summary>
/// A wrapper for a single slide within the carousel.
/// </summary>
public partial class CarouselItem : RzComponent<CarouselItem.Slots>
{
    /// <summary>
    /// Defines the default styling for the CarouselItem component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "min-w-0 shrink-0 grow-0 basis-full"
    );

    /// <summary>
    /// Gets or sets the content of the carousel item.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "div";
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.CarouselItem;

    /// <summary>
    /// Defines the slots available for styling in the CarouselItem component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}