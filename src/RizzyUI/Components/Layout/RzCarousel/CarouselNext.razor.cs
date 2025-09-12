
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A button to navigate to the next slide in the carousel.
/// </summary>
public partial class CarouselNext : RzAsChildComponent
{
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
        var attributes = new Dictionary<string, object?>(AdditionalAttributes ?? new(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = RootClass(),
            ["aria-label"] = AriaLabel,
            ["x-on:click"] = "scrollNext",
            [":disabled"] = "cannotScrollNext"
        };
        return attributes;
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzCarousel.NextButton);
    }
}