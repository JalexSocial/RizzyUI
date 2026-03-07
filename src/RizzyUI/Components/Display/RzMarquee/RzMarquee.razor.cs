using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A CSS-first, SSR-safe marquee container that repeats arbitrary child content for infinite scrolling effects.
/// </summary>
public partial class RzMarquee : RzComponent<RzMarquee.Slots>
{
    private const int MinimumRepeatCount = 2;
    private const int DefaultRepeatCount = 4;
    private const string DefaultDuration = "40s";
    private const string DefaultGap = "1rem";

    private IReadOnlyDictionary<string, object?>? RootAttributes { get; set; }

    private string RootStyle { get; set; } = $"--rz-marquee-duration:{DefaultDuration};--rz-marquee-gap:{DefaultGap};";

    private int EffectiveRepeat => ChildContent is null ? 0 : Math.Max(MinimumRepeatCount, Repeat);

    private string OrientationData => Orientation.ToString().ToKebabCase();

    /// <summary>
    /// Defines the default styling for the <see cref="RzMarquee"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "group relative flex overflow-hidden p-2 [gap:var(--rz-marquee-gap)]",
        slots: new()
        {
            [s => s.Segment] = "flex shrink-0 justify-around [gap:var(--rz-marquee-gap)] motion-reduce:[animation-play-state:paused]"
        },
        variants: new()
        {
            [c => ((RzMarquee)c).Orientation] = new Variant<MarqueeOrientation, Slots>
            {
                [MarqueeOrientation.Horizontal] = new()
                {
                    [s => s.Base] = "flex-row",
                    [s => s.Segment] = "flex-row animate-marquee"
                },
                [MarqueeOrientation.Vertical] = new()
                {
                    [s => s.Base] = "flex-col",
                    [s => s.Segment] = "flex-col animate-marquee-vertical"
                }
            },
            [c => ((RzMarquee)c).Reverse] = new Variant<bool, Slots>
            {
                [true] = new() { [s => s.Segment] = "[animation-direction:reverse]" }
            },
            [c => ((RzMarquee)c).PauseOnHover] = new Variant<bool, Slots>
            {
                [true] = new() { [s => s.Segment] = "group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]" }
            }
        }
    );

    /// <summary>
    /// Gets or sets content rendered for each marquee segment.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the marquee flow orientation.
    /// </summary>
    [Parameter] public MarqueeOrientation Orientation { get; set; } = MarqueeOrientation.Horizontal;

    /// <summary>
    /// Gets or sets a value indicating whether the marquee animation runs in reverse.
    /// </summary>
    [Parameter] public bool Reverse { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether animation pauses on hover and focus-within.
    /// </summary>
    [Parameter] public bool PauseOnHover { get; set; }

    /// <summary>
    /// Gets or sets the number of repeated segments rendered for seamless scrolling.
    /// </summary>
    [Parameter] public int Repeat { get; set; } = DefaultRepeatCount;

    /// <summary>
    /// Gets or sets the animation duration CSS value.
    /// </summary>
    [Parameter] public string Duration { get; set; } = DefaultDuration;

    /// <summary>
    /// Gets or sets the gap CSS value between repeated items.
    /// </summary>
    [Parameter] public string Gap { get; set; } = DefaultGap;

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        BuildRootAttributesAndStyle();
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzMarquee;

    private void BuildRootAttributesAndStyle()
    {
        var duration = string.IsNullOrWhiteSpace(Duration) ? DefaultDuration : Duration;
        var gap = string.IsNullOrWhiteSpace(Gap) ? DefaultGap : Gap;

        string? userStyle = null;
        var rootAttributes = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);

        if (AdditionalAttributes is not null)
        {
            foreach (var attribute in AdditionalAttributes)
            {
                if (string.Equals(attribute.Key, "style", StringComparison.OrdinalIgnoreCase))
                {
                    userStyle = attribute.Value?.ToString();
                    continue;
                }

                if (string.Equals(attribute.Key, "class", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                rootAttributes[attribute.Key] = attribute.Value;
            }
        }

        RootAttributes = rootAttributes;

        RootStyle = $"--rz-marquee-duration:{duration};--rz-marquee-gap:{gap};";

        if (!string.IsNullOrWhiteSpace(userStyle))
            RootStyle = $"{RootStyle}{userStyle}";
    }

    /// <summary>
    /// Defines the slots available for styling in <see cref="RzMarquee"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the root element.
        /// </summary>
        [Slot("marquee")]
        public string? Base { get; set; }

        /// <summary>
        /// Gets or sets classes for each repeated content segment.
        /// </summary>
        [Slot("segment")]
        public string? Segment { get; set; }
    }
}
