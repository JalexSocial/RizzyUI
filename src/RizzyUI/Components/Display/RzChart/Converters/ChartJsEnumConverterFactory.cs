using System.Text.Json;
using System.Text.Json.Serialization;

namespace RizzyUI.Charts;


/// <summary>
/// Factory to create JSON converters for enums using EnumMember values.
/// </summary>
public class ChartJsEnumConverterFactory : JsonConverterFactory
{
    public override bool CanConvert(Type typeToConvert) => typeToConvert.IsEnum;

    public override JsonConverter CreateConverter(Type typeToConvert, JsonSerializerOptions options)
    {
        return (JsonConverter)Activator.CreateInstance(
            typeof(ChartJsEnumConverter<>).MakeGenericType(typeToConvert))!;
    }
}