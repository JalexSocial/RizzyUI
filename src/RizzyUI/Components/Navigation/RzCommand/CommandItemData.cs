
namespace RizzyUI;

/// <summary>
/// A default implementation of the <see cref="ICommandItemData"/> interface.
/// </summary>
public class CommandItemData : ICommandItemData
{
    /// <inheritdoc />
    public string Value { get; set; } = string.Empty;

    /// <inheritdoc />
    public string Name { get; set; } = string.Empty;

    /// <inheritdoc />
    public string? Shortcut { get; set; }

    /// <inheritdoc />
    public IEnumerable<string>? Keywords { get; set; }

    /// <inheritdoc />
    public string? Group { get; set; }

    /// <inheritdoc />
    public bool Disabled { get; set; }

    /// <inheritdoc />
    public bool ForceMount { get; set; }
}