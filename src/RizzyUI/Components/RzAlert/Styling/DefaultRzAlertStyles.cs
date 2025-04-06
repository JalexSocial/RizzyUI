using RizzyUI.Styling;

namespace RizzyUI.Components.RzAlert.Styling;

public  class DefaultRzAlertStyles : RzStylesBase.RzAlertStylesBase
{
    public DefaultRzAlertStyles(RzTheme theme) : base(theme) { }

    public override string Container => $"relative w-full overflow-hidden rounded-{Theme.BorderRadiusTokenName} border";
    public override string InnerContainer => "flex w-full items-center gap-2 p-4";
    public override string IconContainer => "relative flex rounded-full p-1 text-2xl justify-center";
    public override string IconPulse => "absolute animate-ping motion-reduce:animate-none size-6 aspect-square rounded-full";
    public override string ContentContainer => "ml-2";
    public override string CloseButton => "ml-auto";
    public override string CloseButtonIcon => "shrink-0 h-4 w-4";

    public override string GetVariantCss(AlertVariant variant) => variant switch
    {
        AlertVariant.Alternate => $"border-{Theme.Outline.TailwindClassName} bg-{Theme.Light.Surface.TailwindClassName} text-{Theme.Light.OnSurface.TailwindClassName}",
        AlertVariant.Information => $"border-{Theme.Info.TailwindClassName} bg-{Theme.Light.Surface.TailwindClassName} text-{Theme.Light.OnSurface.TailwindClassName}",
        AlertVariant.Success => $"border-{Theme.Success.TailwindClassName} bg-{Theme.Light.Surface.TailwindClassName} text-{Theme.Light.OnSurface.TailwindClassName}",
        AlertVariant.Warning => $"border-{Theme.Warning.TailwindClassName} bg-{Theme.Light.Surface.TailwindClassName} text-{Theme.Light.OnSurface.TailwindClassName}",
        AlertVariant.Danger => $"border-{Theme.Danger.TailwindClassName} bg-{Theme.Light.Surface.TailwindClassName} text-{Theme.Light.OnSurface.TailwindClassName}",
        _ => GetVariantCss(AlertVariant.Information) // Default
    };

    public override string GetVariantBackgroundLightCss(AlertVariant variant) => variant switch {
        AlertVariant.Alternate => $"bg-{Theme.Light.SurfaceAlt.TailwindClassName}/10",
        AlertVariant.Information => $"bg-{Theme.Info.TailwindClassName}/10",
        AlertVariant.Success => $"bg-{Theme.Success.TailwindClassName}/10",
        AlertVariant.Warning => $"bg-{Theme.Warning.TailwindClassName}/10",
        AlertVariant.Danger => $"bg-{Theme.Danger.TailwindClassName}/10",
        _ => GetVariantBackgroundLightCss(AlertVariant.Information)
    };

     public override string GetVariantBackgroundLighterCss(AlertVariant variant) => variant switch {
        AlertVariant.Alternate => $"bg-{Theme.Light.SurfaceAlt.TailwindClassName}/15",
        AlertVariant.Information => $"bg-{Theme.Info.TailwindClassName}/15",
        AlertVariant.Success => $"bg-{Theme.Success.TailwindClassName}/15",
        AlertVariant.Warning => $"bg-{Theme.Warning.TailwindClassName}/15",
        AlertVariant.Danger => $"bg-{Theme.Danger.TailwindClassName}/15",
        _ => GetVariantBackgroundLighterCss(AlertVariant.Information)
    };

    public override string GetVariantIconColorCss(AlertVariant variant) => variant switch {
        AlertVariant.Alternate => $"text-{Theme.Light.OnSurface.TailwindClassName}",
        AlertVariant.Information => $"text-{Theme.Info.TailwindClassName}",
        AlertVariant.Success => $"text-{Theme.Success.TailwindClassName}",
        AlertVariant.Warning => $"text-{Theme.Warning.TailwindClassName}",
        AlertVariant.Danger => $"text-{Theme.Danger.TailwindClassName}",
        _ => GetVariantIconColorCss(AlertVariant.Information)
    };
}

public  class DefaultRzAlertTitleStyles : RzStylesBase.RzAlertTitleStylesBase
{
     public DefaultRzAlertTitleStyles(RzTheme theme) : base(theme) { }
     public override string Title => "text-sm font-semibold pb-1";
     public override string GetVariantTextColorCss(AlertVariant? variant) => variant switch
     {
         AlertVariant.Alternate => $"text-{Theme.Light.OnSurfaceStrong.TailwindClassName}", // Example: maybe stronger for alternate
         AlertVariant.Information => $"text-{Theme.Info.TailwindClassName}",
         AlertVariant.Success => $"text-{Theme.Success.TailwindClassName}",
         AlertVariant.Warning => $"text-{Theme.Warning.TailwindClassName}",
         AlertVariant.Danger => $"text-{Theme.Danger.TailwindClassName}",
         _ => $"text-{Theme.Info.TailwindClassName}" // Default
     };
}

public  class DefaultRzAlertDescriptionStyles : RzStylesBase.RzAlertDescriptionStylesBase
{
     public DefaultRzAlertDescriptionStyles(RzTheme theme) : base(theme) { }
     public override string Description => "text-xs font-medium sm:text-sm";
}


