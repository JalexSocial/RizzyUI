
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
        @base: "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
        slots: new()
        {
            [s => s.InnerSpan] = "flex items-center gap-1"
        },
        variants: new()
        {
            [b => ((RzBadge)b).Color] = new Variant<SemanticColor, Slots>(), // Variants are handled by compound variants
            [b => ((RzBadge)b).Soft] = new Variant<bool, Slots>()
        },
        compoundVariants: new()
        {
            // Solid Variants
            new(b => !((RzBadge)b).Soft && ((RzBadge)b).Color == SemanticColor.Primary) { Class = "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90" },
            new(b => !((RzBadge)b).Soft && ((RzBadge)b).Color == SemanticColor.Secondary) { Class = "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90" },
            new(b => !((RzBadge)b).Soft && ((RzBadge)b).Color == SemanticColor.Destructive) { Class = "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60" },
            new(b => !((RzBadge)b).Soft && (((RzBadge)b).Color == SemanticColor.Muted || ((RzBadge)b).Color == SemanticColor.Foreground || ((RzBadge)b).Color == SemanticColor.Background || ((RzBadge)b).Color == SemanticColor.None)) { Class = "text-foreground border-border [a&]:hover:bg-accent [a&]:hover:text-accent-foreground" },
            new(b => !((RzBadge)b).Soft && ((RzBadge)b).Color == SemanticColor.Info) { Class = "border-blue-500 text-blue-700 bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:bg-blue-900/30" },
            new(b => !((RzBadge)b).Soft && ((RzBadge)b).Color == SemanticColor.Success) { Class = "border-green-500 text-green-700 bg-green-100 dark:border-green-700 dark:text-green-300 dark:bg-green-900/30" },
            new(b => !((RzBadge)b).Soft && ((RzBadge)b).Color == SemanticColor.Warning) { Class = "border-amber-500 text-amber-700 bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:bg-amber-900/30" },

            // Soft Variants
            new(b => ((RzBadge)b).Soft && ((RzBadge)b).Color == SemanticColor.Primary) { Class = "border-primary/50 bg-primary/10 text-primary" },
            new(b => ((RzBadge)b).Soft && ((RzBadge)b).Color == SemanticColor.Secondary) { Class = "border-secondary/50 bg-secondary/10 text-secondary-foreground" },
            new(b => ((RzBadge)b).Soft && ((RzBadge)b).Color == SemanticColor.Destructive) { Class = "border-destructive/50 bg-destructive/10 text-destructive" },
            new(b => ((RzBadge)b).Soft && (((RzBadge)b).Color == SemanticColor.Muted || ((RzBadge)b).Color == SemanticColor.None)) { Class = "border-border bg-muted/50 text-muted-foreground" },
            new(b => ((RzBadge)b).Soft && (((RzBadge)b).Color == SemanticColor.Foreground || ((RzBadge)b).Color == SemanticColor.Background)) { Class = "border-border bg-accent/10 text-foreground" },
            new(b => ((RzBadge)b).Soft && ((RzBadge)b).Color == SemanticColor.Info) { Class = "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-300" },
            new(b => ((RzBadge)b).Soft && ((RzBadge)b).Color == SemanticColor.Success) { Class = "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300" },
            new(b => ((RzBadge)b).Soft && ((RzBadge)b).Color == SemanticColor.Warning) { Class = "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300" }
        }
    );

    /// <summary> The semantic color of the badge. Defaults to Muted. </summary>
    [Parameter]
    public SemanticColor Color { get; set; } = SemanticColor.Muted;

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
        public string? Base { get; set; }
        public string? InnerSpan { get; set; }
    }
}