using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents a table data cell (&lt;td&gt;) within an RzTable.
/// Provides basic cell functionality including content, colspan, and styling.
/// Can conditionally render a border based on the parent RzTable's Border property.
/// </summary>
public partial class RzTableCell<TItem> : RzComponent
{
    /// <summary>
    /// Cascaded parent RzTable instance. Available for context like the Border property.
    /// </summary>
    [CascadingParameter(Name = "ParentRzTable")]
    protected RzTable<TItem>? ParentRzTable { get; set; }

    /// <summary>
    /// Cascaded parent row containing this cell, if available.
    /// </summary>
    [CascadingParameter(Name = "ParentRzTableRowParentRzTableRow")]
    protected RzTableRow<TItem>? ParentRzTableRow { get; set; }

    /// <summary>
    /// The content to be rendered inside the table cell.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Optional. Specifies the number of columns this cell should span.
    /// </summary>
    [Parameter] public int? Colspan { get; set; }

    /// <summary>
    /// Optional. A key to associate this cell with a specific column, primarily for clarity
    /// or potential future features like column-specific styling from the cell itself.
    /// </summary>
    [Parameter] public string? ColumnKey { get; set; }

    /// <summary>
    /// Gets combined attributes including any passed-in AdditionalAttributes and
    /// dynamically adds colspan attribute if the Colspan parameter has a value.
    /// </summary>
    protected Dictionary<string, object> CombinedAttributes
    {
        get
        {
            var attributes = new Dictionary<string, object>(AdditionalAttributes ?? new Dictionary<string, object>());
            if (Colspan.HasValue)
            {
                attributes["colspan"] = Colspan.Value.ToString();
            }
            return attributes;
        }
    }

    /// <summary>
    /// Initializes the component by setting the HTML element to "td" and preparing base attributes.
    /// </summary>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "td";
    }

    /// <summary>
    /// Determines the CSS classes to apply to the root element by merging theme-based
    /// table cell styles with any additional class attributes and conditional border styles.
    /// </summary>
    /// <returns>A string containing the merged CSS classes.</returns>
    protected override string? RootClass()
    {
        var styles = Theme.RzTableCell;
        var classBuilder = new List<string> { styles.TableCellBase };

        if (ParentRzTable is { Border: true })
        {
            classBuilder.Add(styles.TableCellBordered);
        }

        return TwMerge.Merge(AdditionalAttributes, classBuilder.ToArray());
    }
}
