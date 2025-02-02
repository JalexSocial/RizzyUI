using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

public partial class Accordion : RizzyComponent
{
	private static readonly string BaseStyle =
		"w-full divide-y divide-outline overflow-hidden rounded border border-outline " +
		"bg-surface-alt/40 text-on-surface dark:divide-outline-dark dark:border-outline-dark " +
		"dark:bg-surface-dark-alt/50 dark:text-on-surface-dark";

	/// <summary>
	/// When true, multiple sections may be open simultaneously.
	/// (Not implemented in this single‑open example.)
	/// </summary>
	[Parameter]
	public bool AllowMultipleOpen { get; set; } = false;

	/// <summary>
	/// Child content containing one or more AccordionSection components.
	/// </summary>
	[Parameter]
	public RenderFragment? ChildContent { get; set; }

	/// <inheritdoc/>
	protected override string? RootClass() =>
		TwMerge.Merge(AdditionalAttributes, BaseStyle);
}
