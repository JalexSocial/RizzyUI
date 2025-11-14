#nullable enable
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace RizzyUI;

// --- Enums for All Discrete Options ---

/// <summary>
/// Defines the type of calendar to display.
/// </summary>
[JsonConverter(typeof(CamelCaseEnumValueConverter<CalendarType>))]
public enum CalendarType
{
    /// <summary>Displays a single month view. This is the default calendar type.</summary>
    Default,
    /// <summary>Displays multiple months side-by-side, allowing for broader date selection.</summary>
    Multiple,
    /// <summary>Displays a view to select a month within a year, hiding the day-to-day view.</summary>
    Month,
    /// <summary>Displays a view to select a year from a range of years.</summary>
    Year
}

/// <summary>
/// Defines the date selection mode. Can be disabled to prevent date selection.
/// </summary>
[JsonConverter(typeof(SelectionDatesModeConverter))]
public enum SelectionDatesMode
{
    /// <summary>Date selection is disabled. Users cannot pick any dates.</summary>
    Disabled,
    /// <summary>Only a single date can be selected at a time.</summary>
    Single,
    /// <summary>Multiple, non-consecutive dates can be selected.</summary>
    Multiple,
    /// <summary>A range of dates can be selected by picking a start and end date.</summary>
    MultipleRanged
}

/// <summary>
/// Defines the position of the calendar relative to an input element.
/// </summary>
[JsonConverter(typeof(PositionConverter))]
public enum Position
{
    /// <summary>Automatically determine the best position based on available space. Serializes to "auto".</summary>
    Auto,
    /// <summary>Positioned below, aligned to the left. Serializes to the string "left".</summary>
    Left,
    /// <summary>Positioned below, aligned to the center. Serializes to the string "center".</summary>
    Center,
    /// <summary>Positioned below, aligned to the right. Serializes to the string "right".</summary>
    Right,
    /// <summary>Positioned above, aligned to the left. Serializes to ["top", "left"].</summary>
    TopLeft,
    /// <summary>Positioned above, aligned to the center. Serializes to ["top", "center"].</summary>
    TopCenter,
    /// <summary>Positioned above, aligned to the right. Serializes to ["top", "right"].</summary>
    TopRight,
    /// <summary>Positioned below, aligned to the left. Serializes to ["bottom", "left"].</summary>
    BottomLeft,
    /// <summary>Positioned below, aligned to the center. Serializes to ["bottom", "center"].</summary>
    BottomCenter,
    /// <summary>Positioned below, aligned to the right. Serializes to ["bottom", "right"].</summary>
    BottomRight
}

/// <summary>
/// Defines the behavior for month or year selection.
/// </summary>
[JsonConverter(typeof(SelectionModeConverter))]
public enum SelectionMode
{
    /// <summary>Selection is fully enabled (by clicking the title and using arrows).</summary>
    Enabled,
    /// <summary>Selection is completely disabled. The month/year cannot be changed.</summary>
    Disabled,
    /// <summary>Selection is only possible via the navigation arrows; clicking the title is disabled.</summary>
    OnlyArrows
}

/// <summary>
/// Defines the time selection format.
/// </summary>
[JsonConverter(typeof(TimeModeConverter))]
public enum TimeMode
{
    /// <summary>Time selection is disabled.</summary>
    Disabled,
    /// <summary>Time is selected using a 12-hour format with AM/PM.</summary>
    TwelveHour,
    /// <summary>Time is selected using a 24-hour format.</summary>
    TwentyFourHour
}

// --- Nested Configuration Records ---

/// <summary>
/// Represents a popup with information for a specific day.
/// </summary>
public record Popup
{
    /// <summary>
    /// A space-separated string of CSS classes to apply to the date.
    /// </summary>
    [JsonPropertyName("modifier")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Modifier { get; init; }

    /// <summary>
    /// Plain text or HTML markup for formatting the popup content.
    /// </summary>
    [JsonPropertyName("html")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Html { get; init; }
}

// --- Main Options Record ---

/// <summary>
/// Represents the complete set of options for initializing a Vanilla Calendar Pro instance.
/// This record is designed to be serialized into a JSON object compatible with the library.
/// </summary>
public record VanillaCalendarOptions
{
    private static readonly string[] TwelveHourAcceptFormats = { "hh:mm tt", "h:mm tt", "hh:mmtt", "h:mmtt" };
    private static readonly string[] TwentyFourAcceptFormats = { "HH:mm", "H:mm" };

    /// <summary>
    /// The primary constructor used for deserialization. It correctly maps the incoming JSON string for `selectedTime`
    /// to the strongly-typed `TimeOnly?` property based on the `selectionTimeMode`.
    /// </summary>
    [JsonConstructor]
    public VanillaCalendarOptions(
        TimeMode selectionTimeMode,
        string? selectedTime)
    {
        this.SelectionTimeMode = selectionTimeMode;
        this.SelectedTime = ParseSelectedTime(selectedTime, selectionTimeMode);
    }

    /// <summary>
    /// Default constructor for creating new options in code.
    /// </summary>
    public VanillaCalendarOptions() { }

    private static TimeOnly? ParseSelectedTime(string? timeStr, TimeMode mode)
    {
        if (string.IsNullOrWhiteSpace(timeStr)) return null;

        if (mode == TimeMode.TwelveHour &&
            TimeOnly.TryParseExact(timeStr.Trim(), TwelveHourAcceptFormats, CultureInfo.InvariantCulture, DateTimeStyles.None, out var time12))
        {
            return time12;
        }

        if (mode == TimeMode.TwentyFourHour &&
            TimeOnly.TryParseExact(timeStr.Trim(), TwentyFourAcceptFormats, CultureInfo.InvariantCulture, DateTimeStyles.None, out var time24))
        {
            return time24;
        }

        return null;
    }

    /// <summary>
    /// Sets the time that will be displayed when the calendar is initialized.
    /// This property is for use in C# code and is ignored during JSON serialization.
    /// The actual serialized value is determined by the <see cref="SelectedTimeJson"/> property.
    /// </summary>
    [JsonIgnore]
    public TimeOnly? SelectedTime { get; init; }

    /// <summary>
    /// Defines the type of calendar displayed. Defaults to <see cref="CalendarType.Default"/>.
    /// </summary>
    [JsonPropertyName("type")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public CalendarType Type { get; init; } = CalendarType.Default;

    /// <summary>
    /// If true, the calendar is attached to an input element and appears as a popup. Defaults to false.
    /// </summary>
    [JsonPropertyName("inputMode")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool InputMode { get; init; } = false;

    /// <summary>
    /// Defines the position of the calendar relative to the input when <see cref="InputMode"/> is true. Defaults to <see cref="Position.Left"/>.
    /// </summary>
    [JsonPropertyName("positionToInput")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public Position PositionToInput { get; init; } = Position.Left;

    /// <summary>
    /// Sets the first day of the week. Defaults to <see cref="DayOfWeek.Monday"/>.
    /// </summary>
    [JsonPropertyName("firstWeekday")]
    [JsonConverter(typeof(DayOfWeekNumberConverter))]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public DayOfWeek FirstWeekday { get; init; } = DayOfWeek.Monday;

    /// <summary>
    /// Sets the language localization of the calendar using a BCP 47 language tag (e.g., "en-US", "de-AT").
    /// </summary>
    [JsonPropertyName("locale")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Locale { get; init; }

    /// <summary>
    /// A list of dates that will be selected when the calendar is initialized.
    /// Consecutive dates in the list will be automatically converted to a "YYYY-MM-DD:YYYY-MM-DD" range string.
    /// </summary>
    [JsonPropertyName("selectedDates")]
    [JsonConverter(typeof(DateOnlyRangeListConverter))]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<DateOnly>? SelectedDates { get; init; }

    /// <summary>
    /// A list of dates that will be disabled and unavailable for selection.
    /// Consecutive dates in the list will be automatically converted to a "YYYY-MM-DD:YYYY-MM-DD" range string.
    /// </summary>
    [JsonPropertyName("disableDates")]
    [JsonConverter(typeof(DateOnlyRangeListConverter))]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<DateOnly>? DisableDates { get; init; }

    /// <summary>
    /// A list of weekdays to disable.
    /// </summary>
    [JsonPropertyName("disableWeekdays")]
    [JsonConverter(typeof(DayOfWeekListConverter))]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<DayOfWeek>? DisableWeekdays { get; init; }

    /// <summary>
    /// Determines whether selecting one or multiple days is allowed, or if selection is disabled. Defaults to <see cref="SelectionDatesMode.Single"/>.
    /// </summary>
    [JsonPropertyName("selectionDatesMode")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public SelectionDatesMode SelectionDatesMode { get; init; } = SelectionDatesMode.Single;

    /// <summary>
    /// Allows disabling month selection or restricting it to arrows only. Defaults to <see cref="SelectionMode.Enabled"/>.
    /// </summary>
    [JsonPropertyName("selectionMonthsMode")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public SelectionMode SelectionMonthsMode { get; init; } = SelectionMode.Enabled;

    /// <summary>
    /// Allows disabling year selection or restricting it to arrows only. Defaults to <see cref="SelectionMode.Enabled"/>.
    /// </summary>
    [JsonPropertyName("selectionYearsMode")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public SelectionMode SelectionYearsMode { get; init; } = SelectionMode.Enabled;

    /// <summary>
    /// Enables time selection and sets the format (12-hour or 24-hour). Defaults to <see cref="TimeMode.Disabled"/>.
    /// </summary>
    [JsonPropertyName("selectionTimeMode")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public TimeMode SelectionTimeMode { get; init; } = TimeMode.Disabled;

    /// <summary>
    /// A dictionary of popups to display on hover for specific dates. The key is the date, and the value is the Popup configuration.
    /// </summary>
    [JsonPropertyName("popups")]
    [JsonConverter(typeof(PopupsConverter))]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyDictionary<DateOnly, Popup>? Popups { get; init; }

    /// <summary>
    /// This property is used exclusively for JSON serialization. It formats the <see cref="SelectedTime"/>
    /// into the correct string representation based on the current <see cref="SelectionTimeMode"/>.
    /// It is not intended for direct use in C# code.
    /// </summary>
    [JsonPropertyName("selectedTime")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? SelectedTimeJson =>
        SelectedTime is null
            ? null
            : SelectionTimeMode switch
            {
                TimeMode.TwelveHour => SelectedTime.Value.ToString("hh:mm tt", CultureInfo.InvariantCulture),
                TimeMode.TwentyFourHour => SelectedTime.Value.ToString("HH:mm", CultureInfo.InvariantCulture),
                _ => null
            };

    /// <summary>
    /// Validates the options object, throwing an <see cref="InvalidOperationException"/> if any rules are violated.
    /// This should be called before serialization to catch configuration errors early.
    /// </summary>
    public void Validate()
    {
        if (SelectionTimeMode == TimeMode.Disabled && SelectedTime is not null)
        {
            throw new InvalidOperationException($"Cannot set {nameof(SelectedTime)} when {nameof(SelectionTimeMode)} is {nameof(TimeMode.Disabled)}.");
        }

        if (SelectionDatesMode == SelectionDatesMode.Single && (SelectedDates?.Count ?? 0) > 1)
        {
            // This is a soft validation. The JS library might handle it, but it's a logical inconsistency.
            // Depending on desired strictness, this could log a warning instead of throwing.
            throw new InvalidOperationException($"When {nameof(SelectionDatesMode)} is {nameof(SelectionDatesMode.Single)}, {nameof(SelectedDates)} should contain at most one date.");
        }
    }
}

// --- Custom JSON Converters ---

#region Converters

/// <summary>
/// Converts a C# <see cref="DayOfWeek"/> enum to the integer index expected by Vanilla Calendar (0=Sunday, 6=Saturday).
/// </summary>
public sealed class DayOfWeekNumberConverter : JsonConverter<DayOfWeek>
{
    private static int ToJs(DayOfWeek d) => (int)d;
    private static DayOfWeek FromJs(int n)
    {
        if (n < 0 || n > 6) throw new JsonException($"Invalid weekday index: {n}. Expected a value between 0 (Sunday) and 6 (Saturday).");
        return (DayOfWeek)n;
    }

    /// <inheritdoc />
    public override DayOfWeek Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => FromJs(reader.GetInt32());

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, DayOfWeek value, JsonSerializerOptions options)
        => writer.WriteNumberValue(ToJs(value));
}

/// <summary>
/// Converts a list of C# <see cref="DayOfWeek"/> enums to a JSON array of integers.
/// </summary>
public sealed class DayOfWeekListConverter : JsonConverter<IReadOnlyList<DayOfWeek>>
{
    /// <inheritdoc />
    public override IReadOnlyList<DayOfWeek> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType != JsonTokenType.StartArray) throw new JsonException("Expected an array of numbers for DayOfWeek list.");
        var intList = JsonSerializer.Deserialize<List<int>>(ref reader, options);
        if (intList == null) return new List<DayOfWeek>();

        foreach (var i in intList)
        {
            if (i < 0 || i > 6) throw new JsonException($"Invalid weekday index: {i}. Expected 0..6.");
        }
        return intList.Select(i => (DayOfWeek)i).ToList();
    }

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, IReadOnlyList<DayOfWeek> value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        foreach (var day in value)
        {
            writer.WriteNumberValue((int)day);
        }
        writer.WriteEndArray();
    }
}

/// <summary>
/// Converts a list of C# <see cref="DateOnly"/> objects to a JSON array of strings.
/// This converter provides an ergonomic benefit by automatically grouping consecutive dates into the "YYYY-MM-DD:YYYY-MM-DD" range format,
/// which is supported by the Vanilla Calendar library.
/// </summary>
public sealed class DateOnlyRangeListConverter : JsonConverter<IReadOnlyList<DateOnly>>
{
    private static string Pad2(string s) => s.Length == 1 ? "0" + s : s;

    /// <inheritdoc />
    public override IReadOnlyList<DateOnly> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType != JsonTokenType.StartArray) throw new JsonException("Expected an array of strings for DateOnly list.");

        var stringList = JsonSerializer.Deserialize<List<string>>(ref reader, options);
        if (stringList == null) return new List<DateOnly>();

        var results = new List<DateOnly>();
        foreach (var entry in stringList)
        {
            if (string.IsNullOrWhiteSpace(entry)) continue;

            var nums = Regex.Split(entry, @"\D+").Where(s => !string.IsNullOrEmpty(s)).ToArray();
            if (nums.Length == 6) // YYYY, M, D, YYYY, M, D
            {
                var startStr = $"{nums[0]}-{Pad2(nums[1])}-{Pad2(nums[2])}";
                var endStr = $"{nums[3]}-{Pad2(nums[4])}-{Pad2(nums[5])}";
                if (DateOnly.TryParseExact(startStr, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var start) &&
                    DateOnly.TryParseExact(endStr, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var end))
                {
                    if (end < start) throw new JsonException($"Invalid date range: end date '{endStr}' is before start date '{startStr}'.");
                    for (var d = start; d <= end; d = d.AddDays(1)) results.Add(d);
                    continue;
                }
            }
            else if (nums.Length == 3) // YYYY, M, D
            {
                var singleStr = $"{nums[0]}-{Pad2(nums[1])}-{Pad2(nums[2])}";
                if (DateOnly.TryParseExact(singleStr, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var singleDate))
                {
                    results.Add(singleDate);
                    continue;
                }
            }

            if (DateOnly.TryParseExact(entry.Trim(), "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var exactDate))
            {
                results.Add(exactDate);
            }
        }
        return results;
    }

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, IReadOnlyList<DateOnly> value, JsonSerializerOptions options)
    {
        var sortedDates = value.Distinct().OrderBy(d => d).ToList();

        writer.WriteStartArray();
        for (int i = 0; i < sortedDates.Count; i++)
        {
            var rangeStart = sortedDates[i];
            var rangeEnd = rangeStart;
            while (i + 1 < sortedDates.Count && sortedDates[i + 1] == rangeEnd.AddDays(1))
            {
                rangeEnd = sortedDates[i + 1];
                i++;
            }

            if (rangeStart == rangeEnd)
            {
                writer.WriteStringValue(rangeStart.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
            }
            else
            {
                writer.WriteStringValue($"{rangeStart.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)}:{rangeEnd.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)}");
            }
        }
        writer.WriteEndArray();
    }
}

/// <summary>
/// Converts a C# <see cref="Position"/> enum to the JSON string or string array required by Vanilla Calendar.
/// </summary>
public sealed class PositionConverter : JsonConverter<Position>
{
    /// <inheritdoc />
    public override Position Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.String)
        {
            string? val = reader.GetString()?.Trim().ToLowerInvariant();
            return val switch
            {
                "auto" => Position.Auto,
                "left" => Position.Left,
                "center" => Position.Center,
                "right" => Position.Right,
                _ => throw new JsonException($"Invalid string value for Position: '{val}'. Expected 'auto', 'left', 'center', or 'right'.")
            };
        }
        if (reader.TokenType == JsonTokenType.StartArray)
        {
            var arr = JsonSerializer.Deserialize<string[]>(ref reader, options);
            if (arr?.Length == 2)
            {
                var key = $"{arr[0].Trim().ToLowerInvariant()}-{arr[1].Trim().ToLowerInvariant()}";
                return key switch
                {
                    "top-left" => Position.TopLeft,
                    "top-center" => Position.TopCenter,
                    "top-right" => Position.TopRight,
                    "bottom-left" => Position.BottomLeft,
                    "bottom-center" => Position.BottomCenter,
                    "bottom-right" => Position.BottomRight,
                    _ => throw new JsonException($"Invalid array value for Position: ['{arr[0]}','{arr[1]}'].")
                };
            }
        }
        throw new JsonException("Expected a string or a two-element string array for Position.");
    }

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, Position value, JsonSerializerOptions options)
    {
        switch (value)
        {
            case Position.Auto: writer.WriteStringValue("auto"); return;
            case Position.Left: writer.WriteStringValue("left"); return;
            case Position.Center: writer.WriteStringValue("center"); return;
            case Position.Right: writer.WriteStringValue("right"); return;

            case Position.TopLeft: writer.WriteStartArray(); writer.WriteStringValue("top"); writer.WriteStringValue("left"); writer.WriteEndArray(); return;
            case Position.TopCenter: writer.WriteStartArray(); writer.WriteStringValue("top"); writer.WriteStringValue("center"); writer.WriteEndArray(); return;
            case Position.TopRight: writer.WriteStartArray(); writer.WriteStringValue("top"); writer.WriteStringValue("right"); writer.WriteEndArray(); return;
            case Position.BottomLeft: writer.WriteStartArray(); writer.WriteStringValue("bottom"); writer.WriteStringValue("left"); writer.WriteEndArray(); return;
            case Position.BottomCenter: writer.WriteStartArray(); writer.WriteStringValue("bottom"); writer.WriteStringValue("center"); writer.WriteEndArray(); return;
            case Position.BottomRight: writer.WriteStartArray(); writer.WriteStringValue("bottom"); writer.WriteStringValue("right"); writer.WriteEndArray(); return;
            default: throw new JsonException($"Invalid Position enum value: {value}");
        }
    }
}

/// <summary>
/// Converts a C# <see cref="SelectionMode"/> enum to the JSON boolean or string required by Vanilla Calendar.
/// </summary>
public sealed class SelectionModeConverter : JsonConverter<SelectionMode>
{
    /// <inheritdoc />
    public override SelectionMode Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.True) return SelectionMode.Enabled;
        if (reader.TokenType == JsonTokenType.False) return SelectionMode.Disabled;
        if (reader.TokenType == JsonTokenType.String && string.Equals(reader.GetString(), "only-arrows", StringComparison.OrdinalIgnoreCase)) return SelectionMode.OnlyArrows;
        throw new JsonException("Invalid value for SelectionMode. Expected true, false, or 'only-arrows'.");
    }

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, SelectionMode value, JsonSerializerOptions options)
    {
        switch (value)
        {
            case SelectionMode.Enabled: writer.WriteBooleanValue(true); break;
            case SelectionMode.Disabled: writer.WriteBooleanValue(false); break;
            case SelectionMode.OnlyArrows: writer.WriteStringValue("only-arrows"); break;
            default: throw new JsonException($"Invalid SelectionMode enum value: {value}");
        }
    }
}

/// <summary>
/// Converts a C# <see cref="TimeMode"/> enum to the JSON boolean or number required by Vanilla Calendar.
/// </summary>
public sealed class TimeModeConverter : JsonConverter<TimeMode>
{
    /// <inheritdoc />
    public override TimeMode Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.False) return TimeMode.Disabled;
        if (reader.TokenType == JsonTokenType.Number)
        {
            int val = reader.GetInt32();
            return val switch
            {
                12 => TimeMode.TwelveHour,
                24 => TimeMode.TwentyFourHour,
                _ => throw new JsonException($"Invalid number value for TimeMode: {val}. Expected 12 or 24.")
            };
        }
        throw new JsonException("Invalid value for TimeMode. Expected false, 12, or 24.");
    }

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, TimeMode value, JsonSerializerOptions options)
    {
        switch (value)
        {
            case TimeMode.Disabled: writer.WriteBooleanValue(false); break;
            case TimeMode.TwelveHour: writer.WriteNumberValue(12); break;
            case TimeMode.TwentyFourHour: writer.WriteNumberValue(24); break;
            default: throw new JsonException($"Invalid TimeMode enum value: {value}");
        }
    }
}

/// <summary>
/// Converts a C# dictionary with <see cref="DateOnly"/> keys to a JSON object with "YYYY-MM-DD" string keys.
/// </summary>
public sealed class PopupsConverter : JsonConverter<IReadOnlyDictionary<DateOnly, Popup>>
{
    /// <inheritdoc />
    public override IReadOnlyDictionary<DateOnly, Popup> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var stringKeyDict = JsonSerializer.Deserialize<Dictionary<string, Popup>>(ref reader, options);
        if (stringKeyDict == null) return new Dictionary<DateOnly, Popup>();

        var result = new Dictionary<DateOnly, Popup>();
        foreach (var (key, value) in stringKeyDict)
        {
            if (!DateOnly.TryParseExact(key, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
            {
                throw new JsonException($"Invalid popup date key '{key}'. Expected 'yyyy-MM-dd'.");
            }
            result[date] = value;
        }
        return result;
    }

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, IReadOnlyDictionary<DateOnly, Popup> value, JsonSerializerOptions options)
    {
        var stringKeyDict = value.ToDictionary(
            kvp => kvp.Key.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
            kvp => kvp.Value
        );
        JsonSerializer.Serialize(writer, stringKeyDict, options);
    }
}

/// <summary>
/// Converts a C# enum to its camelCase string representation.
/// </summary>
public sealed class CamelCaseEnumValueConverter<T> : JsonConverter<T> where T : struct, Enum
{
    private readonly JsonNamingPolicy _namingPolicy = JsonNamingPolicy.CamelCase;

    /// <inheritdoc />
    public override T Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        string? enumString = reader.GetString();
        if (enumString == null) throw new JsonException($"Cannot convert null to {typeof(T).Name}.");

        foreach (var memberName in Enum.GetNames<T>())
        {
            if (string.Equals(_namingPolicy.ConvertName(memberName), enumString, StringComparison.OrdinalIgnoreCase))
            {
                return Enum.Parse<T>(memberName);
            }
        }
        throw new JsonException($"Unable to convert \"{enumString}\" to enum {typeof(T).Name}.");
    }

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, T value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(_namingPolicy.ConvertName(value.ToString()));
    }
}

/// <summary>
/// Converts the <see cref="SelectionDatesMode"/> enum to its JSON representation, handling the special 'multiple-ranged' kebab-case and 'Disabled' as boolean false.
/// </summary>
public sealed class SelectionDatesModeConverter : JsonConverter<SelectionDatesMode>
{
    /// <inheritdoc />
    public override SelectionDatesMode Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.False) return SelectionDatesMode.Disabled;
        if (reader.TokenType != JsonTokenType.String) throw new JsonException("Expected a string or boolean false for SelectionDatesMode.");

        string? value = reader.GetString();
        if (string.Equals(value, "multiple-ranged", StringComparison.OrdinalIgnoreCase) ||
            string.Equals(value, "multipleRanged", StringComparison.OrdinalIgnoreCase))
        {
            return SelectionDatesMode.MultipleRanged;
        }
        if (Enum.TryParse<SelectionDatesMode>(value, ignoreCase: true, out var result)) return result;

        throw new JsonException($"Invalid string value for SelectionDatesMode: '{value}'.");
    }

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, SelectionDatesMode value, JsonSerializerOptions options)
    {
        switch (value)
        {
            case SelectionDatesMode.Disabled:
                writer.WriteBooleanValue(false);
                break;
            case SelectionDatesMode.MultipleRanged:
                writer.WriteStringValue("multiple-ranged");
                break;
            default:
                writer.WriteStringValue(JsonNamingPolicy.CamelCase.ConvertName(value.ToString()));
                break;
        }
    }
}

#endregion

/// <summary>
/// Provides a source-generated JSON context for serializing <see cref="VanillaCalendarOptions"/>.
/// Using this context improves performance and is required for AOT (Ahead-Of-Time) compilation scenarios like Blazor WebAssembly.
/// </summary>
[JsonSourceGenerationOptions(
    WriteIndented = false,
    PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase,
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault
)]
[JsonSerializable(typeof(RizzyUI.VanillaCalendarOptions))]
internal partial class VanillaCalendarJsonContext : JsonSerializerContext { }