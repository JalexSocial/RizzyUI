namespace RizzyUI.Components.RzStep.Styling;

/// <summary> Provides default styles for RzSteps. </summary>
public class DefaultRzStepsStyles : RzStylesBase.RzStepsStylesBase // Not sealed
{
    public DefaultRzStepsStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "flex gap-2"; // Base flex container

    /// <inheritdoc />
    public override string StepItem => "flex items-center relative text-sm"; // Styles for each <li>

    /// <inheritdoc />
    public override string ConnectorBase => ""; // Base connector, specific styles added by GetConnectorCss

    /// <inheritdoc />
    public override string StepContentContainer => "flex items-center gap-2"; // Container for circle + label

    /// <inheritdoc />
    public override string CircleCompletedBase =>
        "flex size-6 items-center justify-center rounded-full border"; // Base completed circle

    /// <inheritdoc />
    public override string CircleCompletedIcon => "size-4";

    /// <inheritdoc />
    public override string CircleCompletedSrText => "sr-only";

    /// <inheritdoc />
    public override string CircleDefaultBase =>
        "flex size-6 shrink-0 items-center justify-center rounded-full border"; // Base default circle

    /// <inheritdoc />
    public override string LabelBase => "hidden w-max sm:inline"; // Base label style (hidden on small screens)

    /// <inheritdoc />
    public override string Caption =>
        $"text-xs text-{Theme.Light.OnSurfaceMuted.TailwindClassName}"; // Style for caption

    /// <inheritdoc />
    public override string GetOrientationCss(Orientation orientation)
    {
        return orientation switch
        {
            Orientation.Horizontal => "w-full items-center", // Horizontal layout adjustments
            Orientation.Vertical => "w-min flex-col gap-14", // Vertical layout adjustments
            _ => GetOrientationCss(Orientation.Horizontal)
        };
    }

    /// <inheritdoc />
    public override string GetStepItemWidthCss(bool isFirst)
    {
        return isFirst ? "" : "w-full";
        // Make non-first items take full width in horizontal
    }

    /// <inheritdoc />
    public override string GetConnectorCss(Orientation orientation, StepStatus previousStatus, StatusColor activeColor)
    {
        var isActive = previousStatus == StepStatus.Completed || previousStatus == StepStatus.Current;
        var colorClass = isActive ? GetActiveBackgroundClass(activeColor) : "bg-outline";
        var positionAndSize = orientation == Orientation.Vertical
            ? "absolute bottom-8 left-3 h-10 w-0.5" // Vertical positioning
            : "h-0.5 flex-1 mr-1"; // Horizontal positioning

        return $"{positionAndSize} {colorClass}";
    }

    /// <inheritdoc />
    public override string GetCircleCompletedCss(StatusColor activeColor)
    {
        return
            $"{GetActiveBorderClass(activeColor)} {GetActiveBackgroundClass(activeColor)} {GetActiveTextClass(activeColor)}";
    }

    /// <inheritdoc />
    public override string GetCircleDefaultCss(StepStatus status, StatusColor activeColor)
    {
        return status switch
        {
            // Note: Focus ring style might need theme color variable for consistency
            StepStatus.Current =>
                $"border {GetActiveBorderClass(activeColor)} {GetActiveBackgroundClass(activeColor)} font-bold {GetActiveTextClass(activeColor)} outline outline-2 outline-offset-2 outline-{activeColor.ToString().ToLowerInvariant()} dark:outline-{activeColor.ToString().ToLowerInvariant()}",
            StepStatus.Upcoming => "border border-outline bg-surface-alt font-medium text-on-surface",
            _ => GetCircleDefaultCss(StepStatus.Upcoming, activeColor) // Default to upcoming style
        };
    }

    /// <inheritdoc />
    public override string GetLabelStatusCss(StepStatus status, StatusColor activeColor)
    {
        return status switch
        {
            // Note: Dark mode text color might need specific theme variables if different from light
            StepStatus.Completed =>
                $"text-{activeColor.ToString().ToLowerInvariant()} dark:text-{activeColor.ToString().ToLowerInvariant()}",
            StepStatus.Current =>
                $"font-bold text-{activeColor.ToString().ToLowerInvariant()} dark:text-{activeColor.ToString().ToLowerInvariant()}",
            StepStatus.Upcoming => "text-on-surface",
            _ => GetLabelStatusCss(StepStatus.Upcoming, activeColor)
        };
    }

    // Helper methods to get active color classes based on StatusColor
    private string GetActiveBackgroundClass(StatusColor color)
    {
        return color switch
        {
            StatusColor.Primary => "bg-primary",
            StatusColor.Secondary => "bg-secondary",
            StatusColor.Success => $"bg-{Theme.Success.TailwindClassName} dark:bg-{Theme.Success.TailwindClassName}",
            StatusColor.Info => $"bg-{Theme.Info.TailwindClassName} dark:bg-{Theme.Info.TailwindClassName}",
            StatusColor.Warning => $"bg-{Theme.Warning.TailwindClassName} dark:bg-{Theme.Warning.TailwindClassName}",
            StatusColor.Danger => $"bg-{Theme.Danger.TailwindClassName} dark:bg-{Theme.Danger.TailwindClassName}",
            _ => GetActiveBackgroundClass(StatusColor.Primary)
        };
    }

    private string GetActiveBorderClass(StatusColor color)
    {
        return color switch
        {
            StatusColor.Primary => "border-primary",
            StatusColor.Secondary => "border-secondary",
            StatusColor.Success =>
                $"border-{Theme.Success.TailwindClassName} dark:border-{Theme.Success.TailwindClassName}",
            StatusColor.Info => $"border-{Theme.Info.TailwindClassName} dark:border-{Theme.Info.TailwindClassName}",
            StatusColor.Warning =>
                $"border-{Theme.Warning.TailwindClassName} dark:border-{Theme.Warning.TailwindClassName}",
            StatusColor.Danger =>
                $"border-{Theme.Danger.TailwindClassName} dark:border-{Theme.Danger.TailwindClassName}",
            _ => GetActiveBorderClass(StatusColor.Primary)
        };
    }

    private string GetActiveTextClass(StatusColor color)
    {
        return color switch
        {
            StatusColor.Primary => "text-on-primary",
            StatusColor.Secondary => "text-on-secondary",
            StatusColor.Success =>
                $"text-{Theme.OnSuccess.TailwindClassName} dark:text-{Theme.OnSuccess.TailwindClassName}", // Assume dark OnSuccess exists or is same
            StatusColor.Info => $"text-{Theme.OnInfo.TailwindClassName} dark:text-{Theme.OnInfo.TailwindClassName}",
            StatusColor.Warning =>
                $"text-{Theme.OnWarning.TailwindClassName} dark:text-{Theme.OnWarning.TailwindClassName}",
            StatusColor.Danger =>
                $"text-{Theme.OnDanger.TailwindClassName} dark:text-{Theme.OnDanger.TailwindClassName}",
            _ => GetActiveTextClass(StatusColor.Primary)
        };
    }
}