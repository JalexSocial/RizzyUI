namespace RizzyUI;

/// <inheritdoc />
public class DefaultRzAlertStyles : RzStylesBase.RzAlertStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzAlertStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzAlertStyles(RzTheme theme) : base(theme) { }

    /* ---------- layout -------------------------------------------------- */

    /// <inheritdoc />
    public override string Container =>
        "not-prose relative w-full overflow-hidden";

    /// <inheritdoc />
    public override string InnerContainer =>
        "flex w-full items-start gap-x-3 px-4 py-3";

    /// <inheritdoc />
    public override string IconContainer =>
        "relative flex size-6 shrink-0 text-2xl translate-y-0.5";

    /// <inheritdoc />
    public override string IconPulse =>
        "absolute animate-ping motion-reduce:animate-none size-6 aspect-square rounded-full";

    /// <inheritdoc />
    public override string ContentContainer =>
        "flex flex-col flex-1 gap-y-0.5";

    /// <inheritdoc />
    public override string CloseButton =>
        "ml-auto self-start p-1 rounded-full opacity-70 hover:opacity-100 " +
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
        "focus-visible:ring-ring dark:focus-visible:ring-offset-background " +
        "transition-opacity text-foreground";

    /// <inheritdoc />
    public override string CloseButtonIcon => "size-4 shrink-0";

    /* ---------- variant helpers ---------------------------------------- */

    private const string BaseAlert =
        "relative w-full rounded-lg border text-sm bg-card text-card-foreground";

    /// <inheritdoc />
    public override string GetVariantCss(AlertVariant v) =>
        v switch
        {
            AlertVariant.Alternate   => $"{BaseAlert} border-outline",

            AlertVariant.Information => $"{BaseAlert} border-info " +
                                        "bg-info/10 text-info-foreground " +
                                        "dark:bg-info/15",

            AlertVariant.Success     => $"{BaseAlert} border-success " +
                                        "bg-success/10 text-success-foreground " +
                                        "dark:bg-success/15",

            AlertVariant.Warning     => $"{BaseAlert} border-warning " +
                                        "bg-warning/10 text-warning-foreground " +
                                        "dark:bg-warning/15",

            AlertVariant.Destructive => $"{BaseAlert} border-destructive " +
                                        "bg-destructive/10 text-destructive " +
                                        "dark:bg-destructive/15",

            _                        => BaseAlert
        };

    /// <inheritdoc />
    public override string GetVariantBackgroundLightCss(AlertVariant v) =>
        v switch
        {
            AlertVariant.Information => "bg-info/10",
            AlertVariant.Success     => "bg-success/10",
            AlertVariant.Warning     => "bg-warning/10",
            AlertVariant.Destructive => "bg-destructive/10",
            _                        => "bg-muted/10"
        };

    /// <inheritdoc />
    public override string GetVariantBackgroundLighterCss(AlertVariant v) =>
        v switch
        {
            AlertVariant.Information => "bg-info/15",
            AlertVariant.Success     => "bg-success/15",
            AlertVariant.Warning     => "bg-warning/15",
            AlertVariant.Destructive => "bg-destructive/15",
            _                        => "bg-muted/15"
        };

    /// <inheritdoc />
    public override string GetVariantIconColorCss(AlertVariant v) =>
        v switch
        {
            AlertVariant.Information => "text-info",
            AlertVariant.Success     => "text-success",
            AlertVariant.Warning     => "text-warning",
            AlertVariant.Destructive => "text-destructive",
            _                        => "text-current"
        };
}

/// <inheritdoc />
public class DefaultAlertTitleStyles : RzStylesBase.AlertTitleStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultAlertTitleStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultAlertTitleStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc />
    public override string Title =>
        "font-medium tracking-tight line-clamp-1";

    /// <inheritdoc />
    public override string GetVariantTextColorCss(AlertVariant? variant) =>
        variant switch
        {
            AlertVariant.Destructive => "text-destructive",
            AlertVariant.Warning     => "text-warning",
            AlertVariant.Information => "text-info",
            AlertVariant.Success     => "text-success",
            // Alternate / default variants inherit the parent’s colour
            _                         => string.Empty
        };
}

/// <inheritdoc />
public class DefaultAlertDescriptionStyles : RzStylesBase.AlertDescriptionStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultAlertDescriptionStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultAlertDescriptionStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc />
    public override string Description =>
        "text-sm text-foreground [&_p]:leading-relaxed [&_ul]:list-inside [&_ul]:list-disc";
}

