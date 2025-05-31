
namespace RizzyUI;

/// <inheritdoc />
public class DefaultRzAlertStyles : RzStylesBase.RzAlertStylesBase
{
    /// <inheritdoc />
    public DefaultRzAlertStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "relative w-full overflow-hidden"; // Base container for the alert

    /// <inheritdoc />
    public override string InnerContainer => "flex w-full items-start gap-x-3 p-4"; // Matches kitchen sink grid structure implicitly

    /// <inheritdoc />
    public override string IconContainer => "relative flex size-4 shrink-0 translate-y-0.5"; // Matches kitchen sink icon styling

    /// <inheritdoc />
    public override string IconPulse =>
        "absolute animate-ping motion-reduce:animate-none size-full rounded-full"; // Pulse effect for the icon

    /// <inheritdoc />
    public override string ContentContainer => "grid flex-1 gap-y-0.5"; // For title and description stacking

    /// <inheritdoc />
    public override string CloseButton => "ml-auto self-start p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring dark:focus-visible:ring-offset-background opacity-70 hover:opacity-100 transition-opacity"; // Matches kitchen sink close button

    /// <inheritdoc />
    public override string CloseButtonIcon => "shrink-0 size-4"; // Matches kitchen sink close icon

    /// <inheritdoc />
    public override string GetVariantCss(AlertVariant variant)
    {
        // Base styles for all alerts from kitchen sink
        var baseAlertStyle = "relative w-full rounded-lg border px-4 py-3 text-sm bg-card text-card-foreground";
        // Grid structure is applied if an icon is present, handled by has-[>svg] in kitchen sink.
        // RizzyUI's RzAlert.razor always renders an icon container, so we can assume the grid structure.
        var gridStructure = "grid has-[>svg]:grid-cols-[calc(var(--spacing,1rem)*1)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3"; // Assuming var(--spacing) is 1rem or similar for icon size

        return variant switch
        {
            // Kitchen sink destructive alert uses text-destructive and current (destructive) icon color
            AlertVariant.Destructive => $"{baseAlertStyle} {gridStructure} text-destructive border-destructive", // Added border-destructive for consistency
            // Other variants in kitchen sink use default text/border or custom (like amber)
            // For simplicity, we'll map them to a base style and allow overrides for specific colors like amber
            AlertVariant.Warning => $"{baseAlertStyle} {gridStructure} border-amber-500 bg-amber-50 text-amber-900 dark:border-amber-950 dark:bg-amber-950 dark:text-amber-100", // Example for a warning/amber
            _ => $"{baseAlertStyle} {gridStructure}" // Default for Info, Success, Alternate
        };
    }

    /// <inheritdoc />
    public override string GetVariantBackgroundLightCss(AlertVariant variant)
    {
        // This was for a lighter background for the icon container, kitchen sink doesn't do this explicitly
        // For pulse, it might use a variant of the icon color.
        return variant switch
        {
            AlertVariant.Destructive => "bg-destructive/15", // For pulse
            AlertVariant.Warning => "bg-amber-500/15", // For pulse on warning
            _ => "bg-accent/15" // Generic accent for pulse on other variants
        };
    }

    /// <inheritdoc />
    public override string GetVariantBackgroundLighterCss(AlertVariant variant)
    {
        // Similar to above, less direct mapping.
        return variant switch
        {
            AlertVariant.Destructive => "bg-destructive/20",
            AlertVariant.Warning => "bg-amber-500/20",
            _ => "bg-accent/20"
        };
    }

    /// <inheritdoc />
    public override string GetVariantIconColorCss(AlertVariant variant)
    {
        // In kitchen sink, destructive icon takes destructive color, others take current text color.
        return variant switch
        {
            AlertVariant.Destructive => "text-destructive",
            AlertVariant.Warning => "text-amber-900 dark:text-amber-100", // For amber alert icon
            _ => "text-current" // Inherits from the main alert text color (e.g., card-foreground)
        };
    }
}

/// <inheritdoc />
public class DefaultAlertTitleStyles : RzStylesBase.AlertTitleStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultAlertTitleStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultAlertTitleStyles(RzTheme theme) : base(theme)
    {
    }

    /// <summary>
    ///     Gets the base CSS classes for the alert title element.
    /// </summary>
    public override string Title => "col-start-2 min-h-4 font-medium tracking-tight line-clamp-1"; // Matches kitchen sink h2 inside alert

    /// <summary>
    ///     Gets the CSS classes for the text color based on the alert variant.
    /// </summary>
    /// <param name="variant">The alert variant type (can be null if context is unavailable).</param>
    /// <returns>A string of CSS classes.</returns>
    public override string GetVariantTextColorCss(AlertVariant? variant)
    {
        // Title color generally matches the alert's main text color in kitchen sink.
        return variant switch
        {
            AlertVariant.Destructive => "", // text-destructive is on the parent
            AlertVariant.Warning => "",     // text-amber-900 is on the parent
            _ => "" // text-card-foreground is on the parent
        };
    }
}

/// <inheritdoc />
public class DefaultAlertDescriptionStyles : RzStylesBase.AlertDescriptionStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultAlertDescriptionStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultAlertDescriptionStyles(RzTheme theme) : base(theme)
    {
    }

    /// <summary>
    ///     Gets the base CSS classes for the alert description element.
    /// </summary>
    public override string Description => "col-start-2 text-sm text-muted-foreground grid justify-items-start gap-1 [&_p]:leading-relaxed [&_ul]:list-inside [&_ul]:list-disc"; // Matches kitchen sink section inside alert
}