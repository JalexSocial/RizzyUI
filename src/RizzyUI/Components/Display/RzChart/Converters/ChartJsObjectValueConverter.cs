using System.Text.Json;
using System.Text.Json.Serialization;

namespace RizzyUI.Charts;

/// <summary>
/// Handles polymorphic <see cref="object"/> values used throughout chart models.
/// </summary>
public sealed class ChartJsObjectValueConverter : JsonConverter<object>
{
    /// <inheritdoc />
    public override object? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using var document = JsonDocument.ParseValue(ref reader);
        return document.RootElement.Clone();
    }

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, object value, JsonSerializerOptions options)
    {
        if (value is null)
        {
            writer.WriteNullValue();
            return;
        }

        if (value is Enum enumValue)
        {
            writer.WriteStringValue(enumValue.ToChartJsString());
            return;
        }

        if (value is JsonElement jsonElement)
        {
            jsonElement.WriteTo(writer);
            return;
        }

        JsonSerializer.Serialize(writer, value, value.GetType(), options);
    }
}
