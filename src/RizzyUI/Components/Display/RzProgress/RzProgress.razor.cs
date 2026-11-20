using System.Globalization;
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A progress bar: the track, with <c>role="progressbar"</c> and its ARIA values, and a
/// <see cref="ProgressIndicator"/> that fills it. Without child content it renders a default
/// indicator; pass <see cref="ProgressIndicator"/> (and optionally <see cref="ProgressLabel"/>) to
/// style them per instance. <see cref="Value"/> <c>null</c> shows an indeterminate bar.
/// </summary>
/// <remarks>
/// Name the progress bar for assistive technology with <c>aria-labelledby</c> pointing to a visible
/// label, or with <see cref="AriaLabel"/>. Screen readers announce the percentage; set
/// <see cref="ValueText"/> for a different, localized text ("3 of 10 files").
/// </remarks>
public partial class RzProgress : RzComponent<RzProgress.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzProgress component (the track).
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full"
    );

    /// <summary>
    /// The current value, between <see cref="Min"/> and <see cref="Max"/>. <c>null</c> means the
    /// progress is not known: the bar is indeterminate and has no <c>aria-valuenow</c>.
    /// </summary>
    [Parameter]
    public double? Value { get; set; }

    /// <summary> The value of an empty bar. Defaults to 0. </summary>
    [Parameter]
    public double Min { get; set; }

    /// <summary> The value of a full bar. Defaults to 100. </summary>
    [Parameter]
    public double Max { get; set; } = 100;

    /// <summary>
    /// The color of the default indicator (and of a <see cref="ProgressIndicator"/> without its own
    /// classes). Defaults to <see cref="StatusColor.Primary"/>.
    /// </summary>
    [Parameter]
    public StatusColor Variant { get; set; } = StatusColor.Primary;

    /// <summary>
    /// Text for <c>aria-valuetext</c>, read instead of the percentage, for example
    /// <c>"3 of 10 files"</c>. Pass localized text. Not rendered when null.
    /// </summary>
    [Parameter]
    public string? ValueText { get; set; }

    /// <summary>
    /// The accessible name when there is no visible label to point to with <c>aria-labelledby</c>.
    /// Not rendered when null.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>
    /// Custom content: a <see cref="ProgressIndicator"/>, optionally with a <see cref="ProgressLabel"/>.
    /// When null, a default <see cref="ProgressIndicator"/> is rendered.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary> Whether the progress is indeterminate (<see cref="Value"/> is null). </summary>
    public bool IsIndeterminate => Value is null;

    /// <summary> The value as a percentage of the range, clamped to 0–100; 0 when indeterminate. </summary>
    public double Percentage
    {
        get
        {
            if (Value is not { } value || Max <= Min)
                return 0;
            return Math.Clamp((value - Min) / (Max - Min) * 100, 0, 100);
        }
    }

    /// <summary> <c>loading</c>, <c>complete</c> or <c>indeterminate</c>, rendered as <c>data-state</c>. </summary>
    protected string State => IsIndeterminate ? "indeterminate" : Value >= Max ? "complete" : "loading";

    /// <summary> <see cref="Value"/> clamped to the range, for <c>aria-valuenow</c>. </summary>
    protected string? ValueNowText => Value is { } value ? Format(Math.Clamp(value, Min, Math.Max(Min, Max))) : null;

    /// <summary> <see cref="AriaLabel"/>, or an <c>aria-label</c> attribute. </summary>
    protected string? EffectiveAriaLabel => AriaLabel ?? GetAttribute("aria-label");

    /// <summary> <see cref="ValueText"/>, or an <c>aria-valuetext</c> attribute. </summary>
    protected string? EffectiveValueText => ValueText ?? GetAttribute("aria-valuetext");

    private string? GetAttribute(string name) =>
        AdditionalAttributes is not null && AdditionalAttributes.TryGetValue(name, out var value) ? value?.ToString() : null;

    /// <summary> Formats a number for an attribute (invariant culture, shortest round-trip form). </summary>
    protected static string Format(double value) => value.ToString("R", CultureInfo.InvariantCulture);

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzProgress;

    /// <summary>
    /// Defines the slots available for styling in the RzProgress component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The track: the root element with <c>role="progressbar"</c>.
        /// </summary>
        [Slot("progress")]
        public string? Base { get; set; }
    }
}
