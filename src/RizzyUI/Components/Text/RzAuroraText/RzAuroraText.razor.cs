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
    /// Gets the inline style used by the visual aurora text node.
    /// </summary>
    protected string TextStyle =>
        $"background-image: {BuildGradient()}; animation-duration: {GetAnimationDurationSeconds().ToString("0.###", CultureInfo.InvariantCulture)}s; -webkit-background-clip: text; -webkit-text-fill-color: transparent;";

    /// <summary>
    /// Gets a value indicating whether the screen reader content copy should be rendered.
    /// </summary>
    protected bool ShouldRenderScreenReaderContent => !Decorative && string.IsNullOrWhiteSpace(AriaLabel);

    /// <summary>
    /// Gets the computed aria-label attribute value for the root element.
    /// </summary>
    protected string? ComputedAriaLabel => Decorative ? null : AriaLabel;

    /// <summary>
    /// Gets the root aria-hidden attribute value.
    /// </summary>
    protected string? RootAriaHidden => Decorative ? "true" : null;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "span";
    }

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
