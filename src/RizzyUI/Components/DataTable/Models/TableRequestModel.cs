
using Microsoft.AspNetCore.Http.Extensions; // For QueryBuilder

namespace RizzyUI;

/// <summary>
/// Represents the parameters for an HTMX table request, including pagination, sorting, and filtering.
/// </summary>
public record TableRequestModel
{
    /// <summary>
    /// Free-text search query. Corresponds to the 'q' parameter.
    /// </summary>
    public string? Query { get; init; }

    /// <summary>
    /// Current page number (1-based). Corresponds to the 'page' parameter.
    /// </summary>
    public int Page { get; init; } = 1;

    /// <summary>
    /// Number of items per page. Corresponds to the 'pageSize' parameter.
    /// </summary>
    public int PageSize { get; init; } = 10;

    /// <summary>
    /// Column(s) to sort by. Can be a single column key or comma-separated for multi-column sort.
    /// Corresponds to the 'sortBy' parameter.
    /// For nested properties, use dot notation (e.g., "Category.Name") if the server-side binder supports it,
    /// or ensure your ColumnKey on RzTableHeaderCell matches what the server expects.
    /// </summary>
    public string? SortBy { get; init; }

    /// <summary>
    /// Sort direction(s) ("asc" or "desc"). Can be a single direction or comma-separated for multi-column sort,
    /// corresponding to the SortBy columns. Corresponds to the 'sortDir' parameter.
    /// </summary>
    public string? SortDir { get; init; }

    /// <summary>
    /// Column-specific filters. Keys are in the format "filter.{columnKey}".
    /// </summary>
    public Dictionary<string, string> Filters { get; init; } = new();

    /// <summary>
    /// Converts the model to a query string, excluding null/empty values and default pagination.
    /// </summary>
    /// <returns>A query string representation.</returns>
    public string ToQueryString()
    {
        var queryParams = new Dictionary<string, string?>();

        if (!string.IsNullOrWhiteSpace(Query))
            queryParams["q"] = Query;

        if (Page > 1) // Only include page if not the first page
            queryParams["page"] = Page.ToString();

        // Only include pageSize if not the default (assuming 10 is default)
        // However, it's often safer to always include pageSize if it's part of the request contract
        // For this example, let's include it if it's not the absolute common default or has been set.
        if (PageSize != 10)
            queryParams["pageSize"] = PageSize.ToString();


        if (!string.IsNullOrWhiteSpace(SortBy))
        {
            queryParams["sortBy"] = SortBy;
            if (!string.IsNullOrWhiteSpace(SortDir)) // Only include sortDir if sortBy is present
            {
                queryParams["sortDir"] = SortDir;
            }
        }

        foreach (var filter in Filters.Where(f => !string.IsNullOrWhiteSpace(f.Value)))
        {
            queryParams[filter.Key] = filter.Value;
        }

        var builder = new QueryBuilder();
        foreach (var kvp in queryParams.Where(kvp => kvp.Value != null))
        {
            builder.Add(kvp.Key, kvp.Value!);
        }
        return builder.ToQueryString().ToString();
    }

    /// <summary>
    /// Converts the model to a query string, excluding pagination parameters (page and pageSize)
    /// but including sort and filter parameters. Useful for constructing pagination links
    /// that preserve current sort/filter state.
    /// </summary>
    /// <returns>A query string representation without pagination parameters.</returns>
    public string ToQueryStringSansPage()
    {
        var queryParams = new Dictionary<string, string?>();

        if (!string.IsNullOrWhiteSpace(Query))
            queryParams["q"] = Query;

        // Page and PageSize are intentionally omitted

        if (!string.IsNullOrWhiteSpace(SortBy))
        {
            queryParams["sortBy"] = SortBy;
            if (!string.IsNullOrWhiteSpace(SortDir))
            {
                queryParams["sortDir"] = SortDir;
            }
        }

        foreach (var filter in Filters.Where(f => !string.IsNullOrWhiteSpace(f.Value)))
        {
            queryParams[filter.Key] = filter.Value;
        }

        var builder = new QueryBuilder();
        foreach (var kvp in queryParams.Where(kvp => kvp.Value != null))
        {
            builder.Add(kvp.Key, kvp.Value!);
        }
        return builder.ToQueryString().ToString();
    }
}