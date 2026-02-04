
// src/RizzyUI/Components/Layout/RzItem/ItemVariant.cs
namespace RizzyUI;

/// <summary>
/// Specifies the visual variant for an RzItem.
/// </summary>
public enum ItemVariant
{
    /// <summary>
    /// Default transparent background.
    /// </summary>
    Default,
    /// <summary>
    /// A visible border.
    /// </summary>
    Outline,
    /// <summary>
    /// A muted background color.
    /// </summary>
    Muted
}

/// <summary>
/// Specifies the visual variant for an ItemMedia component.
/// </summary>
public enum ItemMediaVariant
{
    /// <summary>
    /// Default styling, typically for custom content.
    /// </summary>
    Default,
    /// <summary>
    /// Styled for containing an icon.
    /// </summary>
    Icon,
    /// <summary>
    /// Styled for containing an image.
    /// </summary>
    Image
}