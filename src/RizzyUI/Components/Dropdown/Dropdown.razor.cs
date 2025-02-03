using System.Security.AccessControl;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

public partial class Dropdown : RizzyComponent
{
	private static readonly string BaseStyle = ""; // No extra root-level styling

	private static readonly string BaseDropdownStyle =
        "z-10 absolute w-64 rounded-theme shadow-xl dark:shadow-gray-900";

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

    /// <summary>
    /// Gets or sets the point on the trigger where the dropdown attaches
    /// </summary>
	[Parameter]
	public AnchorPoint Anchor { get; set; } = AnchorPoint.BottomCenter;

    /// <inheritdoc/>
    protected override string? RootClass()
	{
		// Use TwMerge.Merge to combine any additional attributes with BaseStyle.
		return TwMerge.Merge(AdditionalAttributes, BaseStyle);
	}

    /// <summary>
    /// Builds css for dropdown based on anchor position
    /// </summary>
    /// <returns></returns>
    private string? DropdownClass()
    {
	    return TwMerge.Merge(null, BaseDropdownStyle, GetAnchorCss(Anchor));
    }

	private static string GetAnchorCss(AnchorPoint anchor)
	{
		return anchor switch
		{
			AnchorPoint.TopStart => "bottom-full right-full mb-2 origin-bottom-right",
			AnchorPoint.TopCenter => "left-1/2 bottom-full transform -translate-x-1/2 mb-2 origin-bottom",
			AnchorPoint.TopEnd => "bottom-full left-full mb-2 origin-bottom-left",
			AnchorPoint.Start => "right-full top-1/2 -translate-y-1/2 me-2 origin-right",
			AnchorPoint.End => "left-full top-1/2 -translate-y-1/2 ms-2 origin-left",
			AnchorPoint.BottomStart => "right-full mt-2 origin-top-right",
			AnchorPoint.BottomCenter => "-translate-x-1/2 mt-2 origin-top",
			AnchorPoint.BottomEnd => "left-full mt-2 origin-top-left",
			_ => ""
		};
	}
}