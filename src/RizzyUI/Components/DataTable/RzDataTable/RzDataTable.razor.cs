using Microsoft.AspNetCore.Components;
using System.Linq.Expressions;
using System.Text.Json;
using System.Text.Json.Serialization;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// SSR-first generic shell component that hosts TanStack Table state and Alpine runtime hydration.
/// </summary>
/// <typeparam name="TItem">The row item type.</typeparam>
public partial class RzDataTable<TItem> : RzComponent<RzDataTableSlots>, IHasRzDataTableStylingProperties
{
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    private string _configJson = "{}";
    private string _assets = "[]";

    /// <summary>
    /// Gets or sets source data items.
    /// </summary>
    [Parameter, EditorRequired]
    public IReadOnlyList<TItem> Items { get; set; } = Array.Empty<TItem>();

    /// <summary>
    /// Gets or sets DataTable configuration.
    /// </summary>
    [Parameter, EditorRequired]
    public RzDataTableConfig<TItem> Config { get; set; } = default!;

    /// <summary>
    /// Gets or sets the strongly typed selector used to derive a stable row id path.
    /// </summary>
    [Parameter, EditorRequired]
    public Expression<Func<TItem, object?>> RowIdSelector { get; set; } = default!;

    /// <summary>
    /// Gets or sets child content authored by the consumer.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets the inert JSON script id consumed by the Alpine runtime.
    /// </summary>
    protected string ConfigScriptId => $"{Id}-config";

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        Validate();
        var normalizedColumns = NormalizeColumns(Config.Columns);
        EnsureUniqueRowIds();

        var normalizedConfig = new RzDataTableConfig<TItem>
        {
            Columns = normalizedColumns,
            Features = Config.Features,
            InitialState = Config.InitialState,
        };

        var transport = RzDataTableTransportBuilder.Build(Items, normalizedConfig, RowIdSelector);
        _configJson = JsonSerializer.Serialize(transport, _jsonOptions);

        _assets = JsonSerializer.Serialize(Array.Empty<string>(), _jsonOptions);
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<RzDataTableSlots>, RzDataTableSlots> GetDescriptor() => Theme.RzDataTable;

    private void Validate()
    {
        if (Items is null)
        {
            throw new InvalidOperationException($"{GetType()} requires a non-null '{nameof(Items)}' parameter.");
        }

        if (Config is null)
        {
            throw new InvalidOperationException($"{GetType()} requires a non-null '{nameof(Config)}' parameter.");
        }

        if (RowIdSelector is null)
        {
            throw new InvalidOperationException($"{GetType()} requires a non-null '{nameof(RowIdSelector)}' parameter.");
        }

        if (Config.Columns is null || Config.Columns.Count == 0)
        {
            throw new InvalidOperationException($"{GetType()} requires at least one column in '{nameof(Config)}.{nameof(Config.Columns)}'.");
        }
    }

    private void EnsureUniqueRowIds()
    {
        var rowIdPath = ExpressionPathHelper.GetPath(RowIdSelector);
        var duplicate = Items
            .GroupBy(item => ResolvePathValue(item, rowIdPath))
            .FirstOrDefault(group => group.Count() > 1);

        if (duplicate is not null)
        {
            throw new InvalidOperationException($"{GetType()} detected duplicate row ids from '{rowIdPath}'. Row ids must be unique.");
        }
    }

    private static object? ResolvePathValue(TItem item, string path)
    {
        object? current = item;
        foreach (var segment in path.Split('.'))
        {
            if (current is null)
            {
                return null;
            }

            var property = current.GetType().GetProperty(segment);
            if (property is null)
            {
                throw new InvalidOperationException($"Row id path segment '{segment}' was not found on '{current.GetType().Name}'.");
            }

            current = property.GetValue(current);
        }

        return current;
    }

    private static IReadOnlyList<RzDataTableColumn<TItem>> NormalizeColumns(IReadOnlyList<RzDataTableColumn<TItem>> columns)
    {
        var result = new List<RzDataTableColumn<TItem>>();
        var ids = new HashSet<string>(StringComparer.Ordinal);

        foreach (var column in columns)
        {
            result.Add(NormalizeColumn(column, ids));
        }

        return result;
    }

    private static RzDataTableColumn<TItem> NormalizeColumn(RzDataTableColumn<TItem> column, ISet<string> ids)
    {
        var hasChildren = column.Columns is { Count: > 0 };
        var accessorPath = column.Accessor is null ? null : ExpressionPathHelper.GetPath(column.Accessor);
        var normalizedId = string.IsNullOrWhiteSpace(column.Id) ? accessorPath : column.Id;

        if (!hasChildren && string.IsNullOrWhiteSpace(normalizedId))
        {
            throw new InvalidOperationException("Leaf columns must define either Id or Accessor.");
        }

        if (hasChildren)
        {
            var children = new List<RzDataTableColumn<TItem>>();
            foreach (var child in column.Columns!)
            {
                children.Add(NormalizeColumn(child, ids));
            }

            return new RzDataTableColumn<TItem>
            {
                Id = normalizedId,
                Accessor = column.Accessor,
                Header = column.Header,
                Footer = column.Footer,
                CellRenderer = column.CellRenderer,
                Columns = children,
                EnableSorting = column.EnableSorting,
                SortingFn = column.SortingFn,
                SortDescFirst = column.SortDescFirst,
                EnableMultiSort = column.EnableMultiSort,
                InvertSorting = column.InvertSorting,
                EnableColumnFilter = column.EnableColumnFilter,
                FilterFn = column.FilterFn,
                EnableGlobalFilter = column.EnableGlobalFilter,
                EnableHiding = column.EnableHiding,
            };
        }

        if (!ids.Add(normalizedId!))
        {
            throw new InvalidOperationException($"Duplicate column id '{normalizedId}' is not allowed.");
        }

        return new RzDataTableColumn<TItem>
        {
            Id = normalizedId,
            Accessor = column.Accessor,
            Header = column.Header,
            Footer = column.Footer,
            CellRenderer = column.CellRenderer,
            Columns = column.Columns,
            EnableSorting = column.EnableSorting,
            SortingFn = column.SortingFn,
            SortDescFirst = column.SortDescFirst,
            EnableMultiSort = column.EnableMultiSort,
            InvertSorting = column.InvertSorting,
            EnableColumnFilter = column.EnableColumnFilter,
            FilterFn = column.FilterFn,
            EnableGlobalFilter = column.EnableGlobalFilter,
            EnableHiding = column.EnableHiding,
        };
    }
}
