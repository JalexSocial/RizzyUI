
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using Rizzy.Utility;
using RizzyUI.Extensions;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace RizzyUI;

/// <summary>
/// A carousel component for cycling through elements. This is the root component that provides context for its children.
/// </summary>
/// <remarks>
/// As a root-level component, its name is prefixed with 'Rz'. Interactivity is powered by Embla Carousel via an Alpine.js component.
/// </remarks>
public partial class RzCarousel : RzComponent
{
    private static readonly JsonSerializerOptions _serializerOptions = new()
    {
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };
    private string _serializedConfig = "{}";
    private string _assets = "[]";

    [Inject]
    private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

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
    /// Gets or sets a collection of Embla Carousel plugins to initialize with the carousel.
    /// </summary>
    [Parameter]
    public IEnumerable<EmblaPlugin> Plugins { get; set; } = Enumerable.Empty<EmblaPlugin>();

    /// <summary>
    /// Gets or sets the ARIA label for the carousel, providing an accessible name for the region.
    /// If not set, a default localized label will be applied.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzCarousel.DefaultAriaLabel"];
        UpdateConfiguration();
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzCarousel.DefaultAriaLabel"];
        UpdateConfiguration();
    }

    private void UpdateConfiguration()
    {
        var combinedConfig = new
        {
            Options,
            Plugins
        };

        _serializedConfig = JsonSerializer.Serialize(combinedConfig, _serializerOptions);
        _assets = BuildAssetList();
    }

    private string BuildAssetList()
    {
        var assetUrls = new HashSet<string>();
        var configAssets = RizzyUIConfig.Value.AssetUrls;

        // Add core Embla asset
        if (configAssets.TryGetValue("EmblaCore", out var coreUrl))
        {
            assetUrls.Add(coreUrl);
        }
        else
        {
            // Log or handle missing core asset
        }

        // Add assets for each configured plugin
        foreach (var plugin in Plugins)
        {
            if (!string.IsNullOrEmpty(plugin.AssetKey) && configAssets.TryGetValue(plugin.AssetKey, out var pluginUrl))
            {
                assetUrls.Add(pluginUrl);
            }
            else
            {
                // Log or handle missing plugin asset
            }
        }

        return JsonSerializer.Serialize(assetUrls);
    }

    /// <inheritdoc/>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzCarousel.Container);
    }
}