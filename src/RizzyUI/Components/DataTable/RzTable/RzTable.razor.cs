
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// A highly configurable and HTMX-interactive table component.
/// It supports generic data types, templated headers, body, and footers,
/// and integrates with HTMX for dynamic operations like sorting, pagination, and filtering.
/// This component cascades itself to child components for easy access to table-wide properties.
/// </summary>
[CascadingTypeParameter(nameof(TItem))]
public partial class RzTable<TItem> : RzComponent<RzTableSlots>, IHasTableStylingProperties
{
    private readonly List<ColumnDefinition<TItem>> _columnDefinitions = new();
    private string? _tableBodyIdInternal;
    private bool _hasRegisteredBody = false;

    internal string? TableBodyIdInternal
    {
        get => _tableBodyIdInternal;
        private set => _tableBodyIdInternal = value;
    }

    internal void RegisterTableBodyId(string tableBodyId)
    {
        if (_hasRegisteredBody && TableBodyIdInternal != tableBodyId)
        {
            throw new InvalidOperationException($"An RzTableBody with ID '{TableBodyIdInternal}' is already registered with this RzTable. Only one RzTableBody is allowed.");
        }

        TableBodyIdInternal = tableBodyId;
        _hasRegisteredBody = true;
    }

    /// <summary>
    /// Gets the effective CSS selector for HTMX `hx-target` attributes.
    /// It prioritizes the user-provided <see cref="HxTargetSelector"/>, then the ID of a registered <see cref="TableBody{TItem}"/>,
    /// and finally falls back to a data attribute selector based on this table's ID.
    /// </summary>
    public string EffectiveHxTargetSelector =>
        HxTargetSelector ??
        (!string.IsNullOrEmpty(TableBodyIdInternal) ? $"#{TableBodyIdInternal}" : $"[data-rztable-body-for='{Id}']");

    /// <summary>
    /// Gets or sets the collection of items to be displayed in the table. This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired] public IEnumerable<TItem> Items { get; set; } = Enumerable.Empty<TItem>();

    /// <summary>
    /// Gets or sets the base URL for HTMX requests (e.g., sorting, pagination).
    /// </summary>
    [Parameter] public string? HxControllerUrl { get; set; }

    /// <summary>
    /// Gets or sets the current state of the table request, including sorting, filtering, and pagination info.
    /// </summary>
    [Parameter] public TableRequestModel CurrentTableRequest { get; set; } = new();

    /// <summary>
    /// Gets or sets the current pagination state of the table, including total items and page count.
    /// </summary>
    [Parameter] public PaginationState CurrentPaginationState { get; set; } = new(1, 0, 10, 0);

    /// <summary>
    /// Gets or sets a specific CSS selector for the `hx-target` attribute, overriding the default behavior.
    /// </summary>
    [Parameter] public string? HxTargetSelector { get; set; }

    /// <summary>
    /// Gets or sets the HTMX swap mode (e.g., "innerHTML", "outerHTML"). Defaults to "innerHTML".
    /// </summary>
    [Parameter] public string HxSwapMode { get; set; } = "innerHTML";

    /// <summary>
    /// Gets or sets the CSS selector for an element to be shown as a loading indicator during HTMX requests.
    /// </summary>
    [Parameter] public string? HxIndicatorSelector { get; set; }

    /// <summary>
    /// Gets or sets the render fragment for the table's header section (`&lt;thead&gt;`). This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment<RzTable<TItem>>? Header { get; set; }

    /// <summary>
    /// Gets or sets the render fragment for the table's body section (`&lt;tbody&gt;`). This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment<RzTable<TItem>>? Body { get; set; }

    /// <summary>
    /// Gets or sets the render fragment for the table's footer section (`&lt;tfoot&gt;`).
    /// </summary>
    [Parameter] public RenderFragment<RzTable<TItem>>? Footer { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether to apply striped styling to table rows. Defaults to false.
    /// </summary>
    [Parameter] public bool Striped { get; set; } = false;

    /// <summary>
    /// Gets or sets a value indicating whether rows should have a hover effect. Defaults to true.
    /// </summary>
    [Parameter] public bool Hoverable { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether the table should have a border. Defaults to false.
    /// </summary>
    [Parameter] public bool Border { get; set; } = false;

    /// <summary>
    /// Gets or sets the row selection mode for the table. Defaults to <see cref="TableSelectionMode.None"/>.
    /// </summary>
    [Parameter] public TableSelectionMode SelectionMode { get; set; } = TableSelectionMode.None;

    /// <summary>
    /// Gets or sets an event callback that is invoked when the selected items change.
    /// </summary>
    [Parameter] public EventCallback<List<TItem>> SelectedItemsChanged { get; set; }

    /// <summary>
    /// Gets or sets the list of currently selected items in the table.
    /// </summary>
    [Parameter] public List<TItem> SelectedItems { get; set; } = new();

    /// <summary>
    /// Gets or sets a value indicating whether the table header should remain fixed while scrolling. Defaults to false.
    /// </summary>
    [Parameter] public bool FixedHeader { get; set; } = false;

    /// <summary>
    /// Gets or sets the CSS height class for the table body when <see cref="FixedHeader"/> is true. Defaults to "h-96".
    /// </summary>
    [Parameter] public string TableBodyHeightClass { get; set; } = "h-96";

    /// <summary>
    /// Gets the unique ID for the inner `&lt;table&gt;` element.
    /// </summary>
    public string TableId => $"{Id}-table";

    /// <summary>
    /// Gets the unique ID for the `&lt;thead&gt;` element.
    /// </summary>
    public string TableHeaderId => $"{Id}-table-head";

    /// <summary>
    /// Gets the unique ID for the `&lt;tfoot&gt;` element.
    /// </summary>
    public string TableFooterId => $"{Id}-table-foot";

    internal void AddColumnDefinition(ColumnDefinition<TItem> columnDefinition)
    {
        if (!_columnDefinitions.Any(cd => cd.Key == columnDefinition.Key))
        {
            _columnDefinitions.Add(columnDefinition);
            StateHasChanged();
        }
    }

    internal IReadOnlyList<ColumnDefinition<TItem>> GetColumnDefinitions() => _columnDefinitions.AsReadOnly();

    /// <summary>
    /// Gets the total number of columns defined in the table.
    /// </summary>
    public int ColumnCount => _columnDefinitions.Count > 0 ? _columnDefinitions.Count : 1;

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (FixedHeader)
        {
            AdditionalAttributes ??= new Dictionary<string, object>();
            if (AdditionalAttributes.TryGetValue("class", out var existingClass))
            {
                AdditionalAttributes["class"] = $"{existingClass} {TableBodyHeightClass}";
            }
            else
            {
                AdditionalAttributes["class"] = TableBodyHeightClass;
            }
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<RzTableSlots>, RzTableSlots> GetDescriptor() => Theme.RzTable;
}
