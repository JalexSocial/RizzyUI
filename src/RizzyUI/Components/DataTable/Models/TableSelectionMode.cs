
namespace RizzyUI;

/// <summary>
/// Specifies the row selection behavior for an RzTable.
/// </summary>
public enum TableSelectionMode
{
    /// <summary>
    /// Row selection is disabled.
    /// </summary>
    None,
    /// <summary>
    /// Only a single row can be selected at a time.
    /// </summary>
    Single,
    /// <summary>
    /// Multiple rows can be selected.
    /// </summary>
    Multiple
}