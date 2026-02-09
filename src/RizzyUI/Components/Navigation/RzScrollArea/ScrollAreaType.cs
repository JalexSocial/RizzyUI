namespace RizzyUI;

/// <summary>
/// Controls visibility behavior for scrollbars in <see cref="RzScrollArea"/>.
/// </summary>
public enum ScrollAreaType
{
    /// <summary>
    /// Scrollbars appear only while hovering the scroll area.
    /// </summary>
    Hover,

    /// <summary>
    /// Scrollbars are always visible.
    /// </summary>
    Always,

    /// <summary>
    /// Scrollbars are visible while actively scrolling.
    /// </summary>
    Scroll,

    /// <summary>
    /// Scrollbars are visible only when overflow exists.
    /// </summary>
    Auto
}
