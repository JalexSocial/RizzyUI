
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A wrapper for a single slide within the carousel.
/// </summary>
public partial class CarouselItem : RzComponent
{
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
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzCarousel.Item);
    }
}