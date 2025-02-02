namespace RizzyUI;

using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

/// <summary>
/// A container component used to group related dropdown menu items.
/// </summary>
public partial class DropdownSection : RizzyComponent
{
	private static readonly string BaseStyle = "space-y-1 p-2.5";

	/// <summary>
	/// Gets or sets the child content for this dropdown section.
	/// </summary>
	[Parameter]
	public RenderFragment? ChildContent { get; set; }

	/// <inheritdoc/>
	protected override string? RootClass()
	{
		return TwMerge.Merge(AdditionalAttributes, BaseStyle);
	}
}