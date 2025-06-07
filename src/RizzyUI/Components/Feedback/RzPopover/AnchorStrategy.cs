
// src/RizzyUI/Components/Feedback/RzPopover/AnchorStrategy.cs
namespace RizzyUI;

/// <summary>
/// Specifies the positioning strategy for floating elements like popovers.
/// </summary>
public enum AnchorStrategy
{
    /// <summary>
    /// Positions the element relative to its offset parent. This is the default and most common strategy.
    /// </summary>
    Absolute,

    /// <summary>
    /// Positions the element relative to the viewport. Use this when the trigger is inside a scrollable container.
    /// </summary>
    Fixed
}