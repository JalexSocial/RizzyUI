using System.Text.Json;
using System.Text.Json.Serialization;

namespace RizzyUI.Utility.Serialization.Converters;

/// <summary>
///     A custom JSON converter that serializes and deserializes strings as raw values. This allows a developer to embed
///     javascript code in an object and it will serialize that value without any quotation or JSON escaping.
/// </summary>
public class RawStringConverter : JsonConverter<string>
{
    /// <summary>
    ///     Deserialization of json objects with raw values not supported
    /// </summary>
    /// <param name="reader"></param>
    /// <param name="typeToConvert"></param>
    /// <param name="options"></param>
    /// <returns></returns>
    public override string Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return string.Empty;
    }

    /// <summary>
    ///     Writes the raw value, bypassing JSON escaping and quotation marks
    /// </summary>
    /// <param name="writer"></param>
    /// <param name="value"></param>
    /// <param name="options"></param>
    public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
    {
        writer.WriteRawValue(value, true);
    }
}