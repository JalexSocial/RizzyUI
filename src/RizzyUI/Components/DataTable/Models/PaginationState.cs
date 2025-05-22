
namespace RizzyUI;

/// <summary>
/// Represents the state of pagination for a data set.
/// </summary>
/// <param name="CurrentPage">The current page number (1-based).</param>
/// <param name="TotalPages">The total number of pages available.</param>
/// <param name="PageSize">The number of items displayed per page.</param>
/// <param name="TotalItems">The total number of items in the entire data set.</param>
public record PaginationState(int CurrentPage, int TotalPages, int PageSize, long TotalItems);