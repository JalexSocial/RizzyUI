using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using RizzyUI.Components.Layout.RzCarousel.Models;
using RizzyUI.Extensions;
using System.Text.Json;

namespace RizzyUI;

/// <summary>
/// A carousel component for cycling through elements. This is the root component that provides context for its children.
/// </summary>
/// <remarks>
/// As a root-level component, its name is prefixed with 'Rz'. Interactivity is powered by Embla Carousel via an Alpine.js component.
/// </remarks>
public partial class RzCarousel : RzComponent
{
    private string _serializedOptions = "{}";
    private string _assets = "[]";

    /// <summary>
    /// Gets or sets the content of the carousel, which should include <see cref="CarouselContent"/> and optionally <see cref="CarouselPrevious"/> and <see cref="CarouselNext"/>.
    /// </summary>
    [Parameter, EditorRequired]
    public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets the configuration options for the underlying Embla Carousel instance.
    /// </summary>
    [Parameter]
    public CarouselOptions Options { get; set; } = new();

    /// <summary>
    /// Gets or sets the ARIA label for the carousel, providing an accessible name for the region.
    /// If not set, a default localized label will be applied.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>
    /// Assets that must load for the Alpine module to boot.
    /// </summary>
    public static readonly string[] DefaultAssets =
    {
        "https://cdn.jsdelivr.net/npm/embla-carousel@8.1.7/embla-carousel.umd.js"
    };

    /// <summary>
    /// Optional array of asset URLs (JS/CSS) for Embla Carousel. Allows overriding the default CDN-based assets.
    /// </summary>
    [Parameter]
    public string[]? ComponentAssets { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzCarousel.DefaultAriaLabel"];
        _assets = JsonSerializer.Serialize(ComponentAssets ?? DefaultAssets);
        _serializedOptions = Options.SerializeAsAlpineData(true);
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzCarousel.DefaultAriaLabel"];
        _assets = JsonSerializer.Serialize(ComponentAssets ?? DefaultAssets);
        _serializedOptions = Options.SerializeAsAlpineData(true);
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzCarousel.Container);
    }
}