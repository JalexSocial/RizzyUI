
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

public partial class TableCell<TItem> : RzComponent<TableCellSlots>
{
    [CascadingParameter(Name = "ParentRzTable")]
    protected RzTable<TItem>? ParentRzTable { get; set; }

    [CascadingParameter(Name = "ParentTableRow")]
    protected TableRow<TItem>? ParentRzTableRow { get; set; }

    [Parameter] public RenderFragment? ChildContent { get; set; }
    [Parameter] public int? Colspan { get; set; }
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

        if (string.IsNullOrEmpty(Element))
            Element = "td";
    }

    protected override TvDescriptor<RzComponent<TableCellSlots>, TableCellSlots> GetDescriptor() => Theme.TableCell;
}