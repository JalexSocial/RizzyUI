using System.Text.Json;
using System.Text.Json.Serialization;

namespace RizzyUI.Utility.Serialization.Converters;

/// <summary>
/// A custom JSON converter that serializes and deserializes strings as raw values.
/// </summary>
public class RawStringConverter : JsonConverter<string>
{
    public override string Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        // Deserialization of json objects with raw values not supported
        return string.Empty;
    }

    public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
    {
        // Write the raw value, bypassing JSON escaping and quotation marks
        writer.WriteRawValue(value, true);
    }
}