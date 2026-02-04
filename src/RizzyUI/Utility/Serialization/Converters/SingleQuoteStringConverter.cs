
using System.Text.Json;
using System.Text.Json.Serialization;

namespace RizzyUI.Utility.Serialization.Converters;

/// <summary>
/// A custom JSON converter that serializes a string with single quotes.
/// </summary>
internal class SingleQuoteStringConverter : JsonConverter<string>
{
    /// <summary>
    /// Reads and converts the JSON to type <see cref="string"/>.
    /// </summary>
    /// <param name="reader">The JSON reader.</param>
    /// <param name="typeToConvert">The type to convert.</param>
    /// <param name="options">The serializer options.</param>
    /// <returns>The deserialized string.</returns>
    public override string Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        // Reading logic (not relevant for serialization)
        return reader.GetString() ?? string.Empty;
    }

    /// <summary>
    /// Writes a specified value as JSON.
    /// </summary>
    /// <param name="writer">The JSON writer.</param>
    /// <param name="value">The value to write.</param>
    /// <param name="options">The serializer options.</param>
    public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
    {
        // Attempt to write single-quoted string
        writer.WriteRawValue($"'{value.Replace("'", "\\'")}'", true);
    }
}