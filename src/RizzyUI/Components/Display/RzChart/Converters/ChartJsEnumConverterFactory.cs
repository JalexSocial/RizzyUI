using System.Text.Json;
using System.Text.Json.Serialization;

namespace RizzyUI.Charts;


/// <summary>
/// Factory to create JSON converters for enums using EnumMember values.
/// </summary>
public class ChartJsEnumConverterFactory : JsonConverterFactory
{
    /// <summary>
    /// Determines whether the specified type can be converted to or from JSON.
    /// This factory specifically supports all <see cref="Enum"/> types.
    /// </summary>
    /// <param name="typeToConvert">The type to be checked.</param>
    /// <returns>True if the type is an Enum; otherwise, false.</returns>
    public override bool CanConvert(Type typeToConvert) => typeToConvert.IsEnum;

    /// <summary>
    /// Creates a specific instance of <see cref="ChartJsEnumConverter{T}"/> for the given enum type.
    /// </summary>
    /// <param name="typeToConvert">The type of enum to create a converter for.</param>
    /// <param name="options">The serialization options to use.</param>
    /// <returns>A <see cref="JsonConverter"/> instance capable of handling the specified enum type using <see cref="System.Runtime.Serialization.EnumMemberAttribute"/> values.</returns>
    public override JsonConverter CreateConverter(Type typeToConvert, JsonSerializerOptions options)
    {
        return (JsonConverter)Activator.CreateInstance(
            typeof(ChartJsEnumConverter<>).MakeGenericType(typeToConvert))!;
    }
}