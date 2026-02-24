
using System.Reflection;
using System.Runtime.Serialization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace RizzyUI.Charts;

/// <summary>
/// Custom System.Text.Json converter that respects <see cref="EnumMemberAttribute"/> for mapping C# enums to Chart.js strings.
/// </summary>
public class ChartJsEnumConverter<T> : JsonConverter<T> where T : struct, Enum
{
    /// <inheritdoc />
	public override T Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var val = reader.GetString();
        if (string.IsNullOrEmpty(val)) return default;

        foreach (var name in Enum.GetNames<T>())
        {
            var memInfo = typeof(T).GetMember(name);
            var attr = memInfo[0].GetCustomAttribute<EnumMemberAttribute>(false);
            if (attr?.Value == val || name.Equals(val, StringComparison.OrdinalIgnoreCase))
            {
                return Enum.Parse<T>(name);
            }
        }
        return default;
    }

    /// <inheritdoc />
	public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
    {
        var memInfo = typeof(T).GetMember(value.ToString());
        var attr = memInfo[0].GetCustomAttribute<EnumMemberAttribute>(false);
        writer.WriteStringValue(attr?.Value ?? value.ToString().ToLowerInvariant());
    }
}