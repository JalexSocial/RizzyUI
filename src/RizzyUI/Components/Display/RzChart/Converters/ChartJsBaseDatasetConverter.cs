using System.Text.Json;
using System.Text.Json.Serialization;

namespace RizzyUI.Charts;

/// <summary>
/// Ensures datasets are serialized using their runtime type so derived configuration properties are preserved.
/// </summary>
public sealed class ChartJsBaseDatasetConverter : JsonConverter<BaseDataset>
{
    /// <inheritdoc />
    public override BaseDataset? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotSupportedException($"Deserializing '{nameof(BaseDataset)}' is not supported.");
    }

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, BaseDataset value, JsonSerializerOptions options)
    {
        JsonSerializer.Serialize(writer, value, value.GetType(), options);
    }
}
