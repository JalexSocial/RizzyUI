using System.Reflection;
using System.Runtime.Serialization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace RizzyUI.Charts;


/// <summary>
/// Custom STJ converter that respects [EnumMember(Value="...")] for Chart.js string enums.
/// </summary>
public class ChartJsEnumConverter<T> : JsonConverter<T> where T : struct, Enum
{
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

	public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
	{
		var memInfo = typeof(T).GetMember(value.ToString());
		var attr = memInfo[0].GetCustomAttribute<EnumMemberAttribute>(false);
		writer.WriteStringValue(attr?.Value ?? value.ToString().ToLowerInvariant());
	}
}