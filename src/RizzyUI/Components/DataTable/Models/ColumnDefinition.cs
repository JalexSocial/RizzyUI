
using Microsoft.AspNetCore.Components; // Required for RenderFragment
using System;
using System.Linq.Expressions;

namespace RizzyUI;

/// <summary>
/// Represents the definition of a table column, primarily used by RzTable to store
/// information about columns declared via RzTableHeaderCell.
/// </summary>
/// <typeparam name="TItem">The type of data item for the row.</typeparam>
/// <param name="Key">A unique key for the column, typically derived from the property name.</param>
/// <param name="TitleFragment">The RenderFragment for the header cell's title.</param>
/// <param name="IsSortable">Indicates if the column can be sorted.</param>
/// <param name="InitialSortDirection">The initial sort direction if the column is sortable.</param>
/// <param name="PropertyExpression">The lambda expression pointing to the TItem property this column represents. Can be null if column is not directly mapped to a property.</param>
internal record ColumnDefinition<TItem>(
    string Key,
    RenderFragment TitleFragment,
    bool IsSortable,
    SortDirection InitialSortDirection,
    Expression<Func<TItem, object?>>? PropertyExpression
);