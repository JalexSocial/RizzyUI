
using Blazicons;
using Microsoft.AspNetCore.Components;

namespace RizzyUI;

/// <xmldoc>
///     Represents the data definition for a single step within an <see cref="RzSteps" /> component.
///     This component registers its parameters with the parent <see cref="RzSteps" /> component during initialization.
///     It does not render any HTML directly; the parent <see cref="RzSteps" /> component is responsible for rendering
///     based on the collected data.
/// </xmldoc>
public class RzStep : ComponentBase // Doesn't need RzComponent base as it renders nothing itself
{
    /// <summary> Gets or sets the main text label describing the step. Required. </summary>
    [Parameter][EditorRequired] public string Label { get; set; } = string.Empty;

    /// <summary> Gets or sets the current status of the step (Completed, Current, or Upcoming). Required. </summary>
    [Parameter][EditorRequired] public StepStatus Status { get; set; } = StepStatus.Upcoming;

    /// <summary>
    ///     Gets or sets an optional ARIA label for the step, providing more context for accessibility. If not provided,
    ///     the <see cref="Label" /> is typically used by the parent component.
    /// </summary>
    [Parameter] public string? AriaLabel { get; set; }

    /// <summary>
    ///     Gets or sets optional caption text displayed below the step label (rendered by the parent
    ///     <see cref="RzSteps" /> component).
    /// </summary>
    [Parameter] public string? Caption { get; set; }

    /// <summary>
    ///     Gets or sets an optional Blazicon SVG icon to display within the step indicator instead of a number or
    ///     checkmark.
    /// </summary>
    [Parameter] public SvgIcon? Icon { get; set; }

    /// <summary> Gets the parent <see cref="RzSteps" /> component via cascading parameter. </summary>
    [CascadingParameter] private RzSteps? ParentSteps { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentSteps is not null)
            // Create the StepData record from parameters and register it with the parent
            ParentSteps.RegisterStep(new StepData(Label, Status, AriaLabel, Caption, Icon));
        else
            // Ensure the component is used correctly within the hierarchy
            throw new InvalidOperationException(
                $"{nameof(RzStep)} must be used as a child of an {nameof(RzSteps)} component.");
    }
}