
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Text.Json.Serialization;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A carousel component for cycling through elements. This is the root component that provides context for its children.
/// </summary>
/// <remarks>
/// As a root-level component, its name is prefixed with 'Rz'. Interactivity is powered by Embla Carousel via an Alpine.js component.
/// </remarks>
public partial class RzCarousel : RzComponent<RzCarousel.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzCarousel component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative",
        slots: new()
        {
            [s => s.Wrapper] = "relative"
        }
    );

    // The default encoder escapes <, > and & (RZUI-034): the configuration is written into a
    // <script type="application/json"> element, where a "</script>" in an option string would end it.
    private static readonly JsonSerializerOptions _serializerOptions = new()
    {
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
        var keys = new List<string> { "EmblaCore" };
        keys.AddRange(Plugins.Select(plugin => plugin.AssetKey).Where(key => !string.IsNullOrEmpty(key))!);

        return JsonSerializer.Serialize(RizzyUIConfig.Value.ResolveAssets(keys, RequestPathBase));
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCarousel;

    /// <summary>
    /// Defines the slots available for styling in the RzCarousel component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the main carousel container.
        /// </summary>
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the inner wrapper managed by Alpine.js.
        /// </summary>
        public string? Wrapper { get; set; }
    }
}