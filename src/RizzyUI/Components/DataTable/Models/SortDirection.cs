
namespace RizzyUI;

/// <summary>
/// Specifies the direction of sorting for a table column.
/// </summary>
public enum SortDirection
{
    /// <summary>
    /// No sorting is applied, or the column is not currently sorted.
    /// </summary>
    Unset,
    /// <summary>
    /// Sort in ascending order (e.g., A-Z, 0-9).
    /// </summary>
    Ascending,
    /// <summary>
    /// Sort in descending order (e.g., Z-A, 9-0).
    /// </summary>
    Descending
}