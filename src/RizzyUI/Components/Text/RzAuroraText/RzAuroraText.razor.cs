using System.Globalization;
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Displays inline content with an animated aurora-style gradient text effect.
/// </summary>
public partial class RzAuroraText : RzComponent<RzAuroraText.Slots>
{
    private static readonly string[] DefaultColors = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"];

    /// <summary>
    /// Defines the default styling for the RzAuroraText component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative inline-block",
        slots: new()
        {
            [s => s.SrText] = "sr-only",
            [s => s.Text] = "animate-aurora relative bg-size-[200%_auto] bg-clip-text text-transparent"
        }
    );

    /// <summary>
    /// Gets or sets the inline content rendered as aurora text.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the CSS colors used to build the aurora gradient.
    /// </summary>
    [Parameter]
    public string[]? Colors { get; set; }

    /// <summary>
    /// Gets or sets the relative animation speed multiplier.
    /// </summary>
    [Parameter]
    public double Speed { get; set; } = 1d;

    /// <summary>
    /// Gets or sets an explicit ARIA label for the component.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether this text is decorative for assistive technologies.
    /// </summary>
    [Parameter]
    public bool Decorative { get; set; }

    /// <summary>
    /// Gets the inline style of the visual aurora text node: only for custom <see cref="Colors"/> or
    /// <see cref="Speed"/>. The default gradient and duration come from the <c>rz-aurora-default</c> CSS
    /// class, so the default works under a strict <c>style-src</c> (Summit SF-035).
    /// </summary>
    protected string? TextStyle => UsesDefaults ? null :
        $"background-image: {BuildGradient()}; animation-duration: {GetAnimationDurationSeconds().ToString("0.###", CultureInfo.InvariantCulture)}s; -webkit-background-clip: text; -webkit-text-fill-color: transparent;";

    /// <summary>Whether the default colors and speed apply (no inline style is needed).</summary>
    protected bool UsesDefaults => Colors is not { Length: > 0 } && Speed == 1d;

    /// <summary>The class that supplies the default gradient, or null for custom colors or speed.</summary>
    protected string? DefaultsClass => UsesDefaults ? "rz-aurora-default" : null;

    /// <summary>
    /// Gets a value indicating whether the screen reader content copy should be rendered.
    /// </summary>
    protected bool ShouldRenderScreenReaderContent => !Decorative;

    /// <summary>
    /// Always null: an <c>aria-label</c> on a role-less span is prohibited ARIA, so <see cref="AriaLabel"/>
    /// is rendered as visually hidden text instead (Summit SF-035).
    /// </summary>
    protected string? ComputedAriaLabel => null;

    /// <summary>
    /// Gets the root aria-hidden attribute value.
    /// </summary>
    protected string? RootAriaHidden => Decorative ? "true" : null;

    /// <inheritdoc/>
    protected override string DefaultElement => "span";

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzAuroraText;

    private string BuildGradient()
    {
        var effectiveColors = GetEffectiveColors();
        return $"linear-gradient(135deg, {string.Join(", ", effectiveColors)}, {effectiveColors[0]})";
    }

    private string[] GetEffectiveColors()
    {
        var sanitizedColors = Colors?
            .Where(color => !string.IsNullOrWhiteSpace(color))
            .ToArray();

        return sanitizedColors is { Length: > 0 } ? sanitizedColors : DefaultColors;
    }

    private double GetAnimationDurationSeconds()
    {
        var normalizedSpeed = Speed <= 0d ? 1d : Speed;
        var duration = 10d / normalizedSpeed;
        return Math.Max(0.1d, duration);
    }

    /// <summary>
    /// Defines the slots available for styling in the RzAuroraText component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component root element.
        /// </summary>
        [Slot("aurora-text")]
        public string? Base { get; set; }

        /// <summary>
        /// The slot for the screen-reader-only content copy.
        /// </summary>
        [Slot("sr-text")]
        public string? SrText { get; set; }

        /// <summary>
        /// The slot for the visible animated text node.
        /// </summary>
        [Slot("text")]
        public string? Text { get; set; }
    }
}
