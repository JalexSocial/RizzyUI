using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;
using System.Text.Json;
using System.Text.Json.Serialization;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Provides a themed color input using the Coloris picker library.
/// </summary>
public partial class RzColorPicker : InputBase<string, RzColorPicker.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="RzColorPicker"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "w-full",
        slots: new()
        {
            [s => s.InputGroup] = "w-full",
            [s => s.Input] = "",
            [s => s.ThumbnailContainer] = "px-3",
            [s => s.Thumbnail] = "size-5 rounded-md border border-border shadow-sm ring-offset-background"
        }
    );

    private string _assets = "[]";
    private string _serializedConfig = "{}";

    [Inject]
    private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    /// <summary>
    /// Gets the generated input identifier used by Coloris.
    /// </summary>
    public string InputId => $"{Id}-input";

    /// <summary>
    /// Gets or sets the color output format.
    /// </summary>
    [Parameter] public ColorFormat Format { get; set; } = ColorFormat.Hex;

    /// <summary>
    /// Gets or sets a value indicating whether alpha transparency is enabled.
    /// </summary>
    [Parameter] public bool Alpha { get; set; }

    /// <summary>
    /// Gets or sets optional swatches shown inside the picker.
    /// </summary>
    [Parameter] public IEnumerable<string>? Swatches { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether only swatches should be selectable.
    /// </summary>
    [Parameter] public bool SwatchesOnly { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the close button is visible.
    /// </summary>
    [Parameter] public bool CloseButton { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the clear button is visible.
    /// </summary>
    [Parameter] public bool ClearButton { get; set; }

    /// <summary>
    /// Gets or sets placeholder text for the input.
    /// </summary>
    [Parameter] public string? Placeholder { get; set; }

    /// <summary>
    /// Gets or sets the thumbnail placement.
    /// </summary>
    [Parameter] public ColorThumbnailPosition ThumbnailPosition { get; set; } = ColorThumbnailPosition.Start;

    /// <summary>
    /// Gets or sets the logical keys used to resolve required assets.
    /// </summary>
    [Parameter] public string[] ComponentAssetKeys { get; set; } = ["Coloris", "ColorisCss"];

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Placeholder ??= Localizer["RzColorPicker.DefaultPlaceholder"];
        SerializeConfigAndAssets();
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        Placeholder ??= Localizer["RzColorPicker.DefaultPlaceholder"];
        SerializeConfigAndAssets();
    }

    private void SerializeConfigAndAssets()
    {
        var options = new ColorisOptions
        {
            Format = Format.ToString().ToKebabCase(),
            Alpha = Alpha,
            Swatches = Swatches,
            SwatchesOnly = SwatchesOnly,
            CloseButton = CloseButton,
            ClearButton = ClearButton,
            A11y = new ColorisA11yOptions
            {
                Open = Localizer["RzColorPicker.A11y.Open"],
                Close = Localizer["RzColorPicker.A11y.Close"],
                Clear = Localizer["RzColorPicker.A11y.Clear"],
                Marker = Localizer["RzColorPicker.A11y.Marker"],
                HueSlider = Localizer["RzColorPicker.A11y.HueSlider"],
                AlphaSlider = Localizer["RzColorPicker.A11y.AlphaSlider"],
                Format = Localizer["RzColorPicker.A11y.Format"],
                Swatch = Localizer["RzColorPicker.A11y.Swatch"],
                Input = Localizer["RzColorPicker.A11y.Input"],
                Instruction = Localizer["RzColorPicker.A11y.Instruction"]
            }
        };

        _serializedConfig = JsonSerializer.Serialize(options, new JsonSerializerOptions
        {
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        var assetUrls = ComponentAssetKeys
            .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
            .Where(url => !string.IsNullOrEmpty(url))
            .ToList();
        _assets = JsonSerializer.Serialize(assetUrls);
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzColorPicker;

    /// <summary>
    /// Defines the slots available for styling in <see cref="RzColorPicker"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the root element.
        /// </summary>
        [Slot("color-picker")]
        public string? Base { get; set; }

        /// <summary>
        /// Gets or sets classes for the input-group wrapper.
        /// </summary>
        [Slot("input-group")]
        public string? InputGroup { get; set; }

        /// <summary>
        /// Gets or sets classes for the text input.
        /// </summary>
        [Slot("input")]
        public string? Input { get; set; }

        /// <summary>
        /// Gets or sets classes for the thumbnail container addon.
        /// </summary>
        [Slot("thumbnail-container")]
        public string? ThumbnailContainer { get; set; }

        /// <summary>
        /// Gets or sets classes for the thumbnail swatch.
        /// </summary>
        [Slot("thumbnail")]
        public string? Thumbnail { get; set; }
    }
}
