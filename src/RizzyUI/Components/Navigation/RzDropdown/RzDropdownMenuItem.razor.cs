using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents a clickable menu item within an <see cref="RzDropdownSection" />.
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

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the icon span. </summary>
    protected string IconSpanClass => Theme.RzDropdownMenuItem.IconSpan;

    /// <summary> Gets the computed CSS classes for the Blazicon component. </summary>
    protected string IconClass => Theme.RzDropdownMenuItem.Icon;

    /// <summary> Gets the computed CSS classes for the title span. </summary>
    protected string TitleSpanClass => Theme.RzDropdownMenuItem.TitleSpan;

    /// <summary> Gets the computed CSS classes for the count badge div. </summary>
    protected string CountDivClass => Theme.RzDropdownMenuItem.CountDiv;

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzDropdownMenuItem.MenuItem);
    }
}