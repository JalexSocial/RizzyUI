
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a TableRow component.
/// </summary>
public interface IHasTableRowStylingProperties
{
    /// <summary>
    /// Gets a value indicating whether the row is even-numbered, for striped styling.
    /// </summary>
    public bool IsEven { get; }
    /// <summary>
    /// Gets a value indicating whether the row should have a hover effect.
    /// </summary>
    public bool IsHoverable { get; }
}

/// <summary>
/// Represents a single row (`&lt;tr&gt;`) within an <see cref="RzTable{TItem}"/>.
/// </summary>
/// <typeparam name="TItem">The type of data item for the row.</typeparam>
[CascadingTypeParameter(nameof(TItem))]
public partial class TableRow<TItem> : RzComponent<TableRowSlots>, IHasTableRowStylingProperties
{
    /// <summary>
    /// Gets or sets the parent <see cref="RzTable{TItem}"/> component.
    /// </summary>
    [CascadingParameter(Name = "ParentRzTable")]
    protected RzTable<TItem>? ParentRzTable { get; set; }

    /// <summary>
    /// Gets or sets the zero-based index of the row within the current page.
    /// </summary>
    [CascadingParameter(Name = "RowIndex")]
    protected int? RowIndex { get; set; }

    /// <summary>
    /// Gets or sets the data item associated with this row.
    /// </summary>
    [Parameter] public TItem? Item { get; set; }

    /// <summary>
    /// Gets or sets the content of the row, typically a series of <see cref="TableCell{TItem}"/> components.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets a value indicating whether the row is even, for applying striped styling.
    /// </summary>
    public bool IsEven => ParentRzTable?.Striped == true && RowIndex.HasValue && RowIndex.Value % 2 != 0;

    /// <summary>
    /// Gets a value indicating whether the row should have a hover effect.
    /// </summary>
    public bool IsHoverable => ParentRzTable?.Hoverable ?? false;

    /// <inheritdoc/>
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

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<TableRowSlots>, TableRowSlots> GetDescriptor() => Theme.TableRow;
}