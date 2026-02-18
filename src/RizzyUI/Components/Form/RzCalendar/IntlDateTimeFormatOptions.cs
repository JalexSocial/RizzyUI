using System.Text.Json;
using System.Text.Json.Serialization;

namespace RizzyUI;

/// <summary>
/// Strongly-typed options for configuring <c>Intl.DateTimeFormat</c> serialization.
/// </summary>
public sealed record IntlDateTimeFormatOptions
{
    /// <summary>
    /// Gets the date style shortcut.
    /// </summary>
    public StyleLength? DateStyle { get; init; }

    /// <summary>
    /// Gets the time style shortcut.
    /// </summary>
    public StyleLength? TimeStyle { get; init; }

    /// <summary>
    /// Gets the locale matching algorithm.
    /// </summary>
    public LocaleMatcher? LocaleMatcher { get; init; }

    /// <summary>
    /// Gets the Unicode calendar identifier.
    /// </summary>
    public string? Calendar { get; init; }

    /// <summary>
    /// Gets the numbering system identifier.
    /// </summary>
    public string? NumberingSystem { get; init; }

    /// <summary>
    /// Gets the IANA time zone identifier.
    /// </summary>
    public string? TimeZone { get; init; }

    /// <summary>
    /// Gets the time zone name format style.
    /// </summary>
    public TimeZoneNameStyle? TimeZoneName { get; init; }

    /// <summary>
    /// Gets the weekday display format.
    /// </summary>
    public TextWidth? Weekday { get; init; }

    /// <summary>
    /// Gets the era display format.
    /// </summary>
    public TextWidth? Era { get; init; }

    /// <summary>
    /// Gets the year display format.
    /// </summary>
    public Numeric2Digit? Year { get; init; }

    /// <summary>
    /// Gets the month display format.
    /// </summary>
    public MonthStyle? Month { get; init; }

    /// <summary>
    /// Gets the day display format.
    /// </summary>
    public Numeric2Digit? Day { get; init; }

    /// <summary>
    /// Gets the hour display format.
    /// </summary>
    public Numeric2Digit? Hour { get; init; }

    /// <summary>
    /// Gets the minute display format.
    /// </summary>
    public Numeric2Digit? Minute { get; init; }

    /// <summary>
    /// Gets the second display format.
    /// </summary>
    public Numeric2Digit? Second { get; init; }

    /// <summary>
    /// Gets the fractional second digits value. Valid range is 1..3.
    /// </summary>
    public int? FractionalSecondDigits { get; init; }

    /// <summary>
    /// Gets whether to use a 12-hour clock.
    /// </summary>
    public bool? Hour12 { get; init; }

    /// <summary>
    /// Gets the hour cycle option.
    /// </summary>
    public HourCycle? HourCycle { get; init; }

    /// <summary>
    /// Gets additional, forward-compatible options to include in serialized output.
    /// </summary>
    [JsonExtensionData]
    public Dictionary<string, JsonElement>? Extra { get; init; }

    /// <summary>
    /// Validates option combinations against <c>Intl.DateTimeFormat</c> constraints.
    /// </summary>
    public void Validate()
    {
        if (DateStyle is not null || TimeStyle is not null)
        {
            if (Weekday is not null || Era is not null ||
                Year is not null || Month is not null || Day is not null ||
                Hour is not null || Minute is not null || Second is not null ||
                TimeZoneName is not null || FractionalSecondDigits is not null)
            {
                throw new InvalidOperationException(
                    "Do not combine DateStyle/TimeStyle with component options (weekday/year/month/day/hour/etc.).");
            }
        }

        if (FractionalSecondDigits is < 1 or > 3)
        {
            throw new InvalidOperationException("FractionalSecondDigits must be within 1..3.");
        }
    }
}

/// <summary>
/// Shared JSON helpers for Intl formatting options.
/// </summary>
public static class IntlJson
{
    /// <summary>
    /// Gets the serializer options used for Intl formatting option payloads.
    /// </summary>
    public static readonly JsonSerializerOptions Options = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Converters = { new JsonStringEnumConverter(JsonNamingPolicy.CamelCase) }
    };

    /// <summary>
    /// Serializes and validates Intl options for client-side usage.
    /// </summary>
    /// <param name="options">The options to serialize.</param>
    /// <returns>A JSON object string.</returns>
    public static string SerializeOptions(IntlDateTimeFormatOptions? options)
    {
        if (options is null)
        {
            return "{}";
        }

        options.Validate();
        return JsonSerializer.Serialize(options, Options);
    }
}

/// <summary>
/// Date/time style presets for Intl formatting.
/// </summary>
public enum StyleLength
{
    /// <summary>Full style.</summary>
    Full,

    /// <summary>Long style.</summary>
    Long,

    /// <summary>Medium style.</summary>
    Medium,

    /// <summary>Short style.</summary>
    Short
}

/// <summary>
/// Text width options for Intl formatting.
/// </summary>
public enum TextWidth
{
    /// <summary>Long width.</summary>
    Long,

    /// <summary>Short width.</summary>
    Short,

    /// <summary>Narrow width.</summary>
    Narrow
}

/// <summary>
/// Hour cycle values for Intl formatting.
/// </summary>
public enum HourCycle
{
    /// <summary>h11 cycle.</summary>
    H11,

    /// <summary>h12 cycle.</summary>
    H12,

    /// <summary>h23 cycle.</summary>
    H23,

    /// <summary>h24 cycle.</summary>
    H24
}

/// <summary>
/// Time zone name rendering options.
/// </summary>
public enum TimeZoneNameStyle
{
    /// <summary>Short zone name.</summary>
    Short,

    /// <summary>Long zone name.</summary>
    Long,

    /// <summary>Short GMT offset.</summary>
    ShortOffset,

    /// <summary>Long GMT offset.</summary>
    LongOffset,

    /// <summary>Short generic zone name.</summary>
    ShortGeneric,

    /// <summary>Long generic zone name.</summary>
    LongGeneric
}

/// <summary>
/// Represents <c>numeric</c> or <c>2-digit</c> Intl values.
/// </summary>
[JsonConverter(typeof(Numeric2DigitConverter))]
public readonly record struct Numeric2Digit(string Value)
{
    /// <summary>
    /// Gets the <c>numeric</c> value.
    /// </summary>
    public static Numeric2Digit Numeric => new("numeric");

    /// <summary>
    /// Gets the <c>2-digit</c> value.
    /// </summary>
    public static Numeric2Digit TwoDigit => new("2-digit");
}

/// <summary>
/// JSON converter for <see cref="Numeric2Digit"/>.
/// </summary>
public sealed class Numeric2DigitConverter : JsonConverter<Numeric2Digit>
{
    /// <inheritdoc />
    public override Numeric2Digit Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => new(reader.GetString() ?? "numeric");

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, Numeric2Digit value, JsonSerializerOptions options)
        => writer.WriteStringValue(value.Value);
}

/// <summary>
/// Month formatting values.
/// </summary>
[JsonConverter(typeof(MonthStyleConverter))]
public readonly record struct MonthStyle(string Value)
{
    /// <summary>Numeric month value.</summary>
    public static MonthStyle Numeric => new("numeric");

    /// <summary>Two-digit month value.</summary>
    public static MonthStyle TwoDigit => new("2-digit");

    /// <summary>Long month value.</summary>
    public static MonthStyle Long => new("long");

    /// <summary>Short month value.</summary>
    public static MonthStyle Short => new("short");

    /// <summary>Narrow month value.</summary>
    public static MonthStyle Narrow => new("narrow");
}

/// <summary>
/// JSON converter for <see cref="MonthStyle"/>.
/// </summary>
public sealed class MonthStyleConverter : JsonConverter<MonthStyle>
{
    /// <inheritdoc />
    public override MonthStyle Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => new(reader.GetString() ?? "numeric");

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, MonthStyle value, JsonSerializerOptions options)
        => writer.WriteStringValue(value.Value);
}

/// <summary>
/// Locale matcher values.
/// </summary>
[JsonConverter(typeof(LocaleMatcherConverter))]
public readonly record struct LocaleMatcher(string Value)
{
    /// <summary>Lookup matcher mode.</summary>
    public static LocaleMatcher Lookup => new("lookup");

    /// <summary>Best fit matcher mode.</summary>
    public static LocaleMatcher BestFit => new("best fit");
}

/// <summary>
/// JSON converter for <see cref="LocaleMatcher"/>.
/// </summary>
public sealed class LocaleMatcherConverter : JsonConverter<LocaleMatcher>
{
    /// <inheritdoc />
    public override LocaleMatcher Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => new(reader.GetString() ?? "best fit");

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, LocaleMatcher value, JsonSerializerOptions options)
        => writer.WriteStringValue(value.Value);
}
