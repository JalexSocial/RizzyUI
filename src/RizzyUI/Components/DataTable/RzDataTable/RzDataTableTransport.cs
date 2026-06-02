using System.Linq.Expressions;

namespace RizzyUI;

internal sealed class TanStackTableTransport<TItem>
{
    public required IReadOnlyList<TItem> Data { get; init; }

    public required IReadOnlyList<TanStackColumnConfig> Columns { get; init; }

    public required TanStackTableState InitialState { get; init; }

    public required TanStackTableOptions Options { get; init; }

    public required TanStackRowModelPipeline RowModelPipeline { get; init; }

    public required TanStackRowStructure RowStructure { get; init; }
}

internal sealed class TanStackColumnConfig
{
    public string? Id { get; init; }

    public string? AccessorKey { get; init; }

    public string? Header { get; init; }

    public string? Footer { get; init; }

    public string? Cell { get; init; }

    public IReadOnlyList<TanStackColumnConfig>? Columns { get; init; }

    public bool? EnableSorting { get; init; }

    public string? SortingFn { get; init; }

    public bool? SortDescFirst { get; init; }

    public bool? EnableMultiSort { get; init; }

    public bool? InvertSorting { get; init; }

    public bool? EnableColumnFilter { get; init; }

    public string? FilterFn { get; init; }

    public bool? EnableGlobalFilter { get; init; }

    public bool? EnableHiding { get; init; }
}

internal sealed class TanStackTableOptions
{
    public bool EnableSorting { get; init; }

    public bool EnableFilters { get; init; }

    public bool EnableColumnFilters { get; init; }

    public bool EnableGlobalFilter { get; init; }

    public bool EnableHiding { get; init; }

    public bool EnableRowSelection { get; init; }

    public bool EnableMultiRowSelection { get; init; }

    public bool EnableSortingRemoval { get; init; }

    public bool EnableMultiSort { get; init; }
}

internal sealed class TanStackRowModelPipeline
{
    public required string Core { get; init; }

    public string? Filtered { get; init; }

    public string? Sorted { get; init; }

    public string? Paginated { get; init; }
}

internal sealed class TanStackRowStructure
{
    public required string RowIdPath { get; init; }
}

internal sealed class TanStackTableState
{
    public IReadOnlyList<TanStackSortingEntry>? Sorting { get; init; }

    public TanStackPaginationState? Pagination { get; init; }

    public Dictionary<string, bool>? ColumnVisibility { get; init; }

    public IReadOnlyList<TanStackColumnFilter>? ColumnFilters { get; init; }

    public object? GlobalFilter { get; init; }

    public Dictionary<string, bool>? RowSelection { get; init; }
}

internal sealed class TanStackSortingEntry
{
    public required string Id { get; init; }

    public bool Desc { get; init; }
}

internal sealed class TanStackPaginationState
{
    public int PageIndex { get; init; }

    public int PageSize { get; init; }
}

internal sealed class TanStackColumnFilter
{
    public required string Id { get; init; }

    public object? Value { get; init; }
}

internal static class RzDataTableTransportBuilder
{
    public static TanStackTableTransport<TItem> Build<TItem>(
        IReadOnlyList<TItem> items,
        RzDataTableConfig<TItem> config,
        Expression<Func<TItem, object?>> rowIdSelector)
    {
        return new TanStackTableTransport<TItem>
        {
            Data = items,
            Columns = config.Columns.Select(x => x.ToTransport()).ToArray(),
            InitialState = config.InitialState.ToTransport(),
            Options = config.Features.ToTransport(),
            RowModelPipeline = config.Features.ToRowModelPipeline(),
            RowStructure = new TanStackRowStructure
            {
                RowIdPath = ExpressionPathHelper.GetPath(rowIdSelector),
            },
        };
    }
}
