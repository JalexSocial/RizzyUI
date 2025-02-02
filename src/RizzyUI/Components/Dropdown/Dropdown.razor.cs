using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

public partial class Dropdown : RizzyComponent
{
	private static readonly string BaseStyle = ""; // No extra root-level styling

	/// <summary>
	/// Gets or sets the render fragment that defines the dropdown trigger.
	/// </summary>
	[Parameter, EditorRequired]
	public RenderFragment? Trigger { get; set; }

	/// <summary>
	/// Gets or sets the render fragment that defines the dropdown content.
	/// </summary>
	[Parameter, EditorRequired]
	public RenderFragment? Content { get; set; }

	/// <inheritdoc/>
	protected override string? RootClass()
	{
		// Use TwMerge.Merge to combine any additional attributes with BaseStyle.
		return TwMerge.Merge(AdditionalAttributes, BaseStyle);
	}
}