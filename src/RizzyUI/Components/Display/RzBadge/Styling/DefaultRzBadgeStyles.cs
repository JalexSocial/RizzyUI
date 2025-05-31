
namespace RizzyUI;

/// <summary>
///     Provides the default styles for the RzBadge component.
/// </summary>
public class DefaultRzBadgeStyles : RzStylesBase.RzBadgeStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzBadgeStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance to use for styling.</param>
    public DefaultRzBadgeStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Badge =>
        "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden"; // Matches kitchen sink base

    /// <inheritdoc />
    public override string InnerSpan => "flex items-center gap-1"; // Retained from original, seems fine

    /// <inheritdoc />
    public override string GetVariantCss(SemanticColor color)
    {
        // Mapping to kitchen sink badge styles
        return color switch
        {
            // Kitchen sink "Primary" badge
            SemanticColor.Primary => "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
            // Kitchen sink "Secondary" badge
            SemanticColor.Secondary => "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
            // Kitchen sink "Destructive" badge
            SemanticColor.Destructive => "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            // Kitchen sink "Outline" badge (maps to default/muted/foreground based colors)
            SemanticColor.Muted => "text-foreground border-border [a&]:hover:bg-accent [a&]:hover:text-accent-foreground", // Default outline
            SemanticColor.Foreground => "text-foreground border-border [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
            SemanticColor.Background => "text-foreground border-border [a&]:hover:bg-accent [a&]:hover:text-accent-foreground", // Assuming outline for surface/background
            // Specific status colors if needed, map to kitchen sink equivalents or a base outline
            SemanticColor.Info => "border-blue-500 text-blue-700 bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:bg-blue-900/30", // Example, if kitchen sink had specific info
            SemanticColor.Success => "border-green-500 text-green-700 bg-green-100 dark:border-green-700 dark:text-green-300 dark:bg-green-900/30",
            SemanticColor.Warning => "border-amber-500 text-amber-700 bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:bg-amber-900/30",
            SemanticColor.None => GetVariantCss(SemanticColor.Muted), // Default to outline
            _ => "text-foreground border-border [a&]:hover:bg-accent [a&]:hover:text-accent-foreground" // Fallback to outline
        };
    }

    /// <inheritdoc />
    public override string GetVariantSoftCss(SemanticColor color)
    {
        // Soft variants are not directly in the kitchen sink badge examples.
        // We can adapt the solid versions to be "soft" by using a lighter background (e.g., color/10) and matching text color.
        // This part might need more specific design decisions if kitchen sink had soft badges.
        // For now, let's make them similar to solid but with adjusted opacities or lighter bg.
        return color switch
        {
            SemanticColor.Primary => "border-primary/50 bg-primary/10 text-primary",
            SemanticColor.Secondary => "border-secondary/50 bg-secondary/10 text-secondary-foreground", // text-secondary-foreground for better contrast on light bg
            SemanticColor.Destructive => "border-destructive/50 bg-destructive/10 text-destructive",
            SemanticColor.Muted => "border-border bg-muted/50 text-muted-foreground",
            SemanticColor.Foreground => "border-border bg-accent/10 text-foreground",
            SemanticColor.Background => "border-border bg-accent/10 text-foreground",
            SemanticColor.Info => "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-300",
            SemanticColor.Success => "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-300",
            SemanticColor.Warning => "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300",
            SemanticColor.None => GetVariantSoftCss(SemanticColor.Muted),
            _ => "border-border bg-accent/10 text-foreground"
        };
    }
}