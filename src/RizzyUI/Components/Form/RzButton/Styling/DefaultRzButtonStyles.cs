
namespace RizzyUI;

/// <summary>
///     Provides the default styles for the RzButton component.
/// </summary>
public class DefaultRzButtonStyles : RzStylesBase.RzButtonStylesBase
{
    /// <inheritdoc />
    public DefaultRzButtonStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Button =>
        "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer rounded-md"; // Base from kitchen sink

    /// <inheritdoc />
    public override string Animated => "transform active:scale-95 motion-reduce:transition-none transition-transform"; // Adjusted active scale slightly

    /// <inheritdoc />
    public override string GetVariantCss(ButtonVariant variant)
    {
        return variant switch
        {
            ButtonVariant.Primary =>
                "bg-primary text-primary-foreground shadow-xs " +
                "focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40 " +
                "dark:bg-primary/60 hover:bg-primary/90 dark:hover:bg-primary/50 " +
                "aria-pressed:bg-primary/90 dark:aria-pressed:bg-primary/50",

            ButtonVariant.Secondary =>
                "bg-secondary text-secondary-foreground shadow-xs " +
                "focus-visible:ring-secondary/20 dark:focus-visible:ring-secondary/40 " +
                "dark:bg-secondary/60 hover:bg-secondary/90 dark:hover:bg-secondary/50 " +
                "aria-pressed:bg-secondary/90 dark:aria-pressed:bg-secondary/50",

            ButtonVariant.Destructive =>
                "bg-destructive text-white shadow-xs " +
                "focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 " +
                "dark:bg-destructive/60 hover:bg-destructive/90 dark:hover:bg-destructive/50 " +
                "aria-pressed:bg-destructive/90 dark:aria-pressed:bg-destructive/50",

            ButtonVariant.Ghost =>
                "shadow-none aria-pressed:opacity-75",

            ButtonVariant.Accent =>
                "bg-accent text-accent-foreground shadow-xs " +
                "focus-visible:ring-accent/20 dark:focus-visible:ring-accent/40 " +
                "dark:bg-accent/60 hover:bg-accent/90 dark:hover:bg-accent/50 " +
                "aria-pressed:bg-accent/90 dark:aria-pressed:bg-accent/50",

            ButtonVariant.Inverse =>
                "bg-foreground text-background shadow-xs " +
                "focus-visible:ring-foreground/20 dark:focus-visible:ring-foreground/40 " +
                "dark:bg-foreground/60 hover:bg-foreground/90 dark:hover:bg-foreground/50 " +
                "aria-pressed:bg-foreground/90 dark:aria-pressed:bg-foreground/50",

            ButtonVariant.Information =>
                "bg-info text-info-foreground shadow-xs " +
                "focus-visible:ring-info/20 dark:focus-visible:ring-info/40 " +
                "dark:bg-info/60 hover:bg-info/90 dark:hover:bg-info/50 " +
                "aria-pressed:bg-info/90 dark:aria-pressed:bg-info/50",

            ButtonVariant.Warning =>
                "bg-warning text-warning-foreground shadow-xs " +
                "focus-visible:ring-warning/20 dark:focus-visible:ring-warning/40 " +
                "dark:bg-warning/60 hover:bg-warning/90 dark:hover:bg-warning/50 " +
                "aria-pressed:bg-warning/90 dark:aria-pressed:bg-warning/50",

            ButtonVariant.Success =>
                "bg-success text-success-foreground shadow-xs " +
                "focus-visible:ring-success/20 dark:focus-visible:ring-success/40 " +
                "dark:bg-success/60 hover:bg-success/90 dark:hover:bg-success/50 " +
                "aria-pressed:bg-success/90 dark:aria-pressed:bg-success/50",

            _ =>
                "bg-primary text-primary-foreground shadow-xs " +
                "focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40 " +
                "dark:bg-primary/60 hover:bg-primary/90 dark:hover:bg-primary/50 " +
                "aria-pressed:bg-primary/90 dark:aria-pressed:bg-primary/50"
        };
    }

    /// <inheritdoc />
    public override string GetVariantOutlineCss(ButtonVariant variant)
    {
        return variant switch
        {
            ButtonVariant.Primary =>
                "border border-primary text-primary bg-background shadow-xs " +
                "hover:bg-primary/10 aria-pressed:bg-primary/10 " +
                "dark:bg-input/30 dark:border-primary dark:hover:bg-primary/20 dark:aria-pressed:bg-primary/20",

            ButtonVariant.Secondary =>
                "border border-secondary text-foreground bg-background shadow-xs " +
                "hover:bg-secondary/10 aria-pressed:bg-secondary/10 " +
                "dark:bg-input/30 dark:border-secondary dark:hover:bg-secondary/20 dark:aria-pressed:bg-secondary/20",

            ButtonVariant.Destructive =>
                "border border-destructive text-destructive bg-background shadow-xs " +
                "hover:bg-destructive/10 aria-pressed:bg-destructive/10 " +
                "dark:bg-input/30 dark:border-destructive dark:hover:bg-destructive/20 dark:aria-pressed:bg-destructive/20",

            ButtonVariant.Accent =>
                "border border-accent text-foreground bg-background shadow-xs " +
                "hover:bg-accent/10 aria-pressed:bg-accent/10 " +
                "dark:bg-input/30 dark:border-accent dark:hover:bg-accent/20 dark:aria-pressed:bg-accent/20",

            ButtonVariant.Inverse =>
                "border border-foreground text-foreground bg-background shadow-xs " +
                "hover:bg-foreground/10 aria-pressed:bg-foreground/10 " +
                "dark:bg-input/30 dark:border-foreground dark:hover:bg-foreground/20 dark:aria-pressed:bg-foreground/20",

            ButtonVariant.Information =>
                "border border-info text-info bg-background shadow-xs " +
                "hover:bg-info/10 aria-pressed:bg-info/10 " +
                "dark:bg-input/30 dark:border-info dark:hover:bg-info/20 dark:aria-pressed:bg-info/20",

            ButtonVariant.Warning =>
                "border border-warning text-warning bg-background shadow-xs " +
                "hover:bg-warning/10 aria-pressed:bg-warning/10 " +
                "dark:bg-input/30 dark:border-warning dark:hover:bg-warning/20 dark:aria-pressed:bg-warning/20",

            ButtonVariant.Success =>
                "border border-success text-success bg-background shadow-xs " +
                "hover:bg-success/10 aria-pressed:bg-success/10 " +
                "dark:bg-input/30 dark:border-success dark:hover:bg-success/20 dark:aria-pressed:bg-success/20",

            ButtonVariant.Ghost =>
                "shadow-none aria-pressed:opacity-75",

            _ =>
                "border bg-background shadow-xs dark:bg-input/30 dark:border-input"
        };
    }


    /// <inheritdoc />
    public override string GetSizeCss(Size size)
    {
        // Mapping to kitchen sink button sizes
        return size switch
        {
            Size.ExtraSmall => "gap-1 h-7 px-2.5 text-xs has-[>svg]:px-2", // Custom small size
            Size.Small => "gap-1.5 h-8 px-3 has-[>svg]:px-2.5", // Matches btn-sm
            Size.Medium => "gap-2 h-9 px-4 py-2 has-[>svg]:px-3", // Matches default btn
            Size.Large => "gap-2 h-10 px-6 has-[>svg]:px-4",    // Matches btn-lg
            Size.ExtraLarge => "gap-2.5 h-12 px-8 text-lg has-[>svg]:px-6", // Custom larger size
            _ => GetSizeCss(Size.Medium)
        };
    }
}