namespace RizzyUI;

/// <summary> Provides default styles for RzProgress. </summary>
public class DefaultRzProgressStyles : RzStylesBase.RzProgressStylesBase // Not sealed
{
    public DefaultRzProgressStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "w-full";

    /// <inheritdoc />
    public override string OutsideLabelContainer => "mb-2 flex items-center";

    /// <inheritdoc />
    public override string OutsideLabelText => "text-on-surface"; // Use theme text color

    /// <inheritdoc />
    public override string OuterBar =>
        "relative flex w-full overflow-hidden rounded-borderRadius bg-outline"; // Use theme tokens

    /// <inheritdoc />
    public override string InnerBarBase =>
        "p-0.5 text-center text-xs font-semibold leading-none transition-all"; // Base styles for inner bar

    /// <inheritdoc />
    public override string InsideLabelContainer => "absolute"; // Positioned within InnerBar

    /// <inheritdoc />
    public override string InsideLabelText => ""; // Usually styled via parent or specific logic

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
            StatusColor.Primary => "h-full rounded-borderRadius bg-primary text-on-primary",
            StatusColor.Secondary => "h-full rounded-borderRadius bg-secondary text-on-secondary",
            StatusColor.Success =>
                $"h-full rounded-borderRadius bg-success dark:bg-success text-on-success dark:text-on-success", // Note: Specific OnSuccess dark might be needed
            StatusColor.Info =>
                $"h-full rounded-borderRadius bg-info dark:bg-info text-on-info dark:text-on-info",
            StatusColor.Warning =>
                $"h-full rounded-borderRadius bg-warning dark:bg-warning text-on-warning dark:text-on-warning",
            StatusColor.Danger =>
                $"h-full rounded-borderRadius bg-danger dark:bg-danger text-on-danger dark:text-on-danger",
            _ => GetInnerBarVariantCss(StatusColor.Primary)
        };
    }

    /// <inheritdoc />
    public override string GetInsideLabelColorCss(bool overflows)
    {
        return overflows ? $"text-on-surface dark:text-on-surface" : "";
        // Apply contrasting color if label overflows bar
    }
}