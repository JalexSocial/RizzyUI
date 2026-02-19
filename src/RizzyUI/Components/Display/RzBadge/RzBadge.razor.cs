
using Blazicons;
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
///     A badge component for displaying labels with various styles and colors, determined by the active
///     <see cref="RzTheme" />.
/// </summary>
public partial class RzBadge : RzComponent<RzBadge.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzBadge component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
        slots: new()
        {
            [s => s.InnerSpan] = "flex items-center gap-1"
        },
        variants: new()
        {
            [b => ((RzBadge)b).Variant] = new Variant<ThemeVariant, Slots>(), // Variants are handled by compound variants
            [b => ((RzBadge)b).Soft] = new Variant<bool, Slots>()
        },
        compoundVariants: new()
        {
            // --- Solid Variants ---
            new(b => !((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Default) { Class = "border-input bg-input text-foreground hover:bg-input/80" },
            new(b => !((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Primary) { Class = "border-transparent bg-primary text-primary-foreground hover:bg-primary/80" },
            new(b => !((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Secondary) { Class = "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80" },
            new(b => !((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Destructive) { Class = "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80" },
            new(b => !((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Accent) { Class = "border-transparent bg-accent text-accent-foreground hover:bg-accent/80" },
            new(b => !((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Information) { Class = "border-transparent bg-info text-info-foreground hover:bg-info/80" },
            new(b => !((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Success) { Class = "border-transparent bg-success text-success-foreground hover:bg-success/80" },
            new(b => !((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Warning) { Class = "border-transparent bg-warning text-warning-foreground hover:bg-warning/80" },
            new(b => !((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Inverse) { Class = "border-transparent bg-foreground text-background hover:bg-foreground/80" },
            new(b => ((RzBadge)b).Variant == ThemeVariant.Ghost) { Class = "border-transparent bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground" },

            // --- Soft Variants ---
            new(b => ((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Default) { Class = "border-input/50 bg-input/50 text-foreground hover:bg-input/80" },
            new(b => ((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Primary) { Class = "border-primary/20 bg-primary/10 text-primary hover:bg-primary/20" },
            new(b => ((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Secondary) { Class = "border-secondary/20 bg-secondary/10 text-secondary-foreground hover:bg-secondary/20" },
            new(b => ((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Destructive) { Class = "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20" },
            new(b => ((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Accent) { Class = "border-accent/20 bg-accent/10 text-accent-foreground hover:bg-accent/20" },
            new(b => ((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Information) { Class = "border-info/20 bg-info/10 text-info hover:bg-info/20" },
            new(b => ((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Success) { Class = "border-success/20 bg-success/10 text-success hover:bg-success/20" },
            new(b => ((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Warning) { Class = "border-warning/20 bg-warning/10 text-warning hover:bg-warning/20" },
            new(b => ((RzBadge)b).Soft && ((RzBadge)b).Variant == ThemeVariant.Inverse) { Class = "border-foreground/10 bg-foreground/10 text-foreground hover:bg-foreground/20" },
        }
    );

    /// <summary> 
    /// The theme variant of the badge. Defaults to <see cref="ThemeVariant.Default"/>. 
    /// </summary>
    [Parameter]
    public ThemeVariant Variant { get; set; } = ThemeVariant.Default;

    /// <summary> When set to true, applies a softer styling to the badge. </summary>
    [Parameter]
    public bool Soft { get; set; }

    /// <summary> Optional icon to display within the badge. </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <summary> Optional text label for the badge. Used if ChildContent is not provided. </summary>
    [Parameter]
    public string Label { get; set; } = string.Empty;

    /// <summary> Child content for the badge, allowing for text and additional elements. Overrides Label if set. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Initializes the component, setting the default element type if not specified.
    /// </summary>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "span"; // Default element for a badge
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzBadge;

    /// <summary>
    /// Defines the slots available for styling in the RzBadge component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("badge")]
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the inner span that wraps the content.
        /// </summary>
        [Slot("badge-inner-span")]
        public string? InnerSpan { get; set; }
    }
}
