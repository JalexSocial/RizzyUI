using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Charts;
using System.Text.Json;
using System.Text.Json.Serialization;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A data visualization component that integrates with Chart.js through Alpine.js.
/// </summary>
public partial class RzChart : RzComponent<RzChart.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzChart component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "w-full",
        slots: new()
        {
            [s => s.Container] = "relative h-full min-h-[300px] w-full",
            [s => s.Canvas] = "h-full w-full"
        }
    );

    private string _assets = "[]";
    private string _serializedConfig = "{}";

    [Inject]
    private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    /// <summary>
    /// Gets the unique ID for the configuration script tag.
    /// </summary>
    protected string ConfigScriptId => $"{Id}-config";

    /// <summary>
    /// Gets or sets the configuration action that builds the Chart.js configuration graph.
    /// </summary>
    [Parameter, EditorRequired]
    public Action<ChartBuilder> Configure { get; set; } = default!;

    /// <summary>
    /// Gets or sets the logical keys used to resolve optional assets from <see cref="RizzyUIConfig"/>.
    /// </summary>
    [Parameter]
    public string[] ComponentAssetKeys { get; set; } = ["ChartJs"];

    /// <summary>
    /// Gets or sets the accessible name for the rendered chart canvas.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzChart.DefaultAriaLabel"];
        UpdateConfiguration();
        UpdateAssets();
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzChart.DefaultAriaLabel"];
        UpdateConfiguration();
        UpdateAssets();
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzChart;

    private void UpdateConfiguration()
    {
        var builder = new ChartBuilder();
        Configure(builder);

        _serializedConfig = JsonSerializer.Serialize(builder.Chart, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            Converters = { new ChartJsObjectValueConverter() }
        });
    }

    private void UpdateAssets()
    {
        var assetUrls = ComponentAssetKeys
            .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
            .Where(url => !string.IsNullOrEmpty(url))
            .ToList();

        _assets = JsonSerializer.Serialize(assetUrls);
    }

    /// <summary>
    /// Defines the slots available for styling in the RzChart component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the root element.
        /// </summary>
        [Slot("chart")]
        public string? Base { get; set; }

        /// <summary>
        /// Gets or sets classes for the Alpine root container.
        /// </summary>
        [Slot("chart-container")]
        public string? Container { get; set; }

        /// <summary>
        /// Gets or sets classes for the chart canvas element.
        /// </summary>
        [Slot("chart-canvas")]
        public string? Canvas { get; set; }
    }
}
