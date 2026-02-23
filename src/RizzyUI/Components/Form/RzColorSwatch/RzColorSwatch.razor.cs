using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Displays a themed color swatch that supports transparent values and runtime Alpine updates.
/// </summary>
public partial class RzColorSwatch : RzComponent<RzColorSwatch.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="RzColorSwatch"/>.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex align-middle",
        slots: new()
        {
            [s => s.Swatch] = "box-border rounded-sm border border-border shadow-sm [background-clip:padding-box] forced-color-adjust-none"
        },
        variants: new()
        {
            [c => ((RzColorSwatch)c).Size] = new Variant<ColorSwatchSize, Slots>
            {
                [ColorSwatchSize.Default] = new() { [s => s.Swatch] = "size-8" },
                [ColorSwatchSize.Small] = new() { [s => s.Swatch] = "size-6" },
                [ColorSwatchSize.Large] = new() { [s => s.Swatch] = "size-12" }
            },
            [c => ((RzColorSwatch)c).Disabled] = new Variant<bool, Slots>
            {
                [true] = new() { [s => s.Swatch] = "pointer-events-none opacity-50" }
            }
        }
    );

    private string? SwatchModelBinding { get; set; }

    private IReadOnlyDictionary<string, object?>? RootAttributes { get; set; }

    /// <summary>
    /// Gets or sets the color value rendered by the swatch.
    /// </summary>
    [Parameter] public string? Value { get; set; }

    /// <summary>
    /// Gets or sets the swatch size variant.
    /// </summary>
    [Parameter] public ColorSwatchSize Size { get; set; } = ColorSwatchSize.Default;

    /// <summary>
    /// Gets or sets a value indicating whether transparent backgrounds should be rendered as solid color only.
    /// </summary>
    [Parameter] public bool WithoutTransparency { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the swatch is disabled.
    /// </summary>
    [Parameter] public bool Disabled { get; set; }

    /// <summary>
    /// Gets or sets a custom aria-label for the swatch.
    /// </summary>
    [Parameter] public string? AriaLabel { get; set; }

    private string EffectiveAriaLabel => string.IsNullOrWhiteSpace(AriaLabel)
        ? string.IsNullOrWhiteSpace(Value)
            ? Localizer["RzColorSwatch.A11y.NoColor"]
            : string.Format(Localizer["RzColorSwatch.A11y.ColorValue"], Value)
        : AriaLabel;

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        if (AdditionalAttributes is null)
        {
            RootAttributes = null;
            SwatchModelBinding = null;
            return;
        }

        var rootAttributes = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);
        SwatchModelBinding = null;

        foreach (var attribute in AdditionalAttributes)
        {
            if (string.Equals(attribute.Key, "x-model", StringComparison.OrdinalIgnoreCase))
            {
                SwatchModelBinding = attribute.Value?.ToString();
                continue;
            }

            rootAttributes[attribute.Key] = attribute.Value;
        }

        RootAttributes = rootAttributes;
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzColorSwatch;

    /// <summary>
    /// Defines the slots available for styling in <see cref="RzColorSwatch"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the root element.
        /// </summary>
        [Slot("color-swatch")]
        public string? Base { get; set; }

        /// <summary>
        /// Gets or sets classes for the rendered swatch element.
        /// </summary>
        [Slot("swatch")]
        public string? Swatch { get; set; }
    }
}
