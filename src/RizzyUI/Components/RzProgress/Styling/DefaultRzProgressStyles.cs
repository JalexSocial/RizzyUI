using RizzyUI.Styling;

namespace RizzyUI.Components.RzProgress.Styling;

/// <summary> Provides default styles for RzProgress. </summary>
public class DefaultRzProgressStyles : RzStylesBase.RzProgressStylesBase // Not sealed
{
    public DefaultRzProgressStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc/>
    public override string Container => "w-full";

    /// <inheritdoc/>
    public override string OutsideLabelContainer => "mb-2 flex items-center";

    /// <inheritdoc/>
    public override string OutsideLabelText => $"text-{Theme.Light.OnSurface.TailwindClassName}"; // Use theme text color

    /// <inheritdoc/>
    public override string OuterBar => $"relative flex w-full overflow-hidden rounded-{Theme.BorderRadiusTokenName} bg-{Theme.Outline.TailwindClassName}"; // Use theme tokens

    /// <inheritdoc/>
    public override string InnerBarBase => "p-0.5 text-center text-xs font-semibold leading-none transition-all"; // Base styles for inner bar

    /// <inheritdoc/>
    public override string InsideLabelContainer => "absolute"; // Positioned within InnerBar

    /// <inheritdoc/>
    public override string InsideLabelText => ""; // Usually styled via parent or specific logic

    /// <inheritdoc/>
    public override string GetOuterBarHeightCss(ProgressLabelPosition position) =>
        position == ProgressLabelPosition.Inside ? "h-4" : "h-2.5";

    /// <inheritdoc/>
    public override string GetInnerBarVariantCss(StatusColor variant) => variant switch
    {
        StatusColor.Primary => $"h-full rounded-{Theme.BorderRadiusTokenName} bg-{Theme.Light.Primary.TailwindClassName} text-{Theme.Light.OnPrimary.TailwindClassName}",
        StatusColor.Secondary => $"h-full rounded-{Theme.BorderRadiusTokenName} bg-{Theme.Light.Secondary.TailwindClassName} text-{Theme.Light.OnSecondary.TailwindClassName}",
        StatusColor.Success => $"h-full rounded-{Theme.BorderRadiusTokenName} bg-{Theme.Success.TailwindClassName} dark:bg-{Theme.Success.TailwindClassName} text-{Theme.OnSuccess.TailwindClassName} dark:text-{Theme.OnSuccess.TailwindClassName}", // Note: Specific OnSuccess dark might be needed
        StatusColor.Info => $"h-full rounded-{Theme.BorderRadiusTokenName} bg-{Theme.Info.TailwindClassName} dark:bg-{Theme.Info.TailwindClassName} text-{Theme.OnInfo.TailwindClassName} dark:text-{Theme.OnInfo.TailwindClassName}",
        StatusColor.Warning => $"h-full rounded-{Theme.BorderRadiusTokenName} bg-{Theme.Warning.TailwindClassName} dark:bg-{Theme.Warning.TailwindClassName} text-{Theme.OnWarning.TailwindClassName} dark:text-{Theme.OnWarning.TailwindClassName}",
        StatusColor.Danger => $"h-full rounded-{Theme.BorderRadiusTokenName} bg-{Theme.Danger.TailwindClassName} dark:bg-{Theme.Danger.TailwindClassName} text-{Theme.OnDanger.TailwindClassName} dark:text-{Theme.OnDanger.TailwindClassName}",
        _ => GetInnerBarVariantCss(StatusColor.Primary)
    };

    /// <inheritdoc/>
    public override string GetInsideLabelColorCss(bool overflows) =>
        overflows ? $"text-{Theme.Light.OnSurface.TailwindClassName} dark:text-{Theme.Dark.OnSurface.TailwindClassName}" : ""; // Apply contrasting color if label overflows bar
}

