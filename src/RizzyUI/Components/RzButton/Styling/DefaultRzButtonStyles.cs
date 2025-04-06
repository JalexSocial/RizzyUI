using RizzyUI.Styling;

namespace RizzyUI.Components.RzButton.Styling;

public  class DefaultRzButtonStyles : RzStylesBase.RzButtonStylesBase
{
    public DefaultRzButtonStyles(RzTheme theme) : base(theme) { }

    public override string Button => $"inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-{Theme.BorderRadiusTokenName} font-medium tracking-wide text-center transition hover:opacity-75 active:opacity-100 hover:shadow-sm disabled:opacity-75 disabled:cursor-not-allowed";
    public override string Animated => "transform active:scale-90 motion-reduce:transition-none transition-transform";

    public override string GetVariantCss(ButtonVariant variant) => variant switch {
        ButtonVariant.Primary => $"bg-{Theme.Light.Primary.TailwindClassName} text-{Theme.Light.OnPrimary.TailwindClassName} focus-visible:outline-{Theme.Light.Primary.TailwindClassName} dark:focus-visible:outline-{Theme.Dark.Primary.TailwindClassName}",
        ButtonVariant.Secondary => $"bg-{Theme.Light.Secondary.TailwindClassName} text-{Theme.Light.OnSecondary.TailwindClassName} focus-visible:outline-{Theme.Light.Secondary.TailwindClassName} dark:focus-visible:outline-{Theme.Dark.Secondary.TailwindClassName}",
        ButtonVariant.Alternate => $"bg-{Theme.Light.SurfaceAlt.TailwindClassName} text-{Theme.Light.OnSurface.TailwindClassName} focus-visible:outline-{Theme.Light.SurfaceAlt.TailwindClassName} dark:focus-visible:outline-{Theme.Dark.SurfaceAlt.TailwindClassName}",
        ButtonVariant.Inverse => $"bg-{Theme.Dark.Surface.TailwindClassName} text-{Theme.Dark.OnSurface.TailwindClassName} focus-visible:outline-{Theme.Light.Surface.TailwindClassName} dark:bg-{Theme.Light.Surface.TailwindClassName} dark:text-{Theme.Light.OnSurfaceStrong.TailwindClassName} dark:focus-visible:outline-{Theme.Light.Surface.TailwindClassName}", // Corrected Inverse
        ButtonVariant.Information => $"bg-{Theme.Info.TailwindClassName} text-{Theme.OnInfo.TailwindClassName} focus-visible:outline-{Theme.Info.TailwindClassName} dark:bg-{Theme.Info.TailwindClassName} dark:text-{Theme.OnInfo.TailwindClassName} dark:focus-visible:outline-{Theme.Info.TailwindClassName}",
        ButtonVariant.Danger => $"bg-{Theme.Danger.TailwindClassName} text-{Theme.OnDanger.TailwindClassName} focus-visible:outline-{Theme.Danger.TailwindClassName} dark:bg-{Theme.Danger.TailwindClassName} dark:text-{Theme.OnDanger.TailwindClassName} dark:focus-visible:outline-{Theme.Danger.TailwindClassName}",
        ButtonVariant.Warning => $"bg-{Theme.Warning.TailwindClassName} text-{Theme.OnWarning.TailwindClassName} focus-visible:outline-{Theme.Warning.TailwindClassName} dark:bg-{Theme.Warning.TailwindClassName} dark:text-{Theme.OnWarning.TailwindClassName} dark:focus-visible:outline-{Theme.Warning.TailwindClassName}",
        ButtonVariant.Success => $"bg-{Theme.Success.TailwindClassName} text-{Theme.OnSuccess.TailwindClassName} focus-visible:outline-{Theme.Success.TailwindClassName} dark:bg-{Theme.Success.TailwindClassName} dark:text-{Theme.OnSuccess.TailwindClassName} dark:focus-visible:outline-{Theme.Success.TailwindClassName}",
        ButtonVariant.Ghost => $"bg-transparent text-{Theme.Light.OnSurface.TailwindClassName} focus-visible:outline-none",
        _ => GetVariantCss(ButtonVariant.Primary) // Default
    };

    public override string GetVariantOutlineCss(ButtonVariant variant) => variant switch {
        ButtonVariant.Primary => $"bg-transparent border border-{Theme.Light.Primary.TailwindClassName} text-{Theme.Light.Primary.TailwindClassName} focus-visible:outline-{Theme.Light.Primary.TailwindClassName} dark:focus-visible:outline-{Theme.Dark.Primary.TailwindClassName}",
        ButtonVariant.Secondary => $"bg-transparent border border-{Theme.Light.Secondary.TailwindClassName} text-{Theme.Light.Secondary.TailwindClassName} focus-visible:outline-{Theme.Light.Secondary.TailwindClassName} dark:focus-visible:outline-{Theme.Dark.Secondary.TailwindClassName}",
        ButtonVariant.Alternate => $"bg-transparent border border-{Theme.Outline.TailwindClassName} text-{Theme.Outline.TailwindClassName} focus-visible:outline-{Theme.Outline.TailwindClassName} dark:focus-visible:outline-{Theme.Dark.Outline.TailwindClassName}",
        ButtonVariant.Inverse => $"bg-transparent border border-{Theme.Light.OnSurfaceStrong.TailwindClassName} text-{Theme.Light.OnSurfaceStrong.TailwindClassName} focus-visible:outline-{Theme.Light.OnSurfaceStrong.TailwindClassName} dark:focus-visible:outline-{Theme.Dark.OnSurfaceStrong.TailwindClassName}",
        ButtonVariant.Information => $"bg-transparent border border-{Theme.Info.TailwindClassName} text-{Theme.Info.TailwindClassName} focus-visible:outline-{Theme.Info.TailwindClassName} dark:border-{Theme.Info.TailwindClassName} dark:text-{Theme.Info.TailwindClassName} dark:focus-visible:outline-{Theme.Info.TailwindClassName}",
        ButtonVariant.Danger => $"bg-transparent border border-{Theme.Danger.TailwindClassName} text-{Theme.Danger.TailwindClassName} focus-visible:outline-{Theme.Danger.TailwindClassName} dark:border-{Theme.Danger.TailwindClassName} dark:text-{Theme.Danger.TailwindClassName} dark:focus-visible:outline-{Theme.Danger.TailwindClassName}",
        ButtonVariant.Warning => $"bg-transparent border border-{Theme.Warning.TailwindClassName} text-{Theme.Warning.TailwindClassName} focus-visible:outline-{Theme.Warning.TailwindClassName} dark:border-{Theme.Warning.TailwindClassName} dark:text-{Theme.Warning.TailwindClassName} dark:focus-visible:outline-{Theme.Warning.TailwindClassName}",
        ButtonVariant.Success => $"bg-transparent border border-{Theme.Success.TailwindClassName} text-{Theme.Success.TailwindClassName} focus-visible:outline-{Theme.Success.TailwindClassName} dark:border-{Theme.Success.TailwindClassName} dark:text-{Theme.Success.TailwindClassName} dark:focus-visible:outline-{Theme.Success.TailwindClassName}",
        ButtonVariant.Ghost => $"bg-transparent border text-{Theme.Light.OnSurface.TailwindClassName} hover:opacity-75 focus-visible:outline-none",
        _ => GetVariantOutlineCss(ButtonVariant.Primary) // Default
    };

    public override string GetSizeCss(Size size) => size switch {
        Size.ExtraSmall => "px-2 py-1 text-sm",
        Size.Small => "px-3 py-2 text-sm",
        Size.Medium => "px-4 py-2 text-md", // Assuming text-md exists or adjust as needed
        Size.Large => "px-6 py-3 text-md",
        Size.ExtraLarge => "px-8 py-4 text-md",
        _ => GetSizeCss(Size.Medium)
    };
}

