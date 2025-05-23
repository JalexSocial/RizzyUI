#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider adding the 'required' modifier or declaring as nullable.

namespace RizzyUI;

/// <summary>
///     Defines a syntax highlighting color theme for code.
/// </summary>
public class RizzyCodeTheme
{
    /// <summary>
    ///     Initialize theme
    /// </summary>
    /// <param name="background"></param>
    /// <param name="color"></param>
    /// <param name="comment"></param>
    /// <param name="keyword"></param>
    /// <param name="attribute"></param>
    /// <param name="symbol"></param>
    /// <param name="nameSpace"></param>
    /// <param name="variable"></param>
    /// <param name="literal"></param>
    /// <param name="punctuation"></param>
    /// <param name="deletion"></param>
    /// <param name="addition"></param>
    public RizzyCodeTheme(
        string background,
        string color,
        string comment,
        string keyword,
        string attribute,
        string symbol,
        string nameSpace,
        string variable,
        string literal,
        string punctuation,
        string deletion,
        string addition)
    {
        Background = new Color(background);
        Color = new Color(color);
        Comment = new Color(comment);
        Keyword = new Color(keyword);
        Attribute = new Color(attribute);
        Symbol = new Color(symbol);
        Namespace = new Color(nameSpace);
        Variable = new Color(variable);
        Literal = new Color(literal);
        Punctuation = new Color(punctuation);
        Deletion = new Color(deletion);
        Addition = new Color(addition);
    }

    /// <summary>
    ///     Gets the background color used for code highlighting.
    /// </summary>
    public Color Background { get; init; }

    /// <summary>
    ///     Gets the default color used for code highlighting.
    /// </summary>
    public Color Color { get; init; }

    /// <summary>
    ///     Gets the color used for comments.
    /// </summary>
    public Color Comment { get; init; }

    /// <summary>
    ///     Gets the color used for keywords.
    /// </summary>
    public Color Keyword { get; init; }

    /// <summary>
    ///     Gets the color used for attributes.
    /// </summary>
    public Color Attribute { get; init; }

    /// <summary>
    ///     Gets the color used for symbols.
    /// </summary>
    public Color Symbol { get; init; }

    /// <summary>
    ///     Gets the color used for namespaces.
    /// </summary>
    public Color Namespace { get; init; }

    /// <summary>
    ///     Gets the color used for variables.
    /// </summary>
    public Color Variable { get; init; }

    /// <summary>
    ///     Gets the color used for literals.
    /// </summary>
    public Color Literal { get; init; }

    /// <summary>
    ///     Gets the color used for punctuation.
    /// </summary>
    public Color Punctuation { get; init; }

    /// <summary>
    ///     Gets the color used to indicate deletions.
    /// </summary>
    public Color Deletion { get; init; }

    /// <summary>
    ///     Gets the color used to indicate additions.
    /// </summary>
    public Color Addition { get; init; }
}