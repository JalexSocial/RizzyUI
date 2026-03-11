using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders a floating back-to-top control that appears after the page crosses a scroll threshold.
/// </summary>
public partial class RzBackToTop : RzAsChildComponent<RzBackToTop.Slots>
{
    /// <summary>
    /// Defines the default styling for <see cref="RzBackToTop"/>.
    /// </summary>
    public static readonly TvDescriptor<RzAsChildComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "fixed bottom-8 right-8 z-50 inline-flex items-center justify-center rounded-full shadow-md transition-all hover:shadow-lg focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        slots: new()
        {
            [s => s.Icon] = "shrink-0"
        },
        variants: new()
        {
            [c => ((RzBackToTop)c).Variant] = new Variant<ThemeVariant, Slots>
            {
                [ThemeVariant.Default] = "bg-primary text-primary-foreground hover:bg-primary/90",
                [ThemeVariant.Secondary] = "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                [ThemeVariant.Ghost] = "shadow-none hover:bg-accent hover:text-accent-foreground"
            },
            [c => ((RzBackToTop)c).Size] = new Variant<Size, Slots>
            {
                [Size.Small] = new() { [s => s.Base] = "h-8 w-8", [s => s.Icon] = "size-4" },
                [Size.Medium] = new() { [s => s.Base] = "h-10 w-10", [s => s.Icon] = "size-5" },
                [Size.Large] = new() { [s => s.Base] = "h-12 w-12", [s => s.Icon] = "size-6" }
            }
        },
        compoundVariants: new()
        {
            new(c => ((RzBackToTop)c).Outline) { Class = "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground" }
        }
    );

    /// <summary>
    /// Gets or sets the scroll threshold, in pixels, before the control becomes visible.
    /// </summary>
    [Parameter]
    public int Threshold { get; set; } = 300;

    /// <summary>
    /// Gets or sets the visual theme variant.
    /// </summary>
    [Parameter]
    public ThemeVariant Variant { get; set; } = ThemeVariant.Default;

    /// <summary>
    /// Gets or sets the size of the floating control.
    /// </summary>
    [Parameter]
    public Size Size { get; set; } = Size.Medium;

    /// <summary>
    /// Gets or sets whether outline styling should be applied.
    /// </summary>
    [Parameter]
    public bool Outline { get; set; }

    /// <summary>
    /// Gets or sets the accessible label announced for the control.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets or sets optional child content used as the rendered host or inner content.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    private bool IsButtonElement => string.Equals(EffectiveElement, "button", StringComparison.OrdinalIgnoreCase);

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "button";

        AriaLabel ??= Localizer["RzBackToTop.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzBackToTop.DefaultAriaLabel"];
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(
            AdditionalAttributes?.ToDictionary(kvp => kvp.Key, kvp => (object?)kvp.Value) ?? new Dictionary<string, object?>(),
            StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = SlotClasses.GetBase(),
            ["data-slot"] = SlotNames.NameOf(SlotTypes.Base),
            ["data-alpine-root"] = Id,
            ["x-data"] = "rzBackToTop",
            ["x-load"] = LoadStrategyOrNull,
            ["data-threshold"] = Threshold,
            ["x-cloak"] = string.Empty,
            ["x-show"] = "visible",
            ["x-transition:enter"] = "transition ease-out duration-300",
            ["x-transition:enter-start"] = "opacity-0 translate-y-2",
            ["x-transition:enter-end"] = "opacity-100 translate-y-0",
            ["x-transition:leave"] = "transition ease-in duration-200",
            ["x-transition:leave-start"] = "opacity-100 translate-y-0",
            ["x-transition:leave-end"] = "opacity-0 translate-y-2",
            ["x-on:click.prevent"] = "scrollToTop",
            ["aria-label"] = AriaLabel,
            ["type"] = IsButtonElement ? "button" : null,
            ["role"] = IsButtonElement ? null : "button",
            ["tabindex"] = IsButtonElement ? null : 0
        };

        return attributes;
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzAsChildComponent<Slots>, Slots> GetDescriptor() => Theme.RzBackToTop;

    /// <summary>
    /// Defines the slots available for styling in the <see cref="RzBackToTop"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the root element.
        /// </summary>
        [Slot("back-to-top")]
        public string? Base { get; set; }

        /// <summary>
        /// Gets or sets classes for the icon element.
        /// </summary>
        [Slot("icon")]
        public string? Icon { get; set; }
    }
}