
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

public interface IHasTableRowStylingProperties
{
    public bool IsEven { get; }
    public bool IsHoverable { get; }
}

[CascadingTypeParameter(nameof(TItem))]
public partial class TableRow<TItem> : RzComponent<TableRowSlots>, IHasTableRowStylingProperties
{
    [CascadingParameter(Name = "ParentRzTable")]
    protected RzTable<TItem>? ParentRzTable { get; set; }

    [CascadingParameter(Name = "RowIndex")]
    protected int? RowIndex { get; set; }

    [Parameter] public TItem? Item { get; set; }
    [Parameter] public RenderFragment? ChildContent { get; set; }

    public bool IsEven => ParentRzTable?.Striped == true && RowIndex.HasValue && RowIndex.Value % 2 != 0;
    public bool IsHoverable => ParentRzTable?.Hoverable ?? false;

    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "tr";

        if (ParentRzTable != null)
        {
            Id = $"{ParentRzTable.TableBodyIdInternal}-row";

            if (RowIndex != null)
                Id += "-" + RowIndex;
            else
            {
                Id = IdGenerator.UniqueId(Id);
            }
        }
    }

    protected override TvDescriptor<RzComponent<TableRowSlots>, TableRowSlots> GetDescriptor() => Theme.TableRow;
}