using System.Text.Json.Serialization;

namespace RizzyUI.Services.RzToast.Internal;

internal sealed class RzToastTransportCommand
{
    [JsonPropertyName("type")]
    public required string Type { get; init; }

    [JsonPropertyName("id")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Id { get; init; }

    [JsonPropertyName("options")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public RzToastTransportOptions? Options { get; init; }
}
