
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A button to navigate to the next slide in the carousel.
/// </summary>
public partial class CarouselNext : RzAsChildComponent<CarouselNext.Slots>
{
    /// <summary>
    /// Defines the default styling for the CarouselNext component.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "absolute size-8 rounded-full top-1/2 -translate-y-1/2 right-0 inline-flex items-center justify-center border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
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
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "button";
        AriaLabel ??= Localizer["RzCarousel.NextButtonAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzCarousel.NextButtonAriaLabel"];
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes?.ToDictionary(kvp => kvp.Key, kvp => (object?)kvp.Value) ?? new Dictionary<string, object?>(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = SlotClasses.GetBase(),
            ["aria-label"] = AriaLabel,
            ["x-on:click"] = "scrollNext",
            [":disabled"] = "cannotScrollNext"
        };
        return attributes;
    }

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