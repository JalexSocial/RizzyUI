using System.Collections.Concurrent;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace RizzyUI.Charts;

/// <summary>
/// Utilities for converting Chart.js enum values to and from their JSON string representation.
/// </summary>
internal static class ChartJsEnumMapper
{
    private static readonly ConcurrentDictionary<Type, IReadOnlyDictionary<string, object>> NameToValueCache = new();
    private static readonly ConcurrentDictionary<Type, IReadOnlyDictionary<object, string>> ValueToNameCache = new();

    /// <summary>
    /// Converts an enum value to its Chart.js string representation.
    /// </summary>
    public static string ToChartJsString<TEnum>(TEnum value) where TEnum : struct, Enum
    {
        var valueToName = ValueToNameCache.GetOrAdd(typeof(TEnum), static _ => CreateValueToNameMap<TEnum>());
        return valueToName.TryGetValue(value, out var mapped) ? mapped : value.ToString();
    }

    /// <summary>
    /// Converts an enum value to its Chart.js string representation.
    /// </summary>
    public static string ToChartJsString(this Enum value)
    {
        var enumType = value.GetType();
        var valueToName = ValueToNameCache.GetOrAdd(enumType, CreateValueToNameMap);
        return valueToName.TryGetValue(value, out var mapped) ? mapped : value.ToString();
    }

    /// <summary>
    /// Attempts to parse a Chart.js string into an enum value.
    /// </summary>
    public static bool TryParseChartJsValue<TEnum>(string value, out TEnum result) where TEnum : struct, Enum
    {
        var nameToValue = NameToValueCache.GetOrAdd(typeof(TEnum), static _ => CreateNameToValueMap<TEnum>());
        if (nameToValue.TryGetValue(value, out var parsed))
        {
            result = (TEnum)parsed;
            return true;
        }

        result = default;
        return false;
    }

    private static IReadOnlyDictionary<string, object> CreateNameToValueMap(Type enumType)
    {
        var map = new Dictionary<string, object>(StringComparer.OrdinalIgnoreCase);

        foreach (var rawValue in Enum.GetValues(enumType))
        {
            var enumValue = (Enum)rawValue;
            var name = enumValue.ToString();
            var member = enumType.GetMember(name, BindingFlags.Public | BindingFlags.Static).FirstOrDefault();
            var enumMemberValue = member?.GetCustomAttribute<EnumMemberAttribute>(false)?.Value;

            map[name] = enumValue;
            if (!string.IsNullOrWhiteSpace(enumMemberValue))
                map[enumMemberValue] = enumValue;
        }

        return map;
    }

    private static IReadOnlyDictionary<string, object> CreateNameToValueMap<TEnum>() where TEnum : struct, Enum =>
        CreateNameToValueMap(typeof(TEnum));

    private static IReadOnlyDictionary<object, string> CreateValueToNameMap(Type enumType)
    {
        var map = new Dictionary<object, string>();

        foreach (var rawValue in Enum.GetValues(enumType))
        {
            var enumValue = (Enum)rawValue;
            var name = enumValue.ToString();
            var member = enumType.GetMember(name, BindingFlags.Public | BindingFlags.Static).FirstOrDefault();
            var enumMemberValue = member?.GetCustomAttribute<EnumMemberAttribute>(false)?.Value;

            map[enumValue] = string.IsNullOrWhiteSpace(enumMemberValue)
                ? name
                : enumMemberValue;
        }

        return map;
    }

    private static IReadOnlyDictionary<object, string> CreateValueToNameMap<TEnum>() where TEnum : struct, Enum =>
        CreateValueToNameMap(typeof(TEnum));
}

/// <summary>
/// Custom System.Text.Json converter that respects <see cref="EnumMemberAttribute"/> for mapping C# enums to Chart.js strings.
/// </summary>
public class ChartJsEnumConverter<T> : JsonConverter<T> where T : struct, Enum
{
    /// <inheritdoc />
    public override T Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var value = reader.GetString();
        if (string.IsNullOrWhiteSpace(value))
            throw new JsonException($"Cannot deserialize empty value for enum '{typeof(T).Name}'.");

        if (ChartJsEnumMapper.TryParseChartJsValue(value, out T result))
            return result;

        throw new JsonException($"Value '{value}' is not valid for enum '{typeof(T).Name}'.");
    }

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(ChartJsEnumMapper.ToChartJsString(value));
    }
}
