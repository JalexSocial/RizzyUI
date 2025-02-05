using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
/// Represents a styled link component that renders an anchor element with predefined RizzyUI styling.
/// This component is designed to provide a consistent look for links using our design tokens and Tailwind CSS classes.
/// </xmldoc>
public partial class Link : RizzyComponent
{
	private static readonly string BaseStyle = "font-medium text-primary underline-offset-2 hover:underline focus:underline focus:outline-hidden dark:text-primaryDark";

	/// <xmldoc>
	/// Gets or sets the URL to which the link navigates.
	/// </xmldoc>
	[Parameter]
	public string? Href { get; set; } 

	/// <xmldoc>
	/// Gets or sets the content to be displayed inside the link.
	/// </xmldoc>
	[Parameter]
	public RenderFragment? ChildContent { get; set; }

	/// <xmldoc>
	/// Computes the final CSS class for the link by merging the base style with any additional classes provided in AdditionalAttributes.
	/// </xmldoc>
	protected override string? RootClass() =>
		TwMerge.Merge(AdditionalAttributes, BaseStyle);
}