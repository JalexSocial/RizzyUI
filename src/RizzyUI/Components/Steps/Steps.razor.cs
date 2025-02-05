using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
/// Specifies the status of a step in the Steps component.
/// </xmldoc>
public enum StepStatus
{
    /// <summary>Step is complete.</summary>
    Completed,
    /// <summary>Step is the current active step.</summary>
    Current,
    /// <summary>Step is upcoming.</summary>
    Upcoming
}

/// <xmldoc>
/// Represents the data for a single step.
/// </xmldoc>
public record StepData
{
    /// <summary>
    /// Gets the label text for the step.
    /// </summary>
    public string Label { get; init; }

    /// <summary>
    /// Gets the status of the step (Completed, Current, or Upcoming).
    /// </summary>
    public StepStatus Status { get; init; }

    /// <summary>
    /// Gets the optional ARIA label for accessibility. If not provided, the Label is used.
    /// </summary>
    public string? AriaLabel { get; init; }

    /// <summary>
    /// Gets the optional caption text (a small muted text displayed under the step).
    /// </summary>
    public string? Caption { get; init; }

    /// <summary>
    /// Gets the optional icon to display instead of the step number.
    /// </summary>
    public SvgIcon? Icon { get; init; }

    /// <summary>
    /// Initializes a new instance of the <see cref="StepData"/> record.
    /// </summary>
    /// <param name="label">The label text for the step.</param>
    /// <param name="status">The status of the step.</param>
    /// <param name="ariaLabel">The optional ARIA label for accessibility.</param>
    /// <param name="caption">The optional caption displayed under the step.</param>
    /// <param name="icon">The optional icon to display in place of the step number.</param>
    public StepData(string label, StepStatus status, string? ariaLabel, string? caption, SvgIcon? icon)
    {
        Label = label;
        Status = status;
        AriaLabel = ariaLabel;
        Caption = caption;
        Icon = icon;
    }
}

/// <xmldoc>
/// A component that displays a sequence of steps.
/// Child <c>Step</c> components automatically register their data with this component via the RegisterStep method.
/// </xmldoc>
public partial class Steps : RizzyComponent
{
    private static readonly string BaseStyle = "flex gap-2";

    /// <summary>
    /// Gets or sets the list of steps to display.
    /// This parameter can be supplied externally or populated automatically by child Step components.
    /// </summary>
    [Parameter]
    public List<StepData> Items { get; set; } = new List<StepData>();

    /// <summary>
    /// Gets or sets the orientation of the steps (Horizontal or Vertical).
    /// </summary>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Horizontal;

    /// <summary>
    /// Gets or sets a value indicating whether the step labels are shown.
    /// </summary>
    [Parameter]
    public bool ShowLabels { get; set; } = true;

    /// <summary>
    /// Gets or sets the ARIA label for the steps container.
    /// </summary>
    [Parameter]
    public string AriaLabel { get; set; } = "steps progress";

    /// <summary>
    /// Gets or sets the active color used for completed and current steps.
    /// </summary>
    [Parameter]
    public StatusColor ActiveColor { get; set; } = StatusColor.Primary;

    /// <summary>
    /// Gets or sets the child content containing <c>Step</c> components.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override string? RootClass() =>
        TwMerge.Merge(AdditionalAttributes, BaseStyle, OrientationCss());

    /// <summary>
    /// Returns the CSS classes for the component’s root element based on the Orientation.
    /// </summary>
    private string OrientationCss() =>
        Orientation == Orientation.Horizontal
            ? "flex w-full items-center gap-2"
            : "flex w-min flex-col gap-14";

    /// <summary>
    /// Registers a step by adding its data to the Items list.
    /// </summary>
    /// <param name="data">The step data to register.</param>
    public void RegisterStep(StepData data)
    {
        Items.Add(data);
        StateHasChanged();
    }

    /// <summary>
    /// Returns CSS classes for the connector line preceding a step.
    /// If the previous step is Completed or Current, the connector uses the active color; otherwise it uses the outline style.
    /// </summary>
    /// <param name="previousStep">The previous step data.</param>
    private string GetConnectorCss(StepData previousStep)
    {
        bool active = previousStep.Status == StepStatus.Completed || previousStep.Status == StepStatus.Current;
        
        if (Orientation == Orientation.Vertical)
	        return active ? $"absolute bottom-8 left-3 h-10 w-0.5 {GetActiveBackgroundClass()}" : "absolute bottom-8 left-3 h-10 w-0.5 bg-outline dark:bg-outline-dark";

        return active ? $"h-0.5 flex-1 mr-1 {GetActiveBackgroundClass()}" : "h-0.5 flex-1 mr-1 bg-outline dark:bg-outline-dark";
    }

    /// <summary>
    /// Returns CSS classes for a completed step’s circle.
    /// </summary>
    private string GetCompletedCircleClasses() =>
        $"{GetActiveBorderClass()} {GetActiveBackgroundClass()} {GetActiveTextClass()}";

    /// <summary>
    /// Returns CSS classes for a step’s circle based on its status.
    /// </summary>
    /// <param name="status">The step status.</param>
    private string GetStepCircleClasses(StepStatus status) => status switch
    {
        StepStatus.Current => $"border {GetActiveBorderClass()} {GetActiveBackgroundClass()} font-bold {GetActiveTextClass()} outline outline-2 outline-offset-2 outline-{ActiveColor.ToString().ToLowerInvariant()} dark:outline-{ActiveColor.ToString().ToLowerInvariant()}",
        StepStatus.Upcoming => "border border-outline bg-surface-alt font-medium text-on-surface dark:border-outline-dark dark:bg-surface-dark-alt dark:text-on-surface-dark",
        _ => "border border-outline bg-surface-alt font-medium text-on-surface dark:border-outline-dark dark:bg-surface-dark-alt dark:text-on-surface-dark"
    };

    /// <summary>
    /// Returns CSS classes for the step label based on its status.
    /// </summary>
    /// <param name="status">The step status.</param>
    private string GetLabelClasses(StepStatus status) => status switch
    {
        StepStatus.Completed => $"text-{ActiveColor.ToString().ToLowerInvariant()} dark:text-{ActiveColor.ToString().ToLowerInvariant()}-dark",
        StepStatus.Current => $"font-bold text-{ActiveColor.ToString().ToLowerInvariant()} dark:text-{ActiveColor.ToString().ToLowerInvariant()}-dark",
        StepStatus.Upcoming => "text-on-surface dark:text-on-surface-dark",
        _ => "text-on-surface dark:text-on-surface-dark"
    };

    /// <summary>
    /// Returns the active background class based on the ActiveColor.
    /// </summary>
    private string GetActiveBackgroundClass() => ActiveColor switch
    {
        StatusColor.Primary => "bg-primary dark:bg-primary-dark",
        StatusColor.Secondary => "bg-secondary dark:bg-secondary-dark",
        StatusColor.Success => "bg-success dark:bg-success",
        StatusColor.Info => "bg-info dark:bg-info",
        StatusColor.Warning => "bg-warning dark:bg-warning",
        StatusColor.Danger => "bg-danger dark:bg-danger",
        _ => "bg-primary dark:bg-primary-dark"
    };

    /// <summary>
    /// Returns the active border class based on the ActiveColor.
    /// </summary>
    private string GetActiveBorderClass() => ActiveColor switch
    {
        StatusColor.Primary => "border-primary dark:border-primary-dark",
        StatusColor.Secondary => "border-secondary dark:border-secondary-dark",
        StatusColor.Success => "border-success dark:border-success",
        StatusColor.Info => "border-info dark:border-info",
        StatusColor.Warning => "border-warning dark:border-warning",
        StatusColor.Danger => "border-danger dark:border-danger",
        _ => "border-primary dark:border-primary-dark"
    };

    /// <summary>
    /// Returns the active text class based on the ActiveColor.
    /// </summary>
    private string GetActiveTextClass() => ActiveColor switch
    {
        StatusColor.Primary => "text-on-primary dark:text-on-primary-dark",
        StatusColor.Secondary => "text-on-secondary dark:text-on-secondary-dark",
        StatusColor.Success => "text-on-success dark:text-on-success",
        StatusColor.Info => "text-onInfo dark:text-onInfo",
        StatusColor.Warning => "text-on-warning dark:text-on-warning",
        StatusColor.Danger => "text-on-danger dark:text-on-danger",
        _ => "text-on-primary dark:text-on-primary-dark"
    };

    protected override void OnAfterRender(bool firstRender)
    {
        // On first render, trigger a state update so that any registered steps are rendered.
        if (firstRender)
        {
            StateHasChanged();
        }
    }
}
