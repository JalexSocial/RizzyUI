using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Provides additional descriptive content for an alert, intended to supplement the primary alert message.
/// </summary>
public partial class AlertDescription : RizzyComponent
{
	private static readonly string BaseStyle = "text-xs font-medium sm:text-sm";

	/// <summary>
	/// Child content for the alert description
	/// </summary>
	[Parameter]
	public RenderFragment? ChildContent { get; set; }

	/// <summary>
	/// Generates the root CSS class for the alert description component, merging the base style with variant-specific styles.
	/// </summary>
	/// <returns>A string representing the combined CSS class for the alert description.</returns>
	protected override string? RootClass()
	{
		return TwMerge.Merge(AdditionalAttributes, BaseStyle);
	}
}
