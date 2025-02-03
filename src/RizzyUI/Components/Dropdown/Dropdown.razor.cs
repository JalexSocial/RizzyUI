using System.Security.AccessControl;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

public partial class Dropdown : RizzyComponent
{
	private static readonly string BaseStyle = ""; // No extra root-level styling

	private static readonly string BaseDropdownStyle =
        "z-10 absolute right-0 mt-2 w-64 rounded-theme shadow-xl dark:shadow-gray-900";

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

    /// <summary>
    /// Gets or sets the point on the dropdown where it attaches to the trigger
    /// </summary>
    [Parameter]
	public OriginPoint Origin { get; set; } = OriginPoint.OriginTopRight;

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
	    return TwMerge.Merge(null, BaseDropdownStyle, GetAnchorCss(Anchor), GetOriginCss(Origin));
    }

	private static string GetAnchorCss(AnchorPoint anchor)
	{
		return anchor switch
		{
			AnchorPoint.TopStart => "",
			AnchorPoint.TopCenter => "",
			AnchorPoint.TopEnd => "",
			AnchorPoint.Start => "",
			AnchorPoint.End => "",
			AnchorPoint.BottomStart => "",
			AnchorPoint.BottomCenter => "",
			AnchorPoint.BottomEnd => "",
			_ => ""
		};
	}

	/// <summary>
	/// Gets the corresponding CSS class for the given origin point.
	/// </summary>
	/// <param name="origin">The origin point.</param>
	/// <returns>The CSS class name representing the transform-origin value.</returns>
	private static string GetOriginCss(OriginPoint origin)
	{
		return origin switch
		{
			OriginPoint.OriginCenter => "origin-center",
			OriginPoint.OriginTop => "origin-top",
			OriginPoint.OriginTopRight => "origin-top-right",
			OriginPoint.OriginRight => "origin-right",
			OriginPoint.OriginBottomRight => "origin-bottom-right",
			OriginPoint.OriginBottom => "origin-bottom",
			OriginPoint.OriginBottomLeft => "origin-bottom-left",
			OriginPoint.OriginLeft => "origin-left",
			OriginPoint.OriginTopLeft => "origin-top-left",
			_ => "origin-center" // Default to center if an unknown value is provided
		};
	}


}