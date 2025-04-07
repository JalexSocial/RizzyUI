namespace RizzyUI;

/// <summary>
///     Represents a heading item with level, title, and ID.
/// </summary>
public class HeadingItem
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="HeadingItem" /> class.
    /// </summary>
    /// <param name="level">The heading level.</param>
    /// <param name="title">The title of the heading.</param>
    /// <param name="id">The unique ID of the heading element.</param>
    public HeadingItem(HeadingLevel level, string title, string id)
    {
        Level = level;
        Title = title;
        Id = id;
    }

    /// <summary>
    ///     The heading level.
    /// </summary>
    public HeadingLevel Level { get; }

    /// <summary>
    ///     The title of the heading.
    /// </summary>
    public string Title { get; }

    /// <summary>
    ///     The unique ID of the heading element.
    /// </summary>
    public string Id { get; }
}