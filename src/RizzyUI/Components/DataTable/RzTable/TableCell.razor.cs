
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a single cell (`&lt;td&gt;`) within a <see cref="TableRow{TItem}"/>.
/// </summary>
/// <typeparam name="TItem">The type of data item for the row.</typeparam>
public partial class TableCell<TItem> : RzComponent<TableCellSlots>
{
    /// <summary>
    /// Gets or sets the parent <see cref="RzTable{TItem}"/> component.
    /// </summary>
    [CascadingParameter(Name = "ParentRzTable")]
    protected RzTable<TItem>? ParentRzTable { get; set; }

    /// <summary>
    /// Gets or sets the parent <see cref="TableRow{TItem}"/> component.
    /// </summary>
    [CascadingParameter(Name = "ParentTableRow")]
    protected TableRow<TItem>? ParentRzTableRow { get; set; }

    /// <summary>
    /// Gets or sets the content to be rendered inside the cell.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the number of columns this cell should span.
    /// </summary>
    [Parameter] public int? Colspan { get; set; }

    /// <summary>
    /// Gets or sets a unique key for the column, used for identification.
    /// </summary>
    [Parameter] public string? ColumnKey { get; set; }

    /// <summary>
    /// Gets the combined attributes for the cell, including any `colspan`.
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

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "td";
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<TableCellSlots>, TableCellSlots> GetDescriptor() => Theme.TableCell;
}