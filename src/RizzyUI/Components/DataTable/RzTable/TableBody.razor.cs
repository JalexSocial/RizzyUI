
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents the body (`&lt;tbody&gt;`) of an <see cref="RzTable{TItem}"/>, responsible for rendering rows of data.
/// </summary>
/// <typeparam name="TItem">The type of data item for each row.</typeparam>
public partial class TableBody<TItem> : RzComponent<TableBodySlots>
{
    /// <summary>
    /// Gets or sets the parent <see cref="RzTable{TItem}"/> component.
    /// </summary>
    [CascadingParameter(Name = "ParentRzTable")]
    protected RzTable<TItem>? ParentRzTable { get; set; }

    /// <summary>
    /// Gets or sets the collection of items to render. If not provided, it falls back to the items from the parent <see cref="RzTable{TItem}"/>.
    /// </summary>
    [Parameter] public IEnumerable<TItem>? Items { get; set; }

    /// <summary>
    /// Gets or sets the template for rendering each row. This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment<TItem> RowTemplate { get; set; } = default!;

    /// <summary>
    /// Gets or sets the template to display when there are no items to render.
    /// </summary>
    [Parameter] public RenderFragment? EmptyTemplate { get; set; }

    /// <summary>
    /// Gets the effective collection of items to be rendered.
    /// </summary>
    protected IEnumerable<TItem> EffectiveItems => Items ?? ParentRzTable?.Items ?? Enumerable.Empty<TItem>();

    /// <summary>
    /// Gets the number of columns in the table, used for colspan in the empty template.
    /// </summary>
    protected int ColumnCount => ParentRzTable?.ColumnCount ?? 1;

    /// <summary>
    /// Gets the unique ID for the loading spinner element.
    /// </summary>
    protected string SpinnerId => $"{Id}-spinner";

    /// <summary>
    /// Gets the effective CSS selector for the HTMX loading indicator.
    /// </summary>
    protected string? EffectiveHxIndicatorSelector
    {
        get
        {
            if (AdditionalAttributes?.TryGetValue("hx-indicator", out var indicator) == true && indicator is string indicatorStr)
            {
                return indicatorStr;
            }
            return ParentRzTable?.HxIndicatorSelector ?? $"#{SpinnerId}";
        }
    }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "tbody";

        if (ParentRzTable == null)
        {
            throw new InvalidOperationException($"{GetType().Name} must be used within an RzTable.");
        }
        ParentRzTable.RegisterTableBodyId(Id);

        AdditionalAttributes ??= new Dictionary<string, object>();
        AdditionalAttributes[$"data-rztable-body-for"] = ParentRzTable.Id;
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<TableBodySlots>, TableBodySlots> GetDescriptor() => Theme.TableBody;
}