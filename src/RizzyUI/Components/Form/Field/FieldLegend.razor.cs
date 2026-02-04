
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents the legend for a `RzFieldSet`, providing a caption for the grouped fields.
/// </summary>
public partial class FieldLegend : RzComponent<FieldLegend.Slots>
{
    /// <summary>
    /// Defines the default styling for the FieldLegend component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "mb-3 font-medium",
        variants: new()
        {
            [c => ((FieldLegend)c).Variant] = new Variant<FieldLegendVariant, Slots>
            {
                [FieldLegendVariant.Legend] = "text-base",
                [FieldLegendVariant.Label] = "text-sm"
            }
        }
    );

    /// <summary>
    /// Gets or sets the content to be rendered inside the legend.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the visual variant of the legend, affecting its text size.
    /// Defaults to <see cref="FieldLegendVariant.Legend"/>.
    /// </summary>
    [Parameter]
    public FieldLegendVariant Variant { get; set; } = FieldLegendVariant.Legend;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "legend";
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.FieldLegend;

    /// <summary>
    /// Defines the slots available for styling in the FieldLegend component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("field-legend")]
        public string? Base { get; set; }
    }
}

/// <summary>
/// Specifies the visual variant for a FieldLegend.
/// </summary>
public enum FieldLegendVariant
{
    /// <summary>
    /// Standard legend styling with base text size.
    /// </summary>
    Legend,
    /// <summary>
    /// Label-like styling with smaller text size.
    /// </summary>
    Label
}