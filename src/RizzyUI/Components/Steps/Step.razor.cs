using Blazicons;
using Microsoft.AspNetCore.Components;

namespace RizzyUI;

/// <xmldoc>
/// A component representing a single step within a Steps component.
/// Exposes parameters for Label, Status, an optional AriaLabel,
/// an optional Caption (small muted text below), and an optional Icon.
/// On initialization, it registers itself with the parent Steps component.
/// </xmldoc>
public partial class Step : RizzyComponent
{
    /// <summary>
    /// Gets or sets the label for the step.
    /// </summary>
    [Parameter, EditorRequired]
    public string Label { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the status of the step (Completed, Current, or Upcoming).
    /// </summary>
    [Parameter, EditorRequired]
    public StepStatus Status { get; set; } = StepStatus.Upcoming;

    /// <summary>
    /// Gets or sets the optional ARIA label for the step.
    /// If not provided, the Label is used.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets or sets the optional caption text that appears underneath the step.
    /// </summary>
    [Parameter]
    public string? Caption { get; set; }

    /// <summary>
    /// Gets or sets the optional icon to display in place of the step number.
    /// </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    [CascadingParameter]
    private Steps? ParentSteps { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentSteps is not null)
        {
            ParentSteps.RegisterStep(new StepData(Label, Status, AriaLabel, Caption, Icon));
        }
        else
        {
            throw new InvalidOperationException("Step must be used as a child of a Steps component.");
        }
    }
}