using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a single cell (<c>td</c>) within a table row.
/// </summary>
public partial class TableCell : RzComponent<TableCellSlots>
{
    /// <summary>
    /// Gets or sets the content to be rendered inside the cell.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the number of columns this cell should span.
    /// </summary>
    [Parameter] public int? Colspan { get; set; }

    /// <summary>
    /// Gets the combined attributes for the cell, including any <c>colspan</c>.
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
