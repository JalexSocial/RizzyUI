namespace RizzyUI;

/// <summary>
/// Defines the semantic status used to style and announce a toast notification.
/// </summary>
public enum ToastStatus
{
    /// <summary>Uses the neutral default toast treatment.</summary>
    Default,

    /// <summary>Indicates informational content.</summary>
    Info,

    /// <summary>Indicates successful completion of an operation.</summary>
    Success,

    /// <summary>Indicates content that needs attention but is not destructive.</summary>
    Warning,

    /// <summary>Indicates an error or destructive outcome.</summary>
    Error,

    /// <summary>Indicates that an operation is currently in progress.</summary>
    Loading
}

/// <summary>
/// Defines the canonical screen position for toast stacks.
/// </summary>
public enum ToastPosition
{
    /// <summary>Places toasts at the top-left edge of the viewport.</summary>
    TopLeft,

    /// <summary>Places toasts at the top-center of the viewport.</summary>
    TopCenter,

    /// <summary>Places toasts at the top-right edge of the viewport.</summary>
    TopRight,

    /// <summary>Places toasts at the bottom-left edge of the viewport.</summary>
    BottomLeft,

    /// <summary>Places toasts at the bottom-center of the viewport.</summary>
    BottomCenter,

    /// <summary>Places toasts at the bottom-right edge of the viewport.</summary>
    BottomRight,

    /// <summary>Places toasts in the center of the viewport.</summary>
    Center,

    /// <summary>Places toasts at the vertical center of the left edge.</summary>
    LeftCenter,

    /// <summary>Places toasts at the vertical center of the right edge.</summary>
    RightCenter
}

/// <summary>
/// Defines the visual tone used by toast notifications.
/// </summary>
public enum ToastTone
{
    /// <summary>Uses a soft tinted background with semantic accents.</summary>
    Subtle,

    /// <summary>Uses a filled semantic treatment.</summary>
    Solid,

    /// <summary>Uses an outlined treatment over the background surface.</summary>
    Outline,

    /// <summary>Uses a lower-emphasis surface with a transparent border.</summary>
    Ghost
}

/// <summary>
/// Defines the animation preset applied to toast notifications.
/// </summary>
public enum ToastAnimation
{
    /// <summary>Uses opacity-based transitions.</summary>
    Fade,

    /// <summary>Uses opacity and transform transitions.</summary>
    Slide,

    /// <summary>Disables transition classes for toast state changes.</summary>
    None
}

/// <summary>
/// Defines the lifecycle state used to resolve toast item classes.
/// </summary>
public enum ToastState
{
    /// <summary>The toast is entering the viewport.</summary>
    Entering,

    /// <summary>The toast is visible and settled.</summary>
    Visible,

    /// <summary>The toast is leaving the viewport.</summary>
    Leaving
}

/// <summary>
/// Defines how a toast stack behaves when the maximum visible toast count is reached.
/// </summary>
public enum ToastOverflowStrategy
{
    /// <summary>Dismisses the oldest toast in the target stack before inserting a new toast.</summary>
    DismissOldest,

    /// <summary>Ignores the newest toast request when the target stack is full.</summary>
    IgnoreNewest
}
