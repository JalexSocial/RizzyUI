using System.Text.Json.Serialization;

namespace RizzyUI.Services.RzToast.Internal;

internal sealed class RzToastTransportAction
{
    [JsonPropertyName("label")]
    public required string Label { get; init; }

    [JsonPropertyName("eventName")]
    public required string EventName { get; init; }

    [JsonPropertyName("detail")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? Detail { get; init; }

    [JsonPropertyName("dismissOnClick")]
    public bool DismissOnClick { get; init; }
}
