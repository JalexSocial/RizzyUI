
namespace RizzyUI;

/// <summary>
/// Specifies the position of an RzIndicator relative to its conceptual parent or anchor point.
/// Mirrors the options available in AnchorPoint.
/// </summary>
public enum IndicatorPosition
{
    /// <summary>
    /// Position at the top-start (e.g., top-left).
    /// </summary>
    TopStart,

    /// <summary>
    /// Position at the top, centered horizontally.
    /// </summary>
    Top,

    /// <summary>
    /// Position at the top-end (e.g., top-right). This is often the default for status indicators.
    /// </summary>
    TopEnd,

    /// <summary>
    /// Position at the left-start (e.g., top-left, vertically aligned).
    /// </summary>
    LeftStart,

    /// <summary>
    /// Position at the left, centered vertically.
    /// </summary>
    Left,

    /// <summary>
    /// Position at the left-end (e.g., bottom-left, vertically aligned).
    /// </summary>
    LeftEnd,

    /// <summary>
    /// Position at the right-start (e.g., top-right, vertically aligned).
    /// </summary>
    RightStart,

    /// <summary>
    /// Position at the right, centered vertically.
    /// </summary>
    Right,

    /// <summary>
    /// Position at the right-end (e.g., bottom-right, vertically aligned).
    /// </summary>
    RightEnd,

    /// <summary>
    /// Position at the bottom-start (e.g., bottom-left).
    /// </summary>
    BottomStart,

    /// <summary>
    /// Position at the bottom, centered horizontally.
    /// </summary>
    Bottom,

    /// <summary>
    /// Position at the bottom-end (e.g., bottom-right).
    /// </summary>
    BottomEnd,
    
    /// <summary>
    /// Position in the center of its conceptual parent.
    /// </summary>
    Center
}