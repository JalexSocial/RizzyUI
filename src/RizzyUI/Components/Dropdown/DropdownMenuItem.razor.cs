using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents a menu item within a dropdown menu.
/// When clicked, it closes the dropdown by calling the external Alpine method.
/// </summary>
public partial class DropdownMenuItem : RizzyComponent
{
	private static readonly string BaseStyle =
		"group flex items-center justify-between space-x-2 rounded-theme cursor-pointer border border-transparent " +
		"px-2.5 py-2 text-sm font-medium text-on-surface hover:bg-primary/10 hover:text-primary " +
        "focus-visible:bg-primary/10 focus-visible:text-on-surface-strong focus-visible:outline-hidden dark:text-on-surface-dark dark:hover:bg-surface-dark-alt dark:focus-visible:bg-primary/10 dark:focus-visible:text-on-surface-dark-strong";

	/// <summary>
	/// Gets or sets the icon name to be displayed in the menu item.
	/// </summary>
	[Parameter]
	public SvgIcon? Icon { get; set; }

	/// <summary>
	/// Gets or sets the title text of the menu item.
	/// </summary>
	[Parameter, EditorRequired]
	public string Title { get; set; } = "Untitled";

	/// <summary>
	/// Gets or sets an optional count to display alongside the title.
	/// </summary>
	[Parameter]
	public int? Count { get; set; }

	/// <inheritdoc/>
	protected override string? RootClass()
	{
		return TwMerge.Merge(AdditionalAttributes, BaseStyle);
	}
}