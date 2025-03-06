using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
/// Represents a search button that displays an icon and a text label. The label is configurable and is used for both the visible text
/// and the aria-label to ensure accessibility.
/// </xmldoc>
public partial class SearchButton : RizzyComponent
{
	private static readonly string BaseStyle = "btn-search flex h-10 w-full cursor-pointer items-center justify-between border-outline bg-surface-alt p-2 px-4 font-light transition-all duration-200   rounded-theme border";

	/// <xmldoc>
	/// Gets or sets the text label for the search button. This label is used for both the button’s visible text and the aria-label.
	/// </xmldoc>
	[Parameter]
	public string Label { get; set; } = "Search";

	/// <xmldoc>
	/// Computes the final CSS class for the search button by merging any additional attributes with the BaseStyle.
	/// </xmldoc>
	protected override string? RootClass() => TwMerge.Merge(AdditionalAttributes, BaseStyle);
}