namespace RizzyUI.Services.RzToast;

/// <summary>
/// Represents a flat server-side toast show request compatible with <c>Rizzy.toast.show(options)</c>.
/// </summary>
public sealed record class RzToastMessage : RzToastOptions
{
    /// <summary>Gets the toast status. Defaults to <see cref="ToastStatus.Default"/>.</summary>
    public ToastStatus Status { get; init; } = ToastStatus.Default;

    /// <summary>Gets the optional toast title.</summary>
    public string? Title { get; init; }

    /// <summary>Gets the optional toast body text.</summary>
    public string? Text { get; init; }
}
