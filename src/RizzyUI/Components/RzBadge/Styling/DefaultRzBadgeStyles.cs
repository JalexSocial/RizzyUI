namespace RizzyUI.Components.RzBadge.Styling;

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
            SemanticColor.Surface => $"border-outline bg-{Theme.Light.Surface.TailwindClassName} text-on-surface",
            SemanticColor.SurfaceAlt => "border-on-surface bg-surface-alt text-on-surface", // Corrected border
            SemanticColor.Primary => "border-primary bg-primary text-on-primary",
            SemanticColor.Secondary => "border-secondary bg-secondary text-on-secondary",
            SemanticColor.Info =>
                $"border-{Theme.Info.TailwindClassName} bg-{Theme.Info.TailwindClassName} text-{Theme.OnInfo.TailwindClassName} dark:border-{Theme.Info.TailwindClassName} dark:bg-{Theme.Info.TailwindClassName} dark:text-{Theme.OnInfo.TailwindClassName}",
            SemanticColor.Success =>
                $"border-{Theme.Success.TailwindClassName} bg-{Theme.Success.TailwindClassName} text-{Theme.OnSuccess.TailwindClassName} dark:border-{Theme.Success.TailwindClassName} dark:bg-{Theme.Success.TailwindClassName} dark:text-{Theme.OnSuccess.TailwindClassName}",
            SemanticColor.Warning =>
                $"border-{Theme.Warning.TailwindClassName} bg-{Theme.Warning.TailwindClassName} text-{Theme.OnWarning.TailwindClassName} dark:border-{Theme.Warning.TailwindClassName} dark:bg-{Theme.Warning.TailwindClassName} dark:text-{Theme.OnWarning.TailwindClassName}",
            SemanticColor.Danger =>
                $"border-{Theme.Danger.TailwindClassName} bg-{Theme.Danger.TailwindClassName} text-{Theme.OnDanger.TailwindClassName} dark:border-{Theme.Danger.TailwindClassName} dark:bg-{Theme.Danger.TailwindClassName} dark:text-{Theme.OnDanger.TailwindClassName}",
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
            SemanticColor.Surface => $"border-outline bg-{Theme.Light.Surface.TailwindClassName} text-on-surface",
            SemanticColor.SurfaceAlt => "border-on-surface bg-surface-alt text-on-surface",
            SemanticColor.Primary => "border-primary bg-primary/10 text-primary",
            SemanticColor.Secondary => "border-secondary bg-secondary/10 text-secondary",
            SemanticColor.Info =>
                $"border-{Theme.Info.TailwindClassName} bg-{Theme.Info.TailwindClassName}/10 dark:bg-{Theme.Info.TailwindClassName}/10 text-{Theme.Info.TailwindClassName} dark:border-{Theme.Info.TailwindClassName} dark:text-{Theme.OnInfo.TailwindClassName}",
            SemanticColor.Success =>
                $"border-{Theme.Success.TailwindClassName} bg-{Theme.Success.TailwindClassName}/10 dark:bg-{Theme.Success.TailwindClassName}/10 text-{Theme.Success.TailwindClassName} dark:border-{Theme.Success.TailwindClassName} dark:text-{Theme.OnSuccess.TailwindClassName}",
            SemanticColor.Warning =>
                $"border-{Theme.Warning.TailwindClassName} bg-{Theme.Warning.TailwindClassName}/10 dark:bg-{Theme.Warning.TailwindClassName}/10 text-{Theme.Warning.TailwindClassName} dark:border-{Theme.Warning.TailwindClassName} dark:text-{Theme.OnWarning.TailwindClassName}",
            SemanticColor.Danger =>
                $"border-{Theme.Danger.TailwindClassName} bg-{Theme.Danger.TailwindClassName}/10 dark:bg-{Theme.Danger.TailwindClassName}/10 text-{Theme.Danger.TailwindClassName} dark:border-{Theme.Danger.TailwindClassName} dark:text-{Theme.OnDanger.TailwindClassName}",
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