using System.Text.Json.Serialization; 

namespace RizzyUI;

/// <summary>
/// Represents the configuration for a simple-notify toast message.
/// This model can be serialized to JSON and sent to the client-side JavaScript library.
/// </summary>
public sealed class ToastMessage
{
    /// <summary>
    /// Initializes a new instance of the <see cref="ToastMessage"/> class with default settings.
    /// </summary>
    public ToastMessage() { }

    /// <summary>
    /// Initializes a new instance of the <see cref="ToastMessage"/> class using the specified text, title, and status.
    /// Other properties will use their default values.
    /// </summary>
    /// <param name="text">The main body text of the notification.</param>
    /// <param name="title">
    /// The title text of the notification. If <c>null</c>, a default title based on the status will be used.
    /// </param>
    /// <param name="status">The notification status (default is <see cref="ToastStatus.Info"/>).</param>
    public ToastMessage(string text, string? title = null, ToastStatus status = ToastStatus.Info)
    {
        Text = text;
        Status = status;
        Title = title ?? GetDefaultTitle(status); // Use default title if null passed
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="ToastMessage"/> class using the specified text and status.
    /// A default title based on the status will be used.
    /// </summary>
    /// <param name="text">The main body text of the notification.</param>
    /// <param name="status">The notification status.</param>
    public ToastMessage(string text, ToastStatus status)
    {
        Text = text;
        Status = status;
        Title = GetDefaultTitle(status); // Use default title based on status
    }
    
    /// <summary>
    /// The type/status of the notification (e.g., success, error).
    /// Determines the styling.
    /// Defaults to <see cref="ToastStatus.Info"/>.
    /// </summary>
    [JsonPropertyName("status")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public ToastStatus? Status { get; set; } = ToastStatus.Info;

    /// <summary>
    /// The main title text of the notification.
    /// Defaults to a status-specific title (e.g., 'Info').
    /// </summary>
    [JsonPropertyName("title")]
    public string Title { get; set; } = GetDefaultTitle(ToastStatus.Info);

    /// <summary>
    /// The secondary/body text of the notification.
    /// Defaults to an empty string.
    /// </summary>
    [JsonPropertyName("text")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Text { get; set; } = string.Empty;

    /// <summary>
    /// Custom HTML string for the icon area. Overrides default icon if `ShowIcon` is true.
    /// Defaults to null.
    /// </summary>
    [JsonPropertyName("customIcon")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? CustomIcon { get; set; } = null;
    
    /// <summary>
    /// Custom CSS class name(s) to add to the notification container.
    /// Defaults to null.
    /// </summary>
    [JsonPropertyName("customClass")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? CustomClass { get; set; } = null;
    
    /// <summary>
    /// The visual effect used for showing/hiding the notification.
    /// Defaults to <see cref="ToastEffect.Fade"/>.
    /// </summary>
    [JsonPropertyName("effect")]
    public ToastEffect Effect { get; set; } = ToastEffect.Fade;

    /// <summary>
    /// The duration of the show/hide effect animation in milliseconds.
    /// Defaults to 300.
    /// </summary>
    [JsonPropertyName("speed")]
    public int Speed { get; set; } = 300;

    /// <summary>
    /// Whether to display the default status icon.
    /// Defaults to true. Use JsonIgnore to only send if different from default.
    /// </summary>
    [JsonPropertyName("showIcon")]
    public bool ShowIcon { get; set; } = true;

    /// <summary>
    /// Whether to display the close button.
    /// Defaults to true. Use JsonIgnore to only send if different from default.
    /// </summary>
    [JsonPropertyName("showCloseButton")]
    public bool ShowCloseButton { get; set; } = true;
    
    /// <summary>
    /// Whether the notification should close automatically after a timeout.
    /// Defaults to true.
    /// </summary>
    [JsonPropertyName("autoclose")]
    public bool AutoClose { get; set; } = true;

    /// <summary>
    /// The time in milliseconds before the notification automatically closes.
    /// Only applicable if <see cref="AutoClose"/> is true.
    /// Defaults to 4000.
    /// </summary>
    [JsonPropertyName("autotimeout")]
    public int AutoTimeout { get; set; } = 4000;

    /// <summary>
    /// The position on the screen where the notification should appear.
    /// Defaults to <see cref="ToastPosition.RightTop"/>.
    /// </summary>
    [JsonPropertyName("position")]
    public ToastPosition Position { get; set; } = ToastPosition.RightTop;

    /// <summary>
    /// The margin (in pixels) between multiple notifications stacked in the same position.
    /// Defaults to 20px. Use JsonIgnore to only send if different from default.
    /// </summary>
    [JsonPropertyName("gap")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int Gap { get; set; } = 20;
    
    /// <summary>
    /// The distance (in pixels) from the screen edges.
    /// Defaults to 20px. Use JsonIgnore to only send if different from default.
    /// </summary>
    [JsonPropertyName("distance")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int Distance { get; set; } = 20;

    /// <summary>
    /// The visual style type of the notification ('outline' or 'filled').
    /// Defaults to Outline. Use JsonIgnore to only send if different from default.
    /// </summary>
    [JsonPropertyName("type")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public ToastType Type { get; set; } = ToastType.Outline;
    
    /// <summary>
    /// Gets the default title string corresponding to the given status.
    /// </summary>
    /// <param name="status">The notification status.</param>
    /// <returns>
    /// A default title string corresponding to the specified <paramref name="status"/>.
    /// For example, if <paramref name="status"/> is <see cref="ToastStatus.Success"/>, returns "Success".
    /// </returns>
    private static string GetDefaultTitle(ToastStatus status)
    {
        return status switch
        {
            ToastStatus.Success => "Success",
            ToastStatus.Error => "Error",
            ToastStatus.Warning => "Warning",
            ToastStatus.Info => "Info",
            _ => "Notification", // Fallback default
        };
    }
}

