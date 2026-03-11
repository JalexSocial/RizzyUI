using System.Globalization;
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders inline text with an animated gradient fill effect.
/// </summary>
public partial class RzAnimatedGradientText : RzComponent<RzAnimatedGradientText.Slots>
{
    private const decimal MinSpeed = 0.1m;
    private const string DefaultColorFrom = "#ffaa40";
    private const string DefaultColorTo = "#9c40ff";

    /// <summary>
    /// Defines the default styling for the <see cref="RzAnimatedGradientText"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline bg-linear-to-r from-(--color-from) via-(--color-to) to-(--color-from) bg-size-[var(--bg-size)_100%] bg-clip-text text-transparent",
        variants: new()
        {
            [c => ((RzAnimatedGradientText)c).Animate] = new Variant<bool, Slots>
            {
                [true] = "animate-gradient"
            }
        }
    );

    /// <summary>
    /// Gets or sets the content rendered within the animated text wrapper.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the gradient animation speed multiplier.
    /// </summary>
    [Parameter]
    public decimal Speed { get; set; } = 1m;

    /// <summary>
    /// Gets or sets the starting and ending gradient color.
    /// </summary>
    [Parameter]
    public string ColorFrom { get; set; } = DefaultColorFrom;

    /// <summary>
    /// Gets or sets the middle gradient color.
    /// </summary>
    [Parameter]
    public string ColorTo { get; set; } = DefaultColorTo;

    /// <summary>
    /// Gets or sets a value indicating whether the gradient animation is enabled.
    /// </summary>
    [Parameter]
    public bool Animate { get; set; } = true;

    /// <summary>
    /// Gets the CSS custom properties that drive the gradient effect.
    /// </summary>
    protected string StyleVariables =>
        $"--bg-size: {(Speed * 300m).ToString("0.###", CultureInfo.InvariantCulture)}%; --color-from: {ColorFrom}; --color-to: {ColorTo};";

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "span";
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        if (Speed <= 0)
            Speed = MinSpeed;

        if (string.IsNullOrWhiteSpace(ColorFrom))
            ColorFrom = DefaultColorFrom;

        if (string.IsNullOrWhiteSpace(ColorTo))
            ColorTo = DefaultColorTo;
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzAnimatedGradientText;

    /// <summary>
    /// Defines the slots available for styling in the <see cref="RzAnimatedGradientText"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component root element.
        /// </summary>
        [Slot("animated-gradient-text")]
        public string? Base { get; set; }
    }
}
