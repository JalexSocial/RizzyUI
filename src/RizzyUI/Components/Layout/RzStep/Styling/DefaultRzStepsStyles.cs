
namespace RizzyUI;

/// <summary> Provides default styles for RzSteps. </summary>
public class DefaultRzStepsStyles : RzStylesBase.RzStepsStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzStepsStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
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
    public override string CircleDefaultIcon => "size-4"; // Size for the default icon within the circle

    /// <inheritdoc />
    public override string LabelBase => "hidden w-max sm:inline"; // Base label style (hidden on small screens)

    /// <inheritdoc />
    public override string Caption =>
        "text-xs text-muted-foreground mt-1"; // Style for caption, added top margin

    /// <inheritdoc />
    public override string GetOrientationCss(Orientation orientation)
    {
        return orientation switch
        {
            Orientation.Horizontal => "w-full items-start", // Horizontal layout adjustments, align items start
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
        // Use semantic colors for active state, fallback to border for inactive
        var colorClass = isActive ? GetActiveBackgroundClass(activeColor) : "bg-border";
        var positionAndSize = orientation == Orientation.Vertical
            ? "absolute bottom-8 left-3 h-10 w-0.5" // Vertical positioning
            : "h-0.5 flex-1 mx-2"; // Horizontal positioning, added margin

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
        // Use theme variables for focus ring color if possible, otherwise fallback
        string focusRingColorClass = activeColor switch
        {
            StatusColor.Primary => "focus-visible:ring-primary",
            StatusColor.Secondary => "focus-visible:ring-secondary",
            StatusColor.Success => "focus-visible:ring-success",
            StatusColor.Info => "focus-visible:ring-info",
            StatusColor.Warning => "focus-visible:ring-warning",
            StatusColor.Destructive => "focus-visible:ring-destructive",
            _ => "focus-visible:ring-primary"
        };


        return status switch
        {
            StepStatus.Current =>
                $"border {GetActiveBorderClass(activeColor)} {GetActiveBackgroundClass(activeColor)} font-bold {GetActiveTextClass(activeColor)} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 {focusRingColorClass} dark:focus-visible:ring-offset-background",
            StepStatus.Upcoming => "border border-border bg-muted font-medium text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring dark:focus-visible:ring-offset-background", // Updated to use border, muted, muted-foreground
            _ => GetCircleDefaultCss(StepStatus.Upcoming, activeColor) // Default to upcoming style
        };
    }

    /// <inheritdoc />
    public override string GetLabelStatusCss(StepStatus status, StatusColor activeColor)
    {
        return status switch
        {
            StepStatus.Completed => GetActiveTextColorClass(activeColor),
            StepStatus.Current => $"font-bold {GetActiveTextColorClass(activeColor)}",
            StepStatus.Upcoming => "text-muted-foreground", // Use muted-foreground for upcoming
            _ => GetLabelStatusCss(StepStatus.Upcoming, activeColor)
        };
    }

    // Helper methods to get active color classes based on StatusColor, mapping to semantic colors
    private string GetActiveBackgroundClass(StatusColor color)
    {
        return color switch
        {
            StatusColor.Primary => "bg-primary",
            StatusColor.Secondary => "bg-secondary",
            StatusColor.Success => "bg-success",
            StatusColor.Info => "bg-info",
            StatusColor.Warning => "bg-warning",
            StatusColor.Destructive => "bg-destructive",
            _ => GetActiveBackgroundClass(StatusColor.Primary)
        };
    }

    private string GetActiveBorderClass(StatusColor color)
    {
        return color switch
        {
            StatusColor.Primary => "border-primary",
            StatusColor.Secondary => "border-secondary",
            StatusColor.Success => "border-success",
            StatusColor.Info => "border-info",
            StatusColor.Warning => "border-warning",
            StatusColor.Destructive => "border-destructive",
            _ => GetActiveBorderClass(StatusColor.Primary)
        };
    }

    private string GetActiveTextClass(StatusColor color)
    {
        return color switch
        {
            StatusColor.Primary => "text-primary-foreground",
            StatusColor.Secondary => "text-secondary-foreground",
            StatusColor.Success => "text-success-foreground", // Assuming success-foreground exists
            StatusColor.Info => "text-info-foreground",       // Assuming info-foreground exists
            StatusColor.Warning => "text-warning-foreground",   // Assuming warning-foreground exists
            StatusColor.Destructive => "text-destructive-foreground", // Assuming destructive-foreground exists
            _ => GetActiveTextClass(StatusColor.Primary)
        };
    }

    private string GetActiveTextColorClass(StatusColor color) // For labels, not circle content
    {
        return color switch
        {
            StatusColor.Primary => "text-primary",
            StatusColor.Secondary => "text-secondary",
            StatusColor.Success => "text-success",
            StatusColor.Info => "text-info",
            StatusColor.Warning => "text-warning",
            StatusColor.Destructive => "text-destructive",
            _ => GetActiveTextColorClass(StatusColor.Primary)
        };
    }
}