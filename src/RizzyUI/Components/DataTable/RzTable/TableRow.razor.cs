using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a table row component.
/// </summary>
public interface IHasTableRowStylingProperties
{
    /// <summary>
    /// Gets whether hover styling should be applied.
    /// </summary>
    public bool Hoverable { get; }

    /// <summary>
    /// Gets whether selected styling should be applied.
    /// </summary>
    public bool IsSelected { get; }
}

/// <summary>
/// Represents a table row (<c>tr</c>).
/// </summary>
public partial class TableRow : RzComponent<TableRowSlots>, IHasTableRowStylingProperties
{
    /// <summary>
    /// Gets or sets the row content.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether this row should be marked as selected.
    /// </summary>
    [Parameter] public bool Selected { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether hover styling should be applied.
    /// </summary>
    [Parameter] public bool? HoverableOverride { get; set; }

    /// <summary>
    /// Gets or sets the parent table component.
    /// </summary>
    [CascadingParameter(Name = "ParentRzTable")]
    protected RzTable? ParentRzTable { get; set; }

    /// <summary>
    /// Gets whether hover styling should be applied.
    /// </summary>
    public bool Hoverable => HoverableOverride ?? true;

    /// <summary>
    /// Gets whether selected styling should be applied.
    /// </summary>
    public bool IsSelected => Selected;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
        {
            Element = "tr";
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<TableRowSlots>, TableRowSlots> GetDescriptor() => Theme.TableRow;
}
