namespace RizzyUI.Components.Feedback.RzAlert.Styling;

/// <inheritdoc />
public class DefaultRzAlertStyles : RzStylesBase.RzAlertStylesBase
{
    /// <inheritdoc />
    public DefaultRzAlertStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "relative w-full overflow-hidden rounded-borderRadius border";
    
    /// <inheritdoc />
    public override string InnerContainer => "flex w-full items-center gap-2 p-4";
    
    /// <inheritdoc />
    public override string IconContainer => "relative flex rounded-full p-1 text-2xl justify-center";

    /// <inheritdoc />
    public override string IconPulse =>
        "absolute animate-ping motion-reduce:animate-none size-6 aspect-square rounded-full";

    /// <inheritdoc />
    public override string ContentContainer => "ml-2";
    
    /// <inheritdoc />
    public override string CloseButton => "ml-auto";
    
    /// <inheritdoc />
    public override string CloseButtonIcon => "shrink-0 h-4 w-4";

    /// <inheritdoc />
    public override string GetVariantCss(AlertVariant variant)
    {
        return variant switch
        {
            AlertVariant.Alternate => $"border-outline bg-surface text-on-surface",
            AlertVariant.Information =>
                $"border-info bg-surface text-on-surface",
            AlertVariant.Success =>
                $"border-success bg-surface text-on-surface",
            AlertVariant.Warning =>
                $"border-warning bg-surface text-on-surface",
            AlertVariant.Danger =>
                $"border-danger bg-surface text-on-surface",
            _ => GetVariantCss(AlertVariant.Information) // Default
        };
    }

    /// <inheritdoc />
    public override string GetVariantBackgroundLightCss(AlertVariant variant)
    {
        return variant switch
        {
            AlertVariant.Alternate => "bg-surface-alt/10",
            AlertVariant.Information => $"bg-info/10",
            AlertVariant.Success => $"bg-success/10",
            AlertVariant.Warning => $"bg-warning/10",
            AlertVariant.Danger => $"bg-danger/10",
            _ => GetVariantBackgroundLightCss(AlertVariant.Information)
        };
    }

    /// <inheritdoc />
    public override string GetVariantBackgroundLighterCss(AlertVariant variant)
    {
        return variant switch
        {
            AlertVariant.Alternate => "bg-surface-alt/15",
            AlertVariant.Information => $"bg-info/15",
            AlertVariant.Success => $"bg-success/15",
            AlertVariant.Warning => $"bg-warning/15",
            AlertVariant.Danger => $"bg-danger/15",
            _ => GetVariantBackgroundLighterCss(AlertVariant.Information)
        };
    }

    /// <inheritdoc />
    public override string GetVariantIconColorCss(AlertVariant variant)
    {
        return variant switch
        {
            AlertVariant.Alternate => "text-on-surface",
            AlertVariant.Information => $"text-info",
            AlertVariant.Success => $"text-success",
            AlertVariant.Warning => $"text-warning",
            AlertVariant.Danger => $"text-danger",
            _ => GetVariantIconColorCss(AlertVariant.Information)
        };
    }
}

/// <inheritdoc />
public class DefaultRzAlertTitleStyles : RzStylesBase.RzAlertTitleStylesBase
{
    public DefaultRzAlertTitleStyles(RzTheme theme) : base(theme)
    {
    }

    public override string Title => "text-sm font-semibold pb-1";

    public override string GetVariantTextColorCss(AlertVariant? variant)
    {
        return variant switch
        {
            AlertVariant.Alternate =>
                $"text-{Theme.Light.OnSurfaceStrong.TailwindClassName}", // Example: maybe stronger for alternate
            AlertVariant.Information => $"text-info",
            AlertVariant.Success => $"text-success",
            AlertVariant.Warning => $"text-warning",
            AlertVariant.Danger => $"text-danger",
            _ => $"text-info" // Default
        };
    }
}

/// <inheritdoc />
public class DefaultRzAlertDescriptionStyles : RzStylesBase.RzAlertDescriptionStylesBase
{
    public DefaultRzAlertDescriptionStyles(RzTheme theme) : base(theme)
    {
    }

    public override string Description => "text-xs font-medium sm:text-sm";
}