
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
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

    public string EffectiveHxTargetSelector =>
        HxTargetSelector ??
        (!string.IsNullOrEmpty(TableBodyIdInternal) ? $"#{TableBodyIdInternal}" : $"[data-rztable-body-for='{Id}']");

    [Parameter, EditorRequired] public IEnumerable<TItem> Items { get; set; } = Enumerable.Empty<TItem>();
    [Parameter, EditorRequired] public string HxControllerUrl { get; set; } = string.Empty;
    [Parameter] public TableRequestModel CurrentTableRequest { get; set; } = new();
    [Parameter] public PaginationState CurrentPaginationState { get; set; } = new(1, 0, 10, 0);
    [Parameter] public string? HxTargetSelector { get; set; }
    [Parameter] public string HxSwapMode { get; set; } = "innerHTML";
    [Parameter] public string? HxIndicatorSelector { get; set; }
    [Parameter, EditorRequired] public RenderFragment<RzTable<TItem>>? Header { get; set; }
    [Parameter, EditorRequired] public RenderFragment<RzTable<TItem>>? Body { get; set; }
    [Parameter] public RenderFragment<RzTable<TItem>>? Footer { get; set; }
    [Parameter] public bool Striped { get; set; } = false;
    [Parameter] public bool Hoverable { get; set; } = true;
    [Parameter] public bool Border { get; set; } = false;
    [Parameter] public TableSelectionMode SelectionMode { get; set; } = TableSelectionMode.None;
    [Parameter] public EventCallback<List<TItem>> SelectedItemsChanged { get; set; }
    [Parameter] public List<TItem> SelectedItems { get; set; } = new();
    [Parameter] public bool FixedHeader { get; set; } = false;
    [Parameter] public string TableBodyHeightClass { get; set; } = "h-96";

    public string TableId => $"{Id}-table";
    public string TableHeaderId => $"{Id}-table-head";
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

    public int ColumnCount => _columnDefinitions.Count > 0 ? _columnDefinitions.Count : 1;

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

    protected override TvDescriptor<RzComponent<RzTableSlots>, RzTableSlots> GetDescriptor() => Theme.RzTable;
}