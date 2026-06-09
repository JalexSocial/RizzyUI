using System.Text.Json.Serialization;

namespace RizzyUI.Services.RzToast.Internal;

internal sealed class RzToastTransportBatch
{
    [JsonPropertyName("commands")]
    public required IReadOnlyList<RzToastTransportCommand> Commands { get; init; }
}
