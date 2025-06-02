
using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents a clickable menu item within an <see cref="RzDropdownMenuSection" />.
///     Clicking this item typically closes the parent dropdown via Alpine.js.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzDropdownMenuItem : RzComponent
{
    /// <summary> Gets or sets the optional Blazicon SVG icon to display before the title. </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <summary> Gets or sets the title text of the menu item. Required. </summary>
    [Parameter]
    [EditorRequired]
    public string Title { get; set; } = "Untitled";

    /// <summary> Gets or sets an optional numeric count to display as a badge alongside the title. </summary>
    [Parameter]
    public int? Count { get; set; }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzDropdownMenuItem.MenuItem);
    }
}