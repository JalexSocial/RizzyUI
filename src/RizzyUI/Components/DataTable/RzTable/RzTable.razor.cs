using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A highly configurable and HTMX-interactive table component.
/// It supports generic data types, templated headers, body, and footers,
/// and integrates with HTMX for dynamic operations like sorting, pagination, and filtering.
/// This component cascades itself to child components for easy access to table-wide properties.
/// </summary>
[CascadingTypeParameter(nameof(TItem))]
public partial class RzTable<TItem> : RzComponent
{
    private readonly List<ColumnDefinition<TItem>> _columnDefinitions = new();
    private string? _tableBodyIdInternal;
    private bool _hasRegisteredBody = false;

    /// <summary>
    /// Internal property to store the ID of the RzTableBody.
    /// This is set by RzTableBody upon its initialization.
    /// </summary>
    internal string? TableBodyIdInternal
    {
        get => _tableBodyIdInternal;
        private set => _tableBodyIdInternal = value;
    }

    /// <summary>
    /// Registers the ID of the RzTableBody component.
    /// Called by RzTableBody during its initialization.
    /// </summary>
    /// <param name="tableBodyId">The ID of the RzTableBody.</param>
    internal void RegisterTableBodyId(string tableBodyId)
    {
        if (_hasRegisteredBody && TableBodyIdInternal != tableBodyId)
        {
            // This situation should ideally not happen if RzTableBody is used correctly (only one instance).
        }

        if (_hasRegisteredBody && TableBodyIdInternal != tableBodyId)
        {
            throw new InvalidOperationException($"An RzTableBody with ID '{TableBodyIdInternal}' is already registered with this RzTable. Only one RzTableBody is allowed.");
        }

        TableBodyIdInternal = tableBodyId;
        _hasRegisteredBody = true;
    }

    /// <summary>
    /// Gets the effectively resolved HTMX target selector for child components.
    /// Prioritizes HxTargetSelector parameter, then the registered TableBodyIdInternal,
    /// then falls back to a data-attribute selector convention linked to this RzTable's Id.
    /// </summary>
    public string EffectiveHxTargetSelector =>
        HxTargetSelector ??
        (!string.IsNullOrEmpty(TableBodyIdInternal) ? $"#{TableBodyIdInternal}" : $"[data-rztable-body-for='{Id}']");

    /// <summary>
    /// The collection of items to display in the table.
    /// For initial render or full Blazor re-renders.
    /// </summary>
    [Parameter, EditorRequired] public IEnumerable<TItem> Items { get; set; } = Enumerable.Empty<TItem>();

    /// <summary>
    /// The base URL for HTMX interactions (sorting, pagination, filtering).
    /// Child components like RzTableHeaderCell and RzPagination will use this
    /// to construct their HTMX request URLs.
    /// </summary>
    [Parameter, EditorRequired] public string HxControllerUrl { get; set; } = string.Empty;

    /// <summary>
    /// Represents the current request state of the table (e.g., sort order, page number, filters).
    /// This is typically bound from the parent component and updated based on server responses.
    /// </summary>
    [Parameter] public TableRequestModel CurrentTableRequest { get; set; } = new();

    /// <summary>
    /// Holds the current pagination state details (current page, total pages, etc.)
    /// received from the server.
    /// </summary>
    [Parameter] public PaginationState CurrentPaginationState { get; set; } = new(1, 0, 10, 0);

    /// <summary>
    /// Optional CSS selector for the default target of HTMX actions initiated by child components
    /// (e.g., sort headers, pagination links). If not set, it defaults to targeting the
    /// RzTableBody via its registered ID or a data-attribute fallback.
    /// </summary>
    [Parameter] public string? HxTargetSelector { get; set; }

    /// <summary>
    /// Optional default hx-swap mode for child-initiated HTMX actions (e.g., "innerHTML", "beforeend").
    /// Defaults to "innerHTML".
    /// </summary>
    [Parameter] public string HxSwapMode { get; set; } = "innerHTML";

    /// <summary>
    /// Optional default hx-indicator selector for child-initiated HTMX actions.
    /// If not set, RzTableBody will use its internal default spinner.
    /// </summary>
    [Parameter] public string? HxIndicatorSelector { get; set; }

    /// <summary>
    /// Defines the content for the table's header (&lt;thead&gt;).
    /// Typically contains one or more &lt;see cref="RzTableHeaderCell{TItem}"/&gt; components.
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment<RzTable<TItem>>? Header { get; set; }

    /// <summary>
    /// Defines the content for the table's body (&lt;tbody&gt;).
    /// This should be an &lt;see cref="RzTableBody{TItem}"/&gt; component.
    /// </summary>
    [Parameter, EditorRequired] public RenderFragment<RzTable<TItem>>? Body { get; set; }

    /// <summary>
    /// Optional. Defines the content for the table's footer (&lt;tfoot&gt;).
    /// Often used for pagination controls or summary information.
    /// </summary>
    [Parameter] public RenderFragment<RzTable<TItem>>? Footer { get; set; }

    /// <summary>
    /// If true, applies alternating background colors to table rows. Defaults to false.
    /// </summary>
    [Parameter] public bool Striped { get; set; } = false;

    /// <summary>
    /// If true, applies hover styling to table rows. Defaults to true.
    /// </summary>
    [Parameter] public bool Hoverable { get; set; } = true;

    /// <summary>
    /// If true, applies borders to table cells (td and th). Defaults to false.
    /// </summary>
    [Parameter] public bool Border { get; set; } = false;

    /// <summary>
    /// [Future V2] Specifies the row selection mode. Defaults to None.
    /// </summary>
    [Parameter] public TableSelectionMode SelectionMode { get; set; } = TableSelectionMode.None;

    /// <summary>
    /// [Future V2] Callback for when row selection changes.
    /// </summary>
    [Parameter] public EventCallback<List<TItem>> SelectedItemsChanged { get; set; }

    /// <summary>
    /// [Future V2] The currently selected items if SelectionMode is not None.
    /// </summary>
    [Parameter] public List<TItem> SelectedItems { get; set; } = new();

    /// <summary>
    /// If true, the table header and footer (if present) will remain fixed while the table body scrolls.
    /// Defaults to false.
    /// </summary>
    [Parameter] public bool FixedHeader { get; set; } = false;

    /// <summary>
    /// The CSS class(es) to define the height of the scrollable table body when FixedHeader is true.
    /// Defaults to "h-96" (Tailwind class for height: 24rem).
    /// </summary>
    [Parameter] public string TableBodyHeightClass { get; set; } = "h-96";

    /// <summary>
    /// Id of the table element. This is used for HTMX interactions.
    /// </summary>
    public string TableId => $"{Id}-table";

    /// <summary>
    /// Id of the table head element. This is used for HTMX interactions.
    /// </summary>
    public string TableHeaderId => $"{Id}-table-head";

    /// <summary>
    /// Id of the table footer element. This is used for HTMX interactions.
    /// </summary>
    public string TableFooterId => $"{Id}-table-foot";

    /// <summary>
    /// Adds a column definition to the table's internal collection of columns.
    /// This is called by RzTableHeaderCell components during their initialization.
    /// </summary>
    /// <param name="columnDefinition">The column definition to add.</param>
    internal void AddColumnDefinition(ColumnDefinition<TItem> columnDefinition)
    {
        if (!_columnDefinitions.Any(cd => cd.Key == columnDefinition.Key))
        {
            _columnDefinitions.Add(columnDefinition);
            StateHasChanged();
        }
    }

    /// <summary>
    /// Returns a read-only list of all column definitions registered with this table.
    /// This allows other components to access column metadata without modifying the collection.
    /// </summary>
    /// <returns>A read-only list of column definitions.</returns>
    internal IReadOnlyList<ColumnDefinition<TItem>> GetColumnDefinitions() => _columnDefinitions.AsReadOnly();

    /// <summary>
    /// Gets the count of defined columns. Returns 1 if no columns are explicitly defined,
    /// to ensure colspans in templates like EmptyTemplate work correctly.
    /// </summary>
    public int ColumnCount => _columnDefinitions.Count > 0 ? _columnDefinitions.Count : 1;

    /// <summary>
    /// Determines the CSS classes to apply to the root container element by merging theme-based
    /// table container styles with any additional class attributes.
    /// </summary>
    /// <returns>A string containing the merged CSS classes.</returns>
    protected override string? RootClass()
    {
        var classes = new List<string> { Theme.RzTable.Container };
        if (FixedHeader)
        {
            // Apply the specific height class to the main container for fixed header scenarios
            classes.Add(Theme.RzTable.FixedHeaderContainer);
            classes.Add(TableBodyHeightClass); // User-defined or default height for the scrollable area
        }
        return TwMerge.Merge(AdditionalAttributes, classes.ToArray());
    }
}
