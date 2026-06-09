namespace RizzyUI.Services.RzToast;

/// <summary>
/// Represents supplied fields for a toast update command.
/// </summary>
/// <remarks>
/// Null values mean the caller did not supply the field and are omitted from transport. Use an empty string to intentionally clear an existing title or text.
/// </remarks>
public sealed record class RzToastUpdate : RzToastOptions
{
    /// <summary>Gets the new status when supplied.</summary>
    public ToastStatus? Status { get; init; }

    /// <summary>Gets the new title when supplied. Empty string clears the title.</summary>
    public string? Title { get; init; }

    /// <summary>Gets the new body text when supplied. Empty string clears the text.</summary>
    public string? Text { get; init; }
}
