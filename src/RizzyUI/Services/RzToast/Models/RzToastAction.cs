namespace RizzyUI.Services.RzToast;

/// <summary>
/// Represents a server-safe toast action button that dispatches a browser event instead of serialized executable code.
/// </summary>
public sealed record class RzToastAction
{
    /// <summary>Gets the visible action button label.</summary>
    public required string Label { get; init; }

    /// <summary>Gets the browser event name dispatched when the action is clicked. Prefer <c>rz:</c>-namespaced event names.</summary>
    public required string EventName { get; init; }

    /// <summary>Gets the optional serializable event detail payload.</summary>
    public object? Detail { get; init; }

    /// <summary>Gets a value indicating whether the toast is dismissed after the action is clicked.</summary>
    public bool DismissOnClick { get; init; } = true;
}
