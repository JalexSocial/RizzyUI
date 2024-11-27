using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Threading.Tasks;

namespace RizzyUI.Utility.Serialization.Converters;

internal class SingleQuoteStringConverter : JsonConverter<string>
{
    public override string Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        // Reading logic (not relevant for serialization)
        return reader.GetString();
    }

    public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
    {
        // Attempt to write single-quoted string
        writer.WriteRawValue($"'{value.Replace("'", "\\'")}'", true);
    }
}
