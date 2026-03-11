using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Provides an SSR-friendly clipboard primitive that copies text and exposes copied-state feedback through child components.
/// </summary>
public partial class RzClipboard : RzAsChildComponent<RzClipboard.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="RzClipboard"/>.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative inline-flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
    );

    /// <summary>
    /// Gets or sets the text value copied to the clipboard.
    /// </summary>
    [Parameter] public string? Value { get; set; }

    /// <summary>
    /// Gets or sets a CSS selector for resolving copy text from a target element.
    /// </summary>
    [Parameter] public string? TargetSelector { get; set; }

    /// <summary>
    /// Gets or sets whether <see cref="Value"/> is preferred when both value and selector are supplied.
    /// </summary>
    [Parameter] public bool PreferValue { get; set; }

    /// <summary>
    /// Gets or sets the duration in milliseconds the copied feedback state remains visible.
    /// </summary>
    [Parameter] public int FeedbackDuration { get; set; } = 1200;

    /// <summary>
    /// Gets or sets whether copy interaction is disabled.
    /// </summary>
    [Parameter] public bool Disabled { get; set; }

    /// <summary>
    /// Gets or sets whether the component should use an execCommand fallback when Clipboard API is unavailable.
    /// </summary>
    [Parameter] public bool UseFallback { get; set; } = true;

    /// <summary>
    /// Gets or sets the accessible label announced for the copy trigger.
    /// </summary>
    [Parameter] public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets or sets the nested component content.
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment ChildContent { get; set; } = default!;

    private bool IsButtonElement => string.Equals(EffectiveElement, "button", StringComparison.OrdinalIgnoreCase);

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "button";

        AriaLabel ??= Localizer["RzClipboard.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzClipboard.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes?.ToDictionary(kvp => kvp.Key, kvp => (object?)kvp.Value) ?? new Dictionary<string, object?>(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = SlotClasses.GetBase(),
            ["data-alpine-root"] = Id,
            ["data-slot"] = SlotNames.NameOf(SlotTypes.Base),
            ["x-data"] = "rzClipboard",
            ["x-load"] = LoadStrategyOrNull,
            ["data-copy-value"] = Value,
            ["data-target-selector"] = TargetSelector,
            ["data-prefer-value"] = PreferValue.ToString().ToLowerInvariant(),
            ["data-feedback-duration"] = FeedbackDuration.ToString(),
            ["data-use-fallback"] = UseFallback.ToString().ToLowerInvariant(),
            ["data-disabled"] = Disabled.ToString().ToLowerInvariant(),
            ["x-on:click.prevent"] = "copy",
            ["aria-label"] = AriaLabel,
            ["aria-disabled"] = Disabled ? "true" : null,
            ["disabled"] = Disabled && IsButtonElement ? "disabled" : null,
            ["role"] = IsButtonElement ? null : "button",
            ["tabindex"] = IsButtonElement ? null : Disabled ? -1 : 0,
            ["x-on:keydown.enter.prevent"] = IsButtonElement || Disabled ? null : "copy",
            ["x-on:keydown.space.prevent"] = IsButtonElement || Disabled ? null : "copy"
        };

        return attributes;
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.RzClipboard;

    /// <summary>
    /// Defines the slots available for styling in the <see cref="RzClipboard"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the root element.
        /// </summary>
        [Slot("clipboard")]
        public string? Base { get; set; }
    }
}
