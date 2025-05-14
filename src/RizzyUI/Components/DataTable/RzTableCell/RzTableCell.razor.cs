
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using System.Collections.Generic;

namespace RizzyUI;

/// <xmldoc>
/// Represents a table data cell (<td>) within an RzTable.
/// </xmldoc>
public partial class RzTableCell<TItem> : RzComponent 
{
    /// <summary>
    /// Cascaded parent RzTable instance. Available for context if needed, though not directly used by RzTableCell itself.
    /// </summary>
    [CascadingParameter(Name = "ParentRzTable")]
    protected RzTable<TItem>? ParentRzTable { get; set; }

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

    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "td";
    }

    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzTableCell.TableCell);
    }
}