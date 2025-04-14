using System.Text.Json.Serialization;
using RizzyUI; // Assuming enums are in this namespace

namespace RizzyUI;

/// <summary>
/// Represents a complete simple-notify toast message, including content (Title, Text),
/// status, and optional configuration settings inherited from <see cref="ToastMessageOptions"/>.
/// Create instances using object initializers or the 'with' expression.
/// </summary>
public sealed record class ToastMessage : ToastMessageOptions
{
	/// <summary>
	/// The type/status of the notification (e.g., success, error).
	/// Determines the styling. Defaults to <see cref="ToastStatus.Info"/> if not set.
	/// </summary>
	[JsonPropertyName("status")]
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)] // Default is Info
	public ToastStatus Status { get; init; } = ToastStatus.Info; // Non-nullable, defaults to Info

	/// <summary>
	/// The main title text of the notification.
	/// If not provided, the <see cref="ToastService"/> may provide a default based on the <see cref="Status"/>.
	/// </summary>
	[JsonPropertyName("title")]
	[JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
	public string? Title { get; init; } // Nullable, service handles default if needed

	/// <summary>
	/// The secondary/body text of the notification. Required.
	/// </summary>
	[JsonPropertyName("text")]
	public required string Text { get; init; } // Make Text required, no default empty string
}