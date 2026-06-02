namespace RizzyUI;

/// <summary>
/// Controls which rows are affected by a data-table selection operation.
/// </summary>
public enum DataTableSelectionScope
{
    /// <summary>
    /// Only rows on the currently rendered or active page are affected.
    /// </summary>
    Page,

    /// <summary>
    /// All rows represented by the current table result or query are affected, including rows not currently visible on the active page.
    /// </summary>
    All
}
