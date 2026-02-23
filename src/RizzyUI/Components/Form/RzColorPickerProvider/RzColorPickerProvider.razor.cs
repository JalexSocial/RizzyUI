using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;
using System.Text.Json;
using System.Text.Json.Serialization;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Provides headless Coloris state and behavior for composed color picker experiences.
/// </summary>
public partial class RzColorPickerProvider : RzComponent<RzColorPickerProvider.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="RzColorPickerProvider"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "contents"
    );

    private readonly Context _context = new();
    private string _assets = "[]";
    private string _serializedConfig = "{}";

    [Inject]
    private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    /// <summary>
    /// Gets or sets the content rendered inside the provider scope.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the initial color value.
    /// </summary>
    [Parameter] public string? Value { get; set; }

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
    /// Gets or sets the logical keys used to resolve required assets.
    /// </summary>
    [Parameter] public string[] ComponentAssetKeys { get; set; } = ["Coloris"];

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        SerializeConfigAndAssets();
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        _context.ProviderId = Id;
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
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzColorPickerProvider;

    /// <summary>
    /// Defines the slots available for styling in <see cref="RzColorPickerProvider"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the root element.
        /// </summary>
        [Slot("color-picker-provider")]
        public string? Base { get; set; }
    }

    /// <summary>
    /// Provides cascaded context for provider descendants.
    /// </summary>
    public sealed class Context
    {
        /// <summary>
        /// Gets or sets the provider element identifier.
        /// </summary>
        public string ProviderId { get; set; } = string.Empty;
    }
}
