using System.Linq.Expressions;

namespace RizzyUI;

/// <summary>
/// Public configuration contract for <see cref="RzDataTable{TItem}"/>.
/// </summary>
/// <typeparam name="TItem">The row item type.</typeparam>
public sealed class RzDataTableConfig<TItem>
{
    /// <summary>
    /// Gets the configured table columns.
    /// </summary>
    public required IReadOnlyList<RzDataTableColumn<TItem>> Columns { get; init; } = Array.Empty<RzDataTableColumn<TItem>>();

    /// <summary>
    /// Gets the enabled feature set.
    /// </summary>
    public RzDataTableFeatures Features { get; init; } = new();

    /// <summary>
    /// Gets the initial state for sorting, filtering, pagination, visibility, and selection.
    /// </summary>
    public RzDataTableInitialState InitialState { get; init; } = new();
}

/// <summary>
/// Defines a DataTable column.
/// </summary>
/// <typeparam name="TItem">The row item type.</typeparam>
public sealed class RzDataTableColumn<TItem>
{
    /// <summary>
    /// Gets an explicit column id.
    /// </summary>
    public string? Id { get; init; }

    /// <summary>
    /// Gets a strongly-typed member accessor path used as <c>accessorKey</c>.
    /// </summary>
    public Expression<Func<TItem, object?>>? Accessor { get; init; }

    /// <summary>
    /// Gets the header text.
    /// </summary>
    public string? Header { get; init; }

    /// <summary>
    /// Gets the footer text.
    /// </summary>
    public string? Footer { get; init; }

    /// <summary>
    /// Gets the optional client-side renderer key.
    /// </summary>
    public string? CellRenderer { get; init; }

    /// <summary>
    /// Gets child columns for grouped headers.
    /// </summary>
    public IReadOnlyList<RzDataTableColumn<TItem>>? Columns { get; init; }

    /// <summary>
    /// Gets whether sorting is enabled for this column.
    /// </summary>
    public bool? EnableSorting { get; init; }

    /// <summary>
    /// Gets the TanStack sorting function key.
    /// </summary>
    public string? SortingFn { get; init; }

    /// <summary>
    /// Gets whether descending sort is preferred first.
    /// </summary>
    public bool? SortDescFirst { get; init; }

    /// <summary>
    /// Gets whether multi-sort is enabled for this column.
    /// </summary>
    public bool? EnableMultiSort { get; init; }

    /// <summary>
    /// Gets whether sorting is inverted for this column.
    /// </summary>
    public bool? InvertSorting { get; init; }

    /// <summary>
    /// Gets whether column filtering is enabled for this column.
    /// </summary>
    public bool? EnableColumnFilter { get; init; }

    /// <summary>
    /// Gets the TanStack filter function key.
    /// </summary>
    public string? FilterFn { get; init; }

    /// <summary>
    /// Gets whether global filtering is enabled for this column.
    /// </summary>
    public bool? EnableGlobalFilter { get; init; }

    /// <summary>
    /// Gets whether this column can be hidden.
    /// </summary>
    public bool? EnableHiding { get; init; }

    internal TanStackColumnConfig ToTransport()
    {
        var accessorPath = Accessor is null ? null : ExpressionPathHelper.GetPath(Accessor);

        return new TanStackColumnConfig
        {
            Id = string.IsNullOrWhiteSpace(Id) ? accessorPath : Id,
            AccessorKey = accessorPath,
            Header = Header,
            Footer = Footer,
            Cell = CellRenderer,
            Columns = Columns?.Select(x => x.ToTransport()).ToArray(),
            EnableSorting = EnableSorting,
            SortingFn = SortingFn,
            SortDescFirst = SortDescFirst,
            EnableMultiSort = EnableMultiSort,
            InvertSorting = InvertSorting,
            EnableColumnFilter = EnableColumnFilter,
            FilterFn = FilterFn,
            EnableGlobalFilter = EnableGlobalFilter,
            EnableHiding = EnableHiding,
        };
    }
}

/// <summary>
/// Defines DataTable feature flags.
/// </summary>
public sealed class RzDataTableFeatures
{
    /// <summary>
    /// Gets whether sorting is enabled.
    /// </summary>
    public bool EnableSorting { get; init; } = true;

    /// <summary>
    /// Gets whether filtering is enabled.
    /// </summary>
    public bool EnableFiltering { get; init; } = true;

    /// <summary>
    /// Gets whether column filters are enabled.
    /// </summary>
    public bool EnableColumnFilters { get; init; } = true;

    /// <summary>
    /// Gets whether global filter is enabled.
    /// </summary>
    public bool EnableGlobalFilter { get; init; } = true;

    /// <summary>
    /// Gets whether pagination is enabled.
    /// </summary>
    public bool EnablePagination { get; init; } = true;

    /// <summary>
    /// Gets whether column visibility toggling is enabled.
    /// </summary>
    public bool EnableHiding { get; init; } = true;

    /// <summary>
    /// Gets whether row selection is enabled.
    /// </summary>
    public bool EnableRowSelection { get; init; }

    /// <summary>
    /// Gets whether multi-row selection is enabled.
    /// </summary>
    public bool EnableMultiRowSelection { get; init; } = true;

    /// <summary>
    /// Gets whether sorting removal is enabled.
    /// </summary>
    public bool EnableSortingRemoval { get; init; } = true;

    /// <summary>
    /// Gets whether multi-sort is enabled.
    /// </summary>
    public bool EnableMultiSort { get; init; } = true;

    internal TanStackTableOptions ToTransport()
    {
        return new TanStackTableOptions
        {
            EnableSorting = EnableSorting,
            EnableFilters = EnableFiltering,
            EnableColumnFilters = EnableColumnFilters,
            EnableGlobalFilter = EnableGlobalFilter,
            EnableHiding = EnableHiding,
            EnableRowSelection = EnableRowSelection,
            EnableMultiRowSelection = EnableMultiRowSelection,
            EnableSortingRemoval = EnableSortingRemoval,
            EnableMultiSort = EnableMultiSort,
        };
    }

    internal TanStackRowModelPipeline ToRowModelPipeline()
    {
        return new TanStackRowModelPipeline
        {
            Core = "getCoreRowModel",
            Filtered = EnableFiltering ? "getFilteredRowModel" : null,
            Sorted = EnableSorting ? "getSortedRowModel" : null,
            Paginated = EnablePagination ? "getPaginationRowModel" : null,
        };
    }
}

/// <summary>
/// Defines the initial DataTable state.
/// </summary>
public sealed class RzDataTableInitialState
{
    /// <summary>
    /// Gets sorting entries.
    /// </summary>
    public IReadOnlyList<RzSortDescriptor>? Sorting { get; init; }

    /// <summary>
    /// Gets initial pagination state.
    /// </summary>
    public RzPaginationState? Pagination { get; init; }

    /// <summary>
    /// Gets initial column visibility.
    /// </summary>
    public Dictionary<string, bool>? ColumnVisibility { get; init; }

    /// <summary>
    /// Gets initial column filters.
    /// </summary>
    public IReadOnlyList<RzColumnFilter>? ColumnFilters { get; init; }

    /// <summary>
    /// Gets initial global filter.
    /// </summary>
    public object? GlobalFilter { get; init; }

    /// <summary>
    /// Gets initial row selection.
    /// </summary>
    public Dictionary<string, bool>? RowSelection { get; init; }

    internal TanStackTableState ToTransport()
    {
        return new TanStackTableState
        {
            Sorting = Sorting?.Select(x => new TanStackSortingEntry { Id = x.Id, Desc = x.Desc }).ToArray(),
            Pagination = Pagination is null ? null : new TanStackPaginationState { PageIndex = Pagination.PageIndex, PageSize = Pagination.PageSize },
            ColumnVisibility = ColumnVisibility,
            ColumnFilters = ColumnFilters?.Select(x => new TanStackColumnFilter { Id = x.Id, Value = x.Value }).ToArray(),
            GlobalFilter = GlobalFilter,
            RowSelection = RowSelection,
        };
    }
}

/// <summary>
/// Describes a sorting entry.
/// </summary>
public sealed class RzSortDescriptor
{
    /// <summary>
    /// Gets the column id.
    /// </summary>
    public required string Id { get; init; }

    /// <summary>
    /// Gets whether descending.
    /// </summary>
    public bool Desc { get; init; }
}

/// <summary>
/// Describes pagination state.
/// </summary>
public sealed class RzPaginationState
{
    /// <summary>
    /// Gets the page index.
    /// </summary>
    public int PageIndex { get; init; }

    /// <summary>
    /// Gets the page size.
    /// </summary>
    public int PageSize { get; init; } = 10;
}

/// <summary>
/// Describes a column filter.
/// </summary>
public sealed class RzColumnFilter
{
    /// <summary>
    /// Gets the column id.
    /// </summary>
    public required string Id { get; init; }

    /// <summary>
    /// Gets the filter value.
    /// </summary>
    public object? Value { get; init; }
}

internal static class ExpressionPathHelper
{
    public static string GetPath(LambdaExpression expression)
    {
        var members = new Stack<string>();
        Expression current = expression.Body;

        while (true)
        {
            if (current is UnaryExpression unary && (unary.NodeType == ExpressionType.Convert || unary.NodeType == ExpressionType.ConvertChecked))
            {
                current = unary.Operand;
                continue;
            }

            if (current is MemberExpression member)
            {
                members.Push(member.Member.Name);
                current = member.Expression!;
                continue;
            }

            if (current is ParameterExpression)
            {
                break;
            }

            throw new InvalidOperationException($"Expression '{expression}' must be a simple member access expression such as x => x.Id or x => x.Customer.Id.");
        }

        if (members.Count == 0)
        {
            throw new InvalidOperationException($"Expression '{expression}' did not resolve to a member path.");
        }

        return string.Join('.', members);
    }
}
