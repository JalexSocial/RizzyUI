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
        "w-fit inline-flex overflow-hidden rounded-borderRadius-2xl border text-xs font-medium"; // Use theme token

    /// <inheritdoc />
    public override string InnerSpan => "flex items-center gap-1 px-2 py-1";

    /// <inheritdoc />
    public override string GetVariantCss(SemanticColor color)
    {
        return color switch
        {
            SemanticColor.Surface => $"border-outline bg-surface text-on-surface",
            SemanticColor.SurfaceAlt => "border-on-surface bg-surface-alt text-on-surface", // Corrected border
            SemanticColor.Primary => "border-primary bg-primary text-on-primary",
            SemanticColor.Secondary => "border-secondary bg-secondary text-on-secondary",
            SemanticColor.Info =>
                $"border-info bg-info text-on-info dark:border-info dark:bg-info dark:text-on-info",
            SemanticColor.Success =>
                $"border-success bg-success text-on-success dark:border-success dark:bg-success dark:text-on-success",
            SemanticColor.Warning =>
                $"border-warning bg-warning text-on-warning dark:border-warning dark:bg-warning dark:text-on-warning",
            SemanticColor.Danger =>
                $"border-danger bg-danger text-on-danger dark:border-danger dark:bg-danger dark:text-on-danger",
            SemanticColor.Outline => "border-outline bg-transparent text-outline",
            SemanticColor.OnSurface => GetVariantCss(SemanticColor.Surface), // Map On variants to base
            SemanticColor.OnSurfaceStrong => GetVariantCss(SemanticColor.Surface),
            SemanticColor.OnPrimary => GetVariantCss(SemanticColor.Primary),
            SemanticColor.OnSecondary => GetVariantCss(SemanticColor.Secondary),
            SemanticColor.OnInfo => GetVariantCss(SemanticColor.Info),
            SemanticColor.OnSuccess => GetVariantCss(SemanticColor.Success),
            SemanticColor.OnWarning => GetVariantCss(SemanticColor.Warning),
            SemanticColor.OnDanger => GetVariantCss(SemanticColor.Danger),
            SemanticColor.OutlineStrong => GetVariantCss(SemanticColor.Outline),
            SemanticColor.None => "",
            _ => GetVariantCss(SemanticColor.SurfaceAlt) // Default
        };
    }

    /// <inheritdoc />
    public override string GetVariantSoftCss(SemanticColor color)
    {
        return color switch
        {
            SemanticColor.Surface => $"border-outline bg-surface text-on-surface",
            SemanticColor.SurfaceAlt => "border-on-surface bg-surface-alt text-on-surface",
            SemanticColor.Primary => "border-primary bg-primary/10 text-primary",
            SemanticColor.Secondary => "border-secondary bg-secondary/10 text-secondary",
            SemanticColor.Info =>
                $"border-info bg-info/10 dark:bg-info/10 text-info dark:border-info dark:text-on-info",
            SemanticColor.Success =>
                $"border-success bg-success/10 dark:bg-success/10 text-success dark:border-success dark:text-on-success",
            SemanticColor.Warning =>
                $"border-warning bg-warning/10 dark:bg-warning/10 text-warning dark:border-warning dark:text-on-warning",
            SemanticColor.Danger =>
                $"border-danger bg-danger/10 dark:bg-danger/10 text-danger dark:border-danger dark:text-on-danger",
            SemanticColor.Outline => "border-outline bg-outline/10 text-on-surface",
            SemanticColor.OnSurface => GetVariantSoftCss(SemanticColor.Surface),
            SemanticColor.OnSurfaceStrong => GetVariantSoftCss(SemanticColor.Surface),
            SemanticColor.OnPrimary => GetVariantSoftCss(SemanticColor.Primary),
            SemanticColor.OnSecondary => GetVariantSoftCss(SemanticColor.Secondary),
            SemanticColor.OnInfo => GetVariantSoftCss(SemanticColor.Info),
            SemanticColor.OnSuccess => GetVariantSoftCss(SemanticColor.Success),
            SemanticColor.OnWarning => GetVariantSoftCss(SemanticColor.Warning),
            SemanticColor.OnDanger => GetVariantSoftCss(SemanticColor.Danger),
            SemanticColor.OutlineStrong => GetVariantSoftCss(SemanticColor.Outline),
            SemanticColor.None => "",
            _ => GetVariantSoftCss(SemanticColor.SurfaceAlt) // Default
        };
    }
}