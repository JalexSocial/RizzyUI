namespace RizzyUI;

/// <summary>
///     Provides default styles for the <see cref="RzProgress" /> component.
/// </summary>
public class DefaultRzProgressStyles : RzStylesBase.RzProgressStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzProgressStyles" /> class.
    /// </summary>
    /// <param name="theme">
    ///     The <see cref="RzTheme" /> instance that supplies color and sizing tokens.
    /// </param>
    public DefaultRzProgressStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "w-full";

    /// <inheritdoc />
    public override string OutsideLabelContainer => "mb-2 flex items-center";

    /// <inheritdoc />
    public override string OutsideLabelText => "text-foreground";

    /// <inheritdoc />
    public override string OuterBar =>
        "relative flex w-full overflow-hidden rounded-theme bg-outline";

    /// <inheritdoc />
    public override string InnerBarBase =>
        "p-0.5 text-center text-xs font-semibold leading-none transition-all";

    /// <inheritdoc />
    public override string InsideLabelContainer => "absolute";

    /// <inheritdoc />
    public override string InsideLabelText => string.Empty;

    /// <inheritdoc />
    public override string GetOuterBarHeightCss(ProgressLabelPosition position)
    {
        return position == ProgressLabelPosition.Inside ? "h-4" : "h-2.5";
    }

    /// <inheritdoc />
    public override string GetInnerBarVariantCss(StatusColor variant)
    {
        return variant switch
        {
            StatusColor.Primary => "h-full rounded-theme bg-primary text-primary-foreground",
            StatusColor.Secondary => "h-full rounded-theme bg-secondary text-secondary-foreground",
            StatusColor.Success =>
                "h-full rounded-theme bg-success dark:bg-success text-success-foreground dark:text-success-foreground",
            StatusColor.Info =>
                "h-full rounded-theme bg-info dark:bg-info text-info-foreground dark:text-info-foreground",
            StatusColor.Warning =>
                "h-full rounded-theme bg-warning dark:bg-warning text-warning-foreground dark:text-warning-foreground",
            StatusColor.Destructive =>
                "h-full rounded-theme bg-destructive dark:bg-destructive text-destructive-foreground dark:text-destructive-foreground",
            _ => GetInnerBarVariantCss(StatusColor.Primary)
        };
    }

    /// <inheritdoc />
    public override string GetInsideLabelColorCss(bool overflows)
    {
        return overflows ? "text-foreground dark:text-foreground" : string.Empty;
    }
}