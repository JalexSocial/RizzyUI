using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a TableHeader component.
/// </summary>
public interface IHasTableHeaderStylingProperties
{
    /// <summary>
    /// Gets a value indicating whether the table header is fixed.
    /// </summary>
    public bool FixedHeader { get; }
}

/// <summary>
/// Represents the header (`&lt;thead&gt;`) section of an <see cref="RzTable{TItem}"/>.
/// </summary>
public partial class TableHeader : RzComponent<TableHeaderSlots>, IHasTableHeaderStylingProperties
{
    /// <summary>
    /// Gets or sets the parent table component.
    /// </summary>
    [CascadingParameter(Name = "ParentRzTable")]
    protected object? ParentRzTable { get; set; }

    /// <summary>
    /// Gets or sets the header content, typically one or more <see cref="TableHeaderCell{TItem}"/> components.
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
            Element = "thead";
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<TableHeaderSlots>, TableHeaderSlots> GetDescriptor() => Theme.TableHeader;
}
