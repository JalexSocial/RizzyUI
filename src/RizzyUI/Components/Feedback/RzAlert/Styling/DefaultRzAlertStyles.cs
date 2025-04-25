
namespace RizzyUI;

/// <inheritdoc />
public class DefaultRzAlertStyles : RzStylesBase.RzAlertStylesBase
{
    /// <inheritdoc />
    public DefaultRzAlertStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "relative w-full overflow-hidden rounded-theme border";

    /// <inheritdoc />
    public override string InnerContainer => "flex w-full items-center gap-2 p-4";

    /// <inheritdoc />
    public override string IconContainer => "relative flex rounded-full p-1 text-2xl justify-center";

    /// <inheritdoc />
    public override string IconPulse =>
        "absolute animate-ping motion-reduce:animate-none size-6 aspect-square rounded-full";

    /// <inheritdoc />
    public override string ContentContainer => "ml-2 flex-grow"; // Added flex-grow

    /// <inheritdoc />
    public override string CloseButton => "ml-auto self-start p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary dark:focus-visible:ring-offset-surface-dark"; // Added focus styles

    /// <inheritdoc />
    public override string CloseButtonIcon => "shrink-0 h-4 w-4";

    /// <inheritdoc />
    public override string GetVariantCss(AlertVariant variant)
    {
        return variant switch
        {
            AlertVariant.Alternate => "border-outline bg-surface text-on-surface",
            AlertVariant.Information =>
                "border-info bg-surface text-on-surface",
            AlertVariant.Success =>
                "border-success bg-surface text-on-surface",
            AlertVariant.Warning =>
                "border-warning bg-surface text-on-surface",
            AlertVariant.Danger =>
                "border-danger bg-surface text-on-surface",
            _ => GetVariantCss(AlertVariant.Information) // Default
        };
    }

    /// <inheritdoc />
    public override string GetVariantBackgroundLightCss(AlertVariant variant)
    {
        return variant switch
        {
            AlertVariant.Alternate => "bg-surface-alt/10",
            AlertVariant.Information => "bg-info/10",
            AlertVariant.Success => "bg-success/10",
            AlertVariant.Warning => "bg-warning/10",
            AlertVariant.Danger => "bg-danger/10",
            _ => GetVariantBackgroundLightCss(AlertVariant.Information)
        };
    }

    /// <inheritdoc />
    public override string GetVariantBackgroundLighterCss(AlertVariant variant)
    {
        return variant switch
        {
            AlertVariant.Alternate => "bg-surface-alt/15",
            AlertVariant.Information => "bg-info/15",
            AlertVariant.Success => "bg-success/15",
            AlertVariant.Warning => "bg-warning/15",
            AlertVariant.Danger => "bg-danger/15",
            _ => GetVariantBackgroundLighterCss(AlertVariant.Information)
        };
    }

    /// <inheritdoc />
    public override string GetVariantIconColorCss(AlertVariant variant)
    {
        return variant switch
        {
            AlertVariant.Alternate => "text-on-surface",
            AlertVariant.Information => "text-info",
            AlertVariant.Success => "text-success",
            AlertVariant.Warning => "text-warning",
            AlertVariant.Danger => "text-danger",
            _ => GetVariantIconColorCss(AlertVariant.Information)
        };
    }
}

/// <inheritdoc />
public class DefaultRzAlertTitleStyles : RzStylesBase.RzAlertTitleStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzAlertTitleStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzAlertTitleStyles(RzTheme theme) : base(theme)
    {
    }

    /// <summary>
    ///     Gets the base CSS classes for the alert title element.
    /// </summary>
    public override string Title => "text-sm font-semibold pb-1";

    /// <summary>
    ///     Gets the CSS classes for the text color based on the alert variant.
    /// </summary>
    /// <param name="variant">The alert variant.</param>
    /// <returns>A string of CSS classes.</returns>
    public override string GetVariantTextColorCss(AlertVariant? variant)
    {
        return variant switch
        {
            AlertVariant.Alternate =>
                "text-on-surface-strong", // Example: maybe stronger for alternate
            AlertVariant.Information => "text-info",
            AlertVariant.Success => "text-success",
            AlertVariant.Warning => "text-warning",
            AlertVariant.Danger => "text-danger",
            _ => "text-info" // Default
        };
    }
}

/// <inheritdoc />
public class DefaultRzAlertDescriptionStyles : RzStylesBase.RzAlertDescriptionStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzAlertDescriptionStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzAlertDescriptionStyles(RzTheme theme) : base(theme)
    {
    }

    /// <summary>
    ///     Gets the base CSS classes for the alert description element.
    /// </summary>
    public override string Description => "text-xs font-medium sm:text-sm";
}