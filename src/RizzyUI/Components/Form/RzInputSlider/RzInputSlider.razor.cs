using System.Globalization;
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A single-value <see cref="RzSlider"/> bound to a model property with <c>For</c>, like the other
/// form inputs (Summit SF-070): it posts the field's model path (<c>Model.LengthMinutes</c>) with one
/// value, reports validation errors with <c>data-invalid</c>, and works with any numeric property type.
/// </summary>
/// <typeparam name="TValue">The numeric property type (<c>int</c>, <c>double</c>, <c>decimal</c>, ...).</typeparam>
public partial class RzInputSlider<TValue> : InputBase<TValue, RzInputSliderSlots>
{
    /// <summary>Defines the default styling (the slider styles itself).</summary>
    public static readonly TvDescriptor<RzComponent<RzInputSliderSlots>, RzInputSliderSlots> DefaultDescriptor = new(@base: "");

    /// <summary>The minimum value.</summary>
    [Parameter] public double Min { get; set; }

    /// <summary>The maximum value.</summary>
    [Parameter] public double Max { get; set; } = 100;

    /// <summary>The step between values.</summary>
    [Parameter] public double Step { get; set; } = 1;

    /// <summary>Whether the slider is disabled.</summary>
    [Parameter] public bool Disabled { get; set; }

    /// <summary>Accessible name of the thumb, when no visible label names it.</summary>
    [Parameter] public string? AriaLabel { get; set; }

    /// <summary>Id of the element that labels the thumb.</summary>
    [Parameter] public string? AriaLabelledBy { get; set; }

    /// <summary>Id of the element that describes the thumb.</summary>
    [Parameter] public string? AriaDescribedBy { get; set; }

    /// <summary>Format of the thumb's <c>aria-valuetext</c> (<c>{0} min</c>).</summary>
    [Parameter] public string? ValueFormat { get; set; }

    /// <inheritdoc />
    protected override bool IdIsLabelTarget => false;

    /// <summary>The bound value as a double.</summary>
    protected double SliderValue => Value is null ? Min : Convert.ToDouble(Value, CultureInfo.InvariantCulture);

    /// <summary>The model path, as Blazor's own inputs post it (D-28).</summary>
    protected string FieldName => RzFieldNames.For(For);

    /// <summary>The caller's attributes, with <c>data-invalid</c> while the field has errors.</summary>
    protected Dictionary<string, object> SliderAttributes
    {
        get
        {
            var attributes = AdditionalAttributes is null ? new Dictionary<string, object>() : new Dictionary<string, object>(AdditionalAttributes);
            if (IsInvalid)
                attributes["data-invalid"] = "true";
            return attributes;
        }
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<RzInputSliderSlots>, RzInputSliderSlots> GetDescriptor() => DefaultDescriptor;
}

/// <summary>Defines the slots available for styling in <see cref="RzInputSlider{TValue}"/>.</summary>
public sealed partial class RzInputSliderSlots : ISlots
{
    /// <summary>The slider root.</summary>
    [Slot("input-slider")]
    public string? Base { get; set; }
}
