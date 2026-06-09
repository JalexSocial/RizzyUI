namespace RizzyUI.Services.RzToast;

/// <summary>
/// Represents serializable toast options shared by server-side show and update commands.
/// </summary>
public record class RzToastOptions
{
    /// <summary>Gets the stable client-side toast id.</summary>
    public string? Id { get; init; }

    /// <summary>Gets the toast stack position.</summary>
    public ToastPosition? Position { get; init; }

    /// <summary>Gets the visual tone.</summary>
    public ToastTone? Tone { get; init; }

    /// <summary>Gets the animation preset.</summary>
    public ToastAnimation? Animation { get; init; }

    /// <summary>Gets the display duration in milliseconds. Must be greater than or equal to zero when supplied.</summary>
    public int? Duration { get; init; }

    /// <summary>Gets the animation speed in milliseconds. Must be greater than or equal to zero when supplied.</summary>
    public int? Speed { get; init; }

    /// <summary>Gets a value indicating whether the toast closes automatically.</summary>
    public bool? AutoClose { get; init; }

    /// <summary>Gets a value indicating whether the toast renders a close button.</summary>
    public bool? Dismissible { get; init; }

    /// <summary>Gets a value indicating whether the status icon is shown.</summary>
    public bool? ShowIcon { get; init; }

    /// <summary>Gets a value indicating whether the progress indicator is shown.</summary>
    public bool? Progress { get; init; }

    /// <summary>Gets a value indicating whether timers pause while hovered.</summary>
    public bool? PauseOnHover { get; init; }

    /// <summary>Gets a value indicating whether timers pause while focus is inside the toast.</summary>
    public bool? PauseOnFocus { get; init; }

    /// <summary>Gets a value indicating whether timers pause while the browser window is blurred.</summary>
    public bool? PauseOnWindowBlur { get; init; }

    /// <summary>Gets a value indicating whether Escape dismisses the toast while focus is inside it.</summary>
    public bool? CloseOnEscape { get; init; }

    /// <summary>Gets a value indicating whether duplicate toast requests should be prevented.</summary>
    public bool? PreventDuplicates { get; init; }

    /// <summary>Gets the deduplication key used by the client runtime.</summary>
    public string? DedupeKey { get; init; }

    /// <summary>Gets a value indicating whether duplicate updates increment the toast count.</summary>
    public bool? IncrementCount { get; init; }

    /// <summary>Gets the maximum visible toasts in the target stack. Must be greater than or equal to zero when supplied.</summary>
    public int? MaxVisible { get; init; }

    /// <summary>Gets a value indicating whether newer toasts are inserted before older toasts.</summary>
    public bool? NewestOnTop { get; init; }

    /// <summary>Gets the overflow strategy for a full stack.</summary>
    public ToastOverflowStrategy? OverflowStrategy { get; init; }

    /// <summary>Gets a custom class applied to the toast root.</summary>
    public string? CustomClass { get; init; }

    /// <summary>Gets slot-specific class names keyed by JavaScript toast slot name.</summary>
    public IReadOnlyDictionary<string, string>? ClassNames { get; init; }

    /// <summary>Gets the ARIA role for the toast root.</summary>
    public string? Role { get; init; }

    /// <summary>Gets the aria-live politeness setting.</summary>
    public string? AriaLive { get; init; }

    /// <summary>Gets application-defined serializable data carried through toast lifecycle events.</summary>
    public object? Data { get; init; }

    /// <summary>Gets a server-safe action button definition that dispatches a browser event.</summary>
    public RzToastAction? Action { get; init; }
}
