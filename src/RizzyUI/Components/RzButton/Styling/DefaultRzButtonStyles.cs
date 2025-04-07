namespace RizzyUI;

public class DefaultRzButtonStyles : RzStylesBase.RzButtonStylesBase
{
    public DefaultRzButtonStyles(RzTheme theme) : base(theme)
    {
    }

    public override string Button =>
        "inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-borderRadius font-medium tracking-wide text-center transition hover:opacity-75 active:opacity-100 hover:shadow-sm disabled:opacity-75 disabled:cursor-not-allowed";

    public override string Animated => "transform active:scale-90 motion-reduce:transition-none transition-transform";

    public override string GetVariantCss(ButtonVariant variant)
    {
        return variant switch
        {
            ButtonVariant.Primary =>
                "bg-primary text-on-primary focus-visible:outline-primary dark:focus-visible:outline-primary",
            ButtonVariant.Secondary =>
                $"bg-secondary text-on-secondary focus-visible:outline-secondary dark:focus-visible:outline-{Theme.Dark.Secondary.TailwindClassName}",
            ButtonVariant.Alternate =>
                "bg-surface-alt text-on-surface focus-visible:outline-surface-alt dark:focus-visible:outline-surface-alt",
            ButtonVariant.Inverse =>
                $"bg-{Theme.Dark.Surface.TailwindClassName} text-on-surface focus-visible:outline-surface dark:bg-surface dark:text-{Theme.Light.OnSurfaceStrong.TailwindClassName} dark:focus-visible:outline-surface", // Corrected Inverse
            ButtonVariant.Information =>
                $"bg-info text-on-info focus-visible:outline-info dark:bg-info dark:text-on-info dark:focus-visible:outline-info",
            ButtonVariant.Danger =>
                $"bg-danger text-on-danger focus-visible:outline-danger dark:bg-danger dark:text-on-danger dark:focus-visible:outline-danger",
            ButtonVariant.Warning =>
                $"bg-warning text-on-warning focus-visible:outline-warning dark:bg-warning dark:text-on-warning dark:focus-visible:outline-warning",
            ButtonVariant.Success =>
                $"bg-success text-on-success focus-visible:outline-success dark:bg-success dark:text-on-success dark:focus-visible:outline-success",
            ButtonVariant.Ghost => "bg-transparent text-on-surface focus-visible:outline-none",
            _ => GetVariantCss(ButtonVariant.Primary) // Default
        };
    }

    public override string GetVariantOutlineCss(ButtonVariant variant)
    {
        return variant switch
        {
            ButtonVariant.Primary =>
                "bg-transparent border border-primary text-primary focus-visible:outline-primary dark:focus-visible:outline-primary",
            ButtonVariant.Secondary =>
                $"bg-transparent border border-secondary text-secondary focus-visible:outline-secondary dark:focus-visible:outline-{Theme.Dark.Secondary.TailwindClassName}",
            ButtonVariant.Alternate =>
                "bg-transparent border border-outline text-outline focus-visible:outline-outline dark:focus-visible:outline-outline",
            ButtonVariant.Inverse =>
                $"bg-transparent border border-{Theme.Light.OnSurfaceStrong.TailwindClassName} text-{Theme.Light.OnSurfaceStrong.TailwindClassName} focus-visible:outline-{Theme.Light.OnSurfaceStrong.TailwindClassName} dark:focus-visible:outline-{Theme.Dark.OnSurfaceStrong.TailwindClassName}",
            ButtonVariant.Information =>
                $"bg-transparent border border-info text-info focus-visible:outline-info dark:border-info dark:text-info dark:focus-visible:outline-info",
            ButtonVariant.Danger =>
                $"bg-transparent border border-danger text-danger focus-visible:outline-danger dark:border-danger dark:text-danger dark:focus-visible:outline-danger",
            ButtonVariant.Warning =>
                $"bg-transparent border border-warning text-warning focus-visible:outline-warning dark:border-warning dark:text-warning dark:focus-visible:outline-warning",
            ButtonVariant.Success =>
                $"bg-transparent border border-success text-success focus-visible:outline-success dark:border-success dark:text-success dark:focus-visible:outline-success",
            ButtonVariant.Ghost => "bg-transparent border text-on-surface hover:opacity-75 focus-visible:outline-none",
            _ => GetVariantOutlineCss(ButtonVariant.Primary) // Default
        };
    }

    public override string GetSizeCss(Size size)
    {
        return size switch
        {
            Size.ExtraSmall => "px-2 py-1 text-sm",
            Size.Small => "px-3 py-2 text-sm",
            Size.Medium => "px-4 py-2 text-md", // Assuming text-md exists or adjust as needed
            Size.Large => "px-6 py-3 text-md",
            Size.ExtraLarge => "px-8 py-4 text-md",
            _ => GetSizeCss(Size.Medium)
        };
    }
}