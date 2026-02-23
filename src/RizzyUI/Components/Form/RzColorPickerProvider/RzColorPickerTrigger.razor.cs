using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Provides an accessible, headless trigger that opens an enclosing <see cref="RzColorPickerProvider"/>.
/// </summary>
public partial class RzColorPickerTrigger : RzAsChildComponent<RzColorPickerTrigger.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="RzColorPickerTrigger"/>.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "contents"
    );

    /// <summary>
    /// Gets or sets the content rendered inside the trigger.
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment ChildContent { get; set; } = default!;

    /// <summary>
    /// Gets or sets a value indicating whether trigger interaction is disabled.
    /// </summary>
    [Parameter] public bool Disabled { get; set; }

    /// <summary>
    /// Gets or sets the accessible label used by assistive technologies.
    /// </summary>
    [Parameter] public string? AriaLabel { get; set; }

    [CascadingParameter] private RzColorPickerProvider.Context? ProviderContext { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "div";

        if (ProviderContext is null)
            throw new InvalidOperationException($"{nameof(RzColorPickerTrigger)} must be used within an {nameof(RzColorPickerProvider)}.");

        AriaLabel ??= Localizer["RzColorPickerTrigger.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzColorPickerTrigger.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes?.ToDictionary(kvp => kvp.Key, kvp => (object?)kvp.Value) ?? new Dictionary<string, object?>(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["role"] = "button",
            ["tabindex"] = Disabled ? -1 : 0,
            ["aria-label"] = AriaLabel,
            ["aria-disabled"] = Disabled ? "true" : null,
            ["x-on:click"] = Disabled ? null : "colorPicker.open",
            ["x-on:keydown.enter.prevent"] = Disabled ? null : "colorPicker.open",
            ["x-on:keydown.space.prevent"] = Disabled ? null : "colorPicker.open",
            ["data-slot"] = "color-picker-trigger"
        };

        return attributes;
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.RzColorPickerTrigger;

    /// <summary>
    /// Defines the slots available for styling in <see cref="RzColorPickerTrigger"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the root element.
        /// </summary>
        [Slot("color-picker-trigger")]
        public string? Base { get; set; }
    }
}
