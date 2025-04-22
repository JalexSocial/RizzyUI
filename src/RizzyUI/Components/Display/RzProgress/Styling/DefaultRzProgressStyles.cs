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
    public override string OutsideLabelText => "text-on-surface";

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
            StatusColor.Primary => "h-full rounded-theme bg-primary text-on-primary",
            StatusColor.Secondary => "h-full rounded-theme bg-secondary text-on-secondary",
            StatusColor.Success =>
                "h-full rounded-theme bg-success dark:bg-success text-on-success dark:text-on-success",
            StatusColor.Info =>
                "h-full rounded-theme bg-info dark:bg-info text-on-info dark:text-on-info",
            StatusColor.Warning =>
                "h-full rounded-theme bg-warning dark:bg-warning text-on-warning dark:text-on-warning",
            StatusColor.Danger =>
                "h-full rounded-theme bg-danger dark:bg-danger text-on-danger dark:text-on-danger",
            _ => GetInnerBarVariantCss(StatusColor.Primary)
        };
    }

    /// <inheritdoc />
    public override string GetInsideLabelColorCss(bool overflows)
    {
        return overflows ? "text-on-surface dark:text-on-surface" : string.Empty;
    }
}