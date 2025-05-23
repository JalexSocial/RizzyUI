using RizzyUI;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Jalex.UI.Components.Form.Converters;

/// <summary>
///     Converts a Flatpickr CalendarPosition to/from json
/// </summary>
public class CalendarPositionConverter : JsonConverter<CalendarPosition>
{
    /// <summary>
    ///     Converts string enum representation of CalendarPosition into it's enum counterpart
    /// </summary>
    /// <param name="reader"></param>
    /// <param name="typeToConvert"></param>
    /// <param name="options"></param>
    /// <returns></returns>
    /// <exception cref="ArgumentOutOfRangeException"></exception>
    public override CalendarPosition Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString() ?? string.Empty;

        // Convert string values back to enum values during deserialization
        return value switch
        {
            "auto" => CalendarPosition.Auto,
            "above" => CalendarPosition.Above,
            "below" => CalendarPosition.Below,
            "auto left" => CalendarPosition.AutoLeft,
            "auto center" => CalendarPosition.AutoCenter,
            "auto right" => CalendarPosition.AutoRight,
            "above left" => CalendarPosition.AboveLeft,
            "above center" => CalendarPosition.AboveCenter,
            "above right" => CalendarPosition.AboveRight,
            "below left" => CalendarPosition.BelowLeft,
            "below center" => CalendarPosition.BelowCenter,
            "below right" => CalendarPosition.BelowRight,
            _ => throw new ArgumentOutOfRangeException($"Unexpected value when parsing CalendarPosition: {value}")
        };
    }

    /// <summary>
    ///     Converts CalendarPosition enum to text
    /// </summary>
    /// <param name="writer"></param>
    /// <param name="value"></param>
    /// <param name="options"></param>
    /// <exception cref="ArgumentOutOfRangeException"></exception>
    public override void Write(Utf8JsonWriter writer, CalendarPosition value, JsonSerializerOptions options)
    {
        // Convert enum values to specific string representations for serialization
        var stringValue = value switch
        {
            CalendarPosition.Auto => "auto",
            CalendarPosition.Above => "above",
            CalendarPosition.Below => "below",
            CalendarPosition.AutoLeft => "auto left",
            CalendarPosition.AutoCenter => "auto center",
            CalendarPosition.AutoRight => "auto right",
            CalendarPosition.AboveLeft => "above left",
            CalendarPosition.AboveCenter => "above center",
            CalendarPosition.AboveRight => "above right",
            CalendarPosition.BelowLeft => "below left",
            CalendarPosition.BelowCenter => "below center",
            CalendarPosition.BelowRight => "below right",
            _ => throw new ArgumentOutOfRangeException($"Unexpected CalendarPosition value: {value}")
        };
        writer.WriteStringValue(stringValue);
    }
}