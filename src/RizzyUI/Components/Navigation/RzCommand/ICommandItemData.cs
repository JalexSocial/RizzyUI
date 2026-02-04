
namespace RizzyUI;

/// <summary>
/// Defines the contract for a command item that can be supplied as data to an RzCommand component.
/// </summary>
public interface ICommandItemData
{
    /// <summary>
    /// The unique value of the item, used for filtering and selection.
    /// </summary>
    string Value { get; set; }

    /// <summary>
    /// The name of the item, used for presentation.
    /// </summary>
    string Name { get; set; }

    /// <summary>
    /// The shortcut of the item, used for presentation.
    /// </summary>
    string? Shortcut { get; set; }

    /// <summary>
    /// A list of additional keywords to match against during search.
    /// </summary>
    IEnumerable<string>? Keywords { get; set; }

    /// <summary>
    /// The heading of the group this item belongs to.
    /// </summary>
    string? Group { get; set; }

    /// <summary>
    /// If true, the item cannot be selected.
    /// </summary>
    bool Disabled { get; set; }

    /// <summary>
    /// If true, the item will always be rendered, regardless of the search query.
    /// </summary>
    bool ForceMount { get; set; }
}