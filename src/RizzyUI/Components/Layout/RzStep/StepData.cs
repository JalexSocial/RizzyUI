using Blazicons;

namespace RizzyUI;

/// <xmldoc>
///     Represents the data for a single step.
/// </xmldoc>
public record StepData
{
	/// <summary>
	///     Initializes a new instance of the <see cref="StepData" /> record.
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

	/// <summary>
	///     Gets the label text for the step.
	/// </summary>
	public string Label { get; init; }

	/// <summary>
	///     Gets the status of the step (Completed, Current, or Upcoming).
	/// </summary>
	public StepStatus Status { get; init; }

	/// <summary>
	///     Gets the optional ARIA label for accessibility. If not provided, the Label is used.
	/// </summary>
	public string? AriaLabel { get; init; }

	/// <summary>
	///     Gets the optional caption text (a small muted text displayed under the step).
	/// </summary>
	public string? Caption { get; init; }

	/// <summary>
	///     Gets the optional icon to display instead of the step number.
	/// </summary>
	public SvgIcon? Icon { get; init; }
}