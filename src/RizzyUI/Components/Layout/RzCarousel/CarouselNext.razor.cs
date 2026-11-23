
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A button to navigate to the next slide in the carousel.
/// </summary>
public partial class CarouselNext : RzAsChildComponent<CarouselNext.Slots>
{
    /// <summary>
    /// Defines the default styling for the CarouselNext component. Like shadcn/ui, the button sits outside the
    /// slides: 48px to the right of them in a horizontal carousel, and below them, rotated, in a vertical one
    /// (<see cref="CarouselOptions.Axis"/> <c>"y"</c>). Leave room for it around the carousel, for example with margin.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "absolute size-8 rounded-full inline-flex items-center justify-center border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 top-1/2 -right-12 -translate-y-1/2 group-data-[orientation=vertical]/carousel:top-auto group-data-[orientation=vertical]/carousel:-bottom-12 group-data-[orientation=vertical]/carousel:right-auto group-data-[orientation=vertical]/carousel:left-1/2 group-data-[orientation=vertical]/carousel:-translate-x-1/2 group-data-[orientation=vertical]/carousel:translate-y-0 group-data-[orientation=vertical]/carousel:rotate-90",
        slots: new()
        {
            [s => s.ButtonIcon] = "h-4 w-4"
        }
    );

    /// <summary>
    /// Gets or sets the content of the button. If not provided, a default icon is used.
    /// This is also the content that will be merged when AsChild is true.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the ARIA label for the button, providing an accessible name.
    /// If not set, a default localized label will be applied.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override string DefaultElement => "button";

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(CopyAdditionalAttributes(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = SlotClasses.GetBase(),
            ["aria-label"] = EffectiveAriaLabel,
            ["x-on:click"] = "scrollNext",
            [":disabled"] = "cannotScrollNext"
        };
        return attributes;
    }

    /// <summary>The <see cref="AriaLabel"/> parameter, or its localized default.</summary>
    protected string EffectiveAriaLabel => AriaLabel ?? Localizer["RzCarousel.NextButtonAriaLabel"];

    /// <inheritdoc/>
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.CarouselNext;

    /// <summary>
    /// Defines the slots available for styling in the CarouselNext component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the button element.
        /// </summary>
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the icon inside the button.
        /// </summary>
        public string? ButtonIcon { get; set; }
    }
}