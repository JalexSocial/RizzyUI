using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a TableFooter component.
/// </summary>
public interface IHasTableFooterStylingProperties
{
    /// <summary>
    /// Gets a value indicating whether the table header is fixed.
    /// </summary>
    public bool FixedHeader { get; }
}

/// <summary>
/// Represents the footer (`&lt;tfoot&gt;`) section of an <see cref="RzTable{TItem}"/>.
/// </summary>
public partial class TableFooter : RzComponent<TableFooterSlots>, IHasTableFooterStylingProperties
{
    /// <summary>
    /// Gets or sets the parent table component.
    /// </summary>
    [CascadingParameter(Name = "ParentRzTable")]
    protected object? ParentRzTable { get; set; }

    /// <summary>
    /// Gets or sets the footer content, typically one or more <see cref="TableCell{TItem}"/> components.
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets a value indicating whether fixed-header styling should be applied.
    /// </summary>
    public bool FixedHeader => ParentRzTable is IHasTableStylingProperties table && table.FixedHeader;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (ParentRzTable == null)
            throw new InvalidOperationException($"{GetType().Name} must be used within an RzTable.");

        if (string.IsNullOrEmpty(Element))
            Element = "tfoot";
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<TableFooterSlots>, TableFooterSlots> GetDescriptor() => Theme.TableFooter;
}
