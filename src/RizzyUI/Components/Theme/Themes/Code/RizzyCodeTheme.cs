#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

namespace RizzyUI;

/// <summary>
/// Defines a syntax highlighting color theme for code.
/// </summary>
public class RizzyCodeTheme
{
    /// <summary>
    /// Gets the background color used for code highlighting.
    /// </summary>
    public Color Background { get; init; }

    /// <summary>
    /// Gets the default color used for code highlighting.
    /// </summary>
    public Color Color { get; init; }

    /// <summary>
    /// Gets the color used for comments.
    /// </summary>
    public Color Comment { get; init; }

    /// <summary>
    /// Gets the color used for keywords.
    /// </summary>
    public Color Keyword { get; init; }

    /// <summary>
    /// Gets the color used for attributes.
    /// </summary>
    public Color Attribute { get; init; }

    /// <summary>
    /// Gets the color used for symbols.
    /// </summary>
    public Color Symbol { get; init; }

    /// <summary>
    /// Gets the color used for namespaces.
    /// </summary>
    public Color @Namespace { get; init; }

    /// <summary>
    /// Gets the color used for variables.
    /// </summary>
    public Color Variable { get; init; }

    /// <summary>
    /// Gets the color used for literals.
    /// </summary>
    public Color Literal { get; init; }

    /// <summary>
    /// Gets the color used for punctuation.
    /// </summary>
    public Color Punctuation { get; init; }

    /// <summary>
    /// Gets the color used to indicate deletions.
    /// </summary>
    public Color Deletion { get; init; }

    /// <summary>
    /// Gets the color used to indicate additions.
    /// </summary>
    public Color Addition { get; init; }
}