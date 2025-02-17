using System.Security.AccessControl;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents a dropdown component with a customizable trigger and content area, managing its open/close state via Alpine.js.
/// </summary>
public partial class Dropdown : RizzyComponent
{
	private static readonly string BaseStyle = ""; // No extra root-level styling

	private static readonly string BaseDropdownStyle = "z-60 absolute w-64 rounded-theme shadow-xl dark:shadow-gray-900";

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
	    return TwMerge.Merge(null, BaseDropdownStyle);
    }
}