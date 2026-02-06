
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A small visual indicator component, often used to denote status or notifications.
/// Its position, size, and color can be customized.
/// </summary>
public partial class RzIndicator : RzComponent<RzIndicator.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzIndicator component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "absolute rounded-full border-2 border-background",
        variants: new()
        {
            [i => ((RzIndicator)i).Position] = new Variant<IndicatorPosition, Slots>
            {
                [IndicatorPosition.TopStart] = "top-0 left-0",
                [IndicatorPosition.TopEnd] = "top-0 right-0",
                [IndicatorPosition.BottomStart] = "bottom-0 left-0",
                [IndicatorPosition.BottomEnd] = "bottom-0 right-0",
                [IndicatorPosition.Top] = "top-0 left-1/2 transform -translate-x-1/2",
                [IndicatorPosition.Bottom] = "bottom-0 left-1/2 transform -translate-x-1/2",
                [IndicatorPosition.Left] = "left-0 top-1/2 transform -translate-y-1/2",
                [IndicatorPosition.Right] = "right-0 top-1/2 transform -translate-y-1/2",
                [IndicatorPosition.Center] = "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                [IndicatorPosition.LeftStart] = "left-0 top-0",
                [IndicatorPosition.LeftEnd] = "left-0 bottom-0",
                [IndicatorPosition.RightStart] = "right-0 top-0",
                [IndicatorPosition.RightEnd] = "right-0 bottom-0"
            },
            [i => ((RzIndicator)i).Size] = new Variant<Size, Slots>
            {
                [Size.ExtraSmall] = "size-2",
                [Size.Small] = "size-2.5",
                [Size.Medium] = "size-3",
                [Size.Large] = "size-3.5",
                [Size.ExtraLarge] = "size-4"
            },
            [i => ((RzIndicator)i).Color] = new Variant<SemanticColor, Slots>
            {
                [SemanticColor.Primary] = "bg-primary",
                [SemanticColor.Secondary] = "bg-secondary",
                [SemanticColor.Success] = "bg-success",
                [SemanticColor.Warning] = "bg-warning",
                [SemanticColor.Destructive] = "bg-destructive",
                [SemanticColor.Info] = "bg-info",
                [SemanticColor.Muted] = "bg-muted",
                [SemanticColor.None] = "bg-foreground"
            }
        }
    );

    /// <summary>
    /// Gets or sets the position of the indicator.
    /// Defaults to <see cref="IndicatorPosition.TopEnd"/>.
    /// </summary>
    [Parameter] public IndicatorPosition Position { get; set; } = IndicatorPosition.TopEnd;

    /// <summary>
    /// Gets or sets the size of the indicator.
    /// Defaults to <see cref="Size.Medium"/>.
    /// </summary>
    [Parameter] public Size Size { get; set; } = Size.Medium;

    /// <summary>
    /// Gets or sets a value indicating whether the indicator is visible.
    /// Defaults to true.
    /// </summary>
    [Parameter] public bool Visible { get; set; } = true;

    /// <summary>
    /// Gets or sets the color of the indicator.
    /// </summary>
    [Parameter] public Color Color { get; set; } = Colors.Red.L500;

    /// <summary>
    /// Gets or sets the ARIA label for the indicator, providing an accessible name.
    /// If not set, a default localized label "Indicator" will be used.
    /// </summary>
    [Parameter] public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets the effective ARIA label, using the provided AriaLabel or a localized default.
    /// </summary>
    protected string EffectiveAriaLabel => AriaLabel ?? Localizer["RzIndicator.DefaultAriaLabel"];

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzIndicator.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzIndicator.DefaultAriaLabel"];
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzIndicator;

    /// <summary>
    /// Defines the slots available for styling in the RzIndicator component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("indicator")]
        public string? Base { get; set; }
    }
}