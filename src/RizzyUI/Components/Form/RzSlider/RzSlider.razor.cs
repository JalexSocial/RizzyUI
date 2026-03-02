using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;
using System.Globalization;
using System.Text.Json;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents an SSR-first slider component with Alpine-enhanced pointer and keyboard interactions.
/// </summary>
public partial class RzSlider : RzComponent<RzSlider.Slots>
{
    /// <summary>
    /// Defines the default styling for the <see cref="RzSlider"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative flex w-full touch-none select-none items-center data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        slots: new()
        {
            [s => s.Track] = "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
            [s => s.Range] = "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
            [s => s.Thumb] = "border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-background shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50",
            [s => s.Input] = "hidden"
        },
        variants: new()
        {
            [c => ((RzSlider)c).Orientation] = new Variant<SliderOrientation, Slots>
            {
                [SliderOrientation.Horizontal] = new()
                {
                    [s => s.Base] = "flex-row",
                    [s => s.Track] = "h-1.5 w-full"
                },
                [SliderOrientation.Vertical] = new()
                {
                    [s => s.Base] = "h-full min-h-44 w-auto flex-col",
                    [s => s.Track] = "h-full w-1.5"
                }
            },
            [c => ((RzSlider)c).Disabled] = new Variant<bool, Slots>
            {
                [true] = new()
                {
                    [s => s.Base] = "pointer-events-none opacity-50",
                    [s => s.Thumb] = "pointer-events-none"
                }
            }
        }
    );

    private string _assets = "[]";
    private string _serializedValues = "[]";

    [Inject]
    private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    /// <summary>
    /// Gets or sets the current slider values.
    /// </summary>
    [Parameter]
    public double[]? Value { get; set; }

    /// <summary>
    /// Gets or sets the default slider values used when <see cref="Value"/> is not provided.
    /// </summary>
    [Parameter]
    public double[]? DefaultValue { get; set; }

    /// <summary>
    /// Gets or sets the minimum slider value.
    /// </summary>
    [Parameter]
    public double Min { get; set; }

    /// <summary>
    /// Gets or sets the maximum slider value.
    /// </summary>
    [Parameter]
    public double Max { get; set; } = 100;

    /// <summary>
    /// Gets or sets the slider step increment.
    /// </summary>
    [Parameter]
    public double Step { get; set; } = 1;

    /// <summary>
    /// Gets or sets the slider orientation.
    /// </summary>
    [Parameter]
    public SliderOrientation Orientation { get; set; } = SliderOrientation.Horizontal;

    /// <summary>
    /// Gets or sets a value indicating whether the slider is disabled.
    /// </summary>
    [Parameter]
    public bool Disabled { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the slider value direction is inverted.
    /// </summary>
    [Parameter]
    public bool Inverted { get; set; }

    /// <summary>
    /// Gets or sets the minimum value distance between adjacent thumbs.
    /// </summary>
    [Parameter]
    public double MinStepsBetweenThumbs { get; set; }

    /// <summary>
    /// Gets or sets the hidden input base name used for form submission.
    /// </summary>
    [Parameter]
    public string? Name { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether hidden inputs use indexed naming.
    /// </summary>
    [Parameter]
    public bool UseIndexedNames { get; set; } = true;

    /// <summary>
    /// Gets or sets the default ARIA label for single-thumb usage.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets or sets the per-thumb ARIA labels.
    /// </summary>
    [Parameter]
    public string[]? AriaLabels { get; set; }

    /// <summary>
    /// Gets or sets the value for aria-labelledby.
    /// </summary>
    [Parameter]
    public string? AriaLabelledBy { get; set; }

    /// <summary>
    /// Gets or sets the value for aria-describedby.
    /// </summary>
    [Parameter]
    public string? AriaDescribedBy { get; set; }

    /// <summary>
    /// Gets or sets an optional value format hint.
    /// </summary>
    [Parameter]
    public string? ValueFormat { get; set; }

    /// <summary>
    /// Gets or sets the thumb tabindex override.
    /// </summary>
    [Parameter]
    public int? TabIndex { get; set; }

    /// <summary>
    /// Gets or sets logical asset keys used to resolve slider script dependencies.
    /// </summary>
    [Parameter]
    public string[] ComponentAssetKeys { get; set; } = ["SliderScript"];

    /// <summary>
    /// Gets the server-resolved and sanitized slider values.
    /// </summary>
    protected double[] EffectiveValues { get; private set; } = [];

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzSlider.DefaultAriaLabel"];
        SetElementDefault();
        UpdateState();
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzSlider.DefaultAriaLabel"];
        SetElementDefault();
        UpdateState();
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzSlider;

    private void UpdateState()
    {
        EffectiveValues = ResolveEffectiveValues();
        _serializedValues = JsonSerializer.Serialize(EffectiveValues);
        UpdateAssets();
    }

    private void SetElementDefault()
    {
        if (string.IsNullOrEmpty(Element))
            Element = "div";
    }

    private void UpdateAssets()
    {
        var assetUrls = ComponentAssetKeys
            .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
            .Where(url => !string.IsNullOrEmpty(url))
            .ToList();

        _assets = JsonSerializer.Serialize(assetUrls);
    }

    private double[] ResolveEffectiveValues()
    {
        var source = Value?.Length > 0
            ? Value
            : DefaultValue?.Length > 0
                ? DefaultValue
                : [Min];

        var normalizedStep = Step <= 0 ? 1 : Step;
        var lowerBound = Math.Min(Min, Max);
        var upperBound = Math.Max(Min, Max);

        var sanitized = source
            .Select(v => SnapToStep(Clamp(v, lowerBound, upperBound), normalizedStep, lowerBound))
            .ToArray();

        if (sanitized.Length == 0)
            sanitized = [lowerBound];

        if (sanitized.Length > 1)
            Array.Sort(sanitized);

        EnforceMinDistance(sanitized, lowerBound, upperBound, normalizedStep);
        return sanitized;
    }

    private void EnforceMinDistance(double[] values, double lowerBound, double upperBound, double normalizedStep)
    {
        if (values.Length < 2)
            return;

        var minimumDistance = Math.Max(0, MinStepsBetweenThumbs);
        for (var index = 1; index < values.Length; index++)
        {
            var minimumValue = values[index - 1] + minimumDistance;
            if (values[index] < minimumValue)
                values[index] = SnapToStep(Clamp(minimumValue, lowerBound, upperBound), normalizedStep, lowerBound);
        }

        for (var index = values.Length - 2; index >= 0; index--)
        {
            var maximumValue = values[index + 1] - minimumDistance;
            if (values[index] > maximumValue)
                values[index] = SnapToStep(Clamp(maximumValue, lowerBound, upperBound), normalizedStep, lowerBound);
        }
    }

    private static double Clamp(double value, double min, double max)
    {
        if (value < min)
            return min;
        if (value > max)
            return max;
        return value;
    }

    private static double SnapToStep(double value, double step, double min)
    {
        if (step <= 0)
            return value;

        var snapped = min + Math.Round((value - min) / step) * step;
        return Math.Round(snapped, 6, MidpointRounding.AwayFromZero);
    }

    private string GetInputName(int index)
    {
        if (string.IsNullOrWhiteSpace(Name))
            return string.Empty;

        return UseIndexedNames ? $"{Name}[{index}]" : Name;
    }

    private string GetThumbAriaLabel(int index)
    {
        if (AriaLabels is { Length: > 0 } && index < AriaLabels.Length && !string.IsNullOrWhiteSpace(AriaLabels[index]))
            return AriaLabels[index];

        if (EffectiveValues.Length <= 1)
            return AriaLabel ?? Localizer["RzSlider.DefaultAriaLabel"];

        return index == 0
            ? Localizer["RzSlider.MinimumThumbAriaLabel"]
            : index == 1
                ? Localizer["RzSlider.MaximumThumbAriaLabel"]
                : $"{Localizer["RzSlider.DefaultAriaLabel"]} {index + 1}";
    }

    /// <summary>
    /// Defines the slots available for styling in the component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the slider root element.
        /// </summary>
        [Slot("slider")]
        public string? Base { get; set; }

        /// <summary>
        /// Gets or sets classes for the slider track.
        /// </summary>
        [Slot("slider-track")]
        public string? Track { get; set; }

        /// <summary>
        /// Gets or sets classes for the filled slider range.
        /// </summary>
        [Slot("slider-range")]
        public string? Range { get; set; }

        /// <summary>
        /// Gets or sets classes for slider thumbs.
        /// </summary>
        [Slot("slider-thumb")]
        public string? Thumb { get; set; }

        /// <summary>
        /// Gets or sets classes for hidden input elements.
        /// </summary>
        [Slot("slider-input")]
        public string? Input { get; set; }
    }
}

/// <summary>
/// Defines orientation options for <see cref="RzSlider"/>.
/// </summary>
public enum SliderOrientation
{
    /// <summary>
    /// Represents horizontal orientation.
    /// </summary>
    Horizontal,

    /// <summary>
    /// Represents vertical orientation.
    /// </summary>
    Vertical
}
