namespace RizzyUI;

/// <summary>
/// Defines the server-side defaults emitted by <see cref="RzToastProvider"/> for the toast runtime.
/// </summary>
public sealed record RzToastProviderOptions
{
    /// <summary>Gets or sets the default toast position.</summary>
    public ToastPosition Position { get; init; } = ToastPosition.TopRight;

    /// <summary>Gets or sets the default toast status.</summary>
    public ToastStatus DefaultStatus { get; init; } = ToastStatus.Info;

    /// <summary>Gets or sets the default toast tone.</summary>
    public ToastTone Tone { get; init; } = ToastTone.Subtle;

    /// <summary>Gets or sets the default animation preset.</summary>
    public ToastAnimation Animation { get; init; } = ToastAnimation.Fade;

    /// <summary>Gets or sets the overflow strategy used by each stack.</summary>
    public ToastOverflowStrategy OverflowStrategy { get; init; } = ToastOverflowStrategy.DismissOldest;

    /// <summary>Gets or sets the default auto-dismiss duration in milliseconds.</summary>
    public int Duration { get; init; } = 4000;

    /// <summary>Gets or sets the transition speed in milliseconds.</summary>
    public int Speed { get; init; } = 300;

    /// <summary>Gets or sets the maximum visible toast count per position stack.</summary>
    public int MaxVisible { get; init; } = 5;

    /// <summary>Gets or sets whether new toasts are inserted at the top of their stack.</summary>
    public bool NewestOnTop { get; init; } = true;

    /// <summary>Gets or sets whether toasts render a close button by default.</summary>
    public bool Dismissible { get; init; } = true;

    /// <summary>Gets or sets whether status icons are shown by default.</summary>
    public bool ShowIcon { get; init; } = true;

    /// <summary>Gets or sets whether progress indicators are shown by default.</summary>
    public bool ShowProgress { get; init; } = true;

    /// <summary>Gets or sets whether timers pause while the toast is hovered.</summary>
    public bool PauseOnHover { get; init; } = true;

    /// <summary>Gets or sets whether timers pause while focus is inside a toast.</summary>
    public bool PauseOnFocus { get; init; } = true;

    /// <summary>Gets or sets whether timers pause while the browser window is blurred.</summary>
    public bool PauseOnWindowBlur { get; init; }

    /// <summary>Gets or sets whether Escape can dismiss a focused toast.</summary>
    public bool CloseOnEscape { get; init; } = true;

    /// <summary>Gets or sets whether duplicate toast requests are prevented.</summary>
    public bool PreventDuplicates { get; init; }

    /// <summary>Gets or sets the localized aria-label emitted for toast close buttons.</summary>
    public string? CloseButtonAriaLabel { get; init; }

    /// <summary>Gets or sets the localized aria-label emitted for the provider region.</summary>
    public string? RegionAriaLabel { get; init; }
}
