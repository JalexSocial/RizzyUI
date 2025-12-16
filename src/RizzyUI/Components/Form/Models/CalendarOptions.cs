
#nullable enable
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
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
    /// <summary>Date selection is disabled.</summary>
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

/// <summary>
/// Defines the available controls for the time picker.
/// </summary>
[JsonConverter(typeof(CamelCaseEnumValueConverter<TimeControl>))]
public enum TimeControl
{
    /// <summary>All controls (input fields and range sliders) are enabled.</summary>
    All,
    /// <summary>Only the range sliders are enabled for time selection.</summary>
    Range
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

/// <summary>
/// Defines the ARIA labels for calendar navigation arrows.
/// </summary>
public record ArrowLabels
{
    /// <summary>The ARIA label for the "next month" arrow.</summary>
    [JsonPropertyName("month")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Month { get; init; }

    /// <summary>The ARIA label for the "next year" arrow in the year view.</summary>
    [JsonPropertyName("year")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Year { get; init; }
}

/// <summary>
/// Defines all ARIA labels for accessibility.
/// </summary>
public record Labels
{
    /// <summary>The top-level application label.</summary>
    [JsonPropertyName("application")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Application { get; init; }

    /// <summary>The label for the main navigation toolbar.</summary>
    [JsonPropertyName("navigation")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Navigation { get; init; }

    /// <summary>Labels for the "next" navigation arrows.</summary>
    [JsonPropertyName("arrowNext")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public ArrowLabels? ArrowNext { get; init; }

    /// <summary>Labels for the "previous" navigation arrows.</summary>
    [JsonPropertyName("arrowPrev")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public ArrowLabels? ArrowPrev { get; init; }

    /// <summary>Label for the month selection button.</summary>
    [JsonPropertyName("month")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Month { get; init; }

    /// <summary>Label for the list of months view.</summary>
    [JsonPropertyName("months")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Months { get; init; }

    /// <summary>Label for the year selection button.</summary>
    [JsonPropertyName("year")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Year { get; init; }

    /// <summary>Label for the list of years view.</summary>
    [JsonPropertyName("years")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Years { get; init; }

    /// <summary>Label for the row of weekdays.</summary>
    [JsonPropertyName("week")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Week { get; init; }

    /// <summary>Label for the week numbers column.</summary>
    [JsonPropertyName("weekNumber")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? WeekNumber { get; init; }

    /// <summary>Label for the grid of dates.</summary>
    [JsonPropertyName("dates")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Dates { get; init; }

    /// <summary>Label for the time selection group.</summary>
    [JsonPropertyName("selectingTime")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? SelectingTime { get; init; }

    /// <summary>Label for the hour input field.</summary>
    [JsonPropertyName("inputHour")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? InputHour { get; init; }

    /// <summary>Label for the minute input field.</summary>
    [JsonPropertyName("inputMinute")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? InputMinute { get; init; }

    /// <summary>Label for the hour range slider.</summary>
    [JsonPropertyName("rangeHour")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? RangeHour { get; init; }

    /// <summary>Label for the minute range slider.</summary>
    [JsonPropertyName("rangeMinute")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? RangeMinute { get; init; }

    /// <summary>Label for the AM/PM toggle button.</summary>
    [JsonPropertyName("btnKeeping")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? BtnKeeping { get; init; }
}

/// <summary>
/// Defines custom HTML layouts for different calendar views.
/// </summary>
public record Layouts
{
    /// <summary>The layout for the default single-month view.</summary>
    [JsonPropertyName("default")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Default { get; init; }

    /// <summary>The layout for the multiple-month view.</summary>
    [JsonPropertyName("multiple")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Multiple { get; init; }

    /// <summary>The layout for the month selection view.</summary>
    [JsonPropertyName("month")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Month { get; init; }

    /// <summary>The layout for the year selection view.</summary>
    [JsonPropertyName("year")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Year { get; init; }
}

/// <summary>
/// Provides overrides for the CSS classes used to style the calendar.
/// </summary>
public record Styles
{
    /// <summary>CSS class for the main calendar container.</summary>
    [JsonPropertyName("calendar")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Calendar { get; init; }
    
    // Add other style properties as needed...
}

/// <summary>
/// Represents a value that can be a specific date or the string "today".
/// </summary>
[JsonConverter(typeof(DateAnyConverter))]
public readonly struct DateAny
{
    private readonly object _value;
    private DateAny(object value) => _value = value;
    
    /// <summary>Represents the current date.</summary>
    public static readonly DateAny Today = new("today");
    
    /// <summary>Creates a DateAny from a DateOnly value.</summary>
    public static implicit operator DateAny(DateOnly date) => new(date);
    /// <summary>Creates a DateAny from a DateTime value (time part is ignored).</summary>
    public static implicit operator DateAny(DateTime date) => new(DateOnly.FromDateTime(date));
}

// --- Main Options Record ---

/// <summary>
/// Represents the complete set of options for initializing a Vanilla Calendar Pro instance.
/// </summary>
public record VanillaCalendarOptions
{
    private static readonly string[] TwelveHourAcceptFormats = { "hh:mm tt", "h:mm tt", "hh:mmtt", "h:mmtt" };
    private static readonly string[] TwentyFourAcceptFormats = { "HH:mm", "H:mm" };

    /// <summary>
    /// The primary constructor used for deserialization.
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
    public DayOfWeek FirstWeekday { get; init; } = DayOfWeek.Sunday;

    /// <summary>
    /// The number of months to jump when navigating with the arrows. Defaults to 1.
    /// </summary>
    [JsonPropertyName("monthsToSwitch")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int MonthsToSwitch { get; init; } = 1;

    /// <summary>
    /// A CSS selector for an element attribute that holds the theme name (e.g., "html[data-theme]"). Defaults to "html[data-theme]".
    /// </summary>
    [JsonPropertyName("themeAttrDetect")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string ThemeAttrDetect { get; init; } = "html[data-theme]";

    /// <summary>
    /// Sets the language localization of the calendar using a BCP 47 language tag (e.g., "en-US", "de-AT"). Defaults to "en".
    /// </summary>
    [JsonPropertyName("locale")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string Locale { get; init; } = "en";

    /// <summary>
    /// Defines which day is considered "today". Can be a specific date or <see cref="DateAny.Today"/>. Defaults to <see cref="DateAny.Today"/>.
    /// </summary>
    [JsonPropertyName("dateToday")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public DateAny DateToday { get; init; } = DateAny.Today;

    /// <summary>
    /// The absolute minimum date the calendar can render. Defaults to 1970-01-01.
    /// </summary>
    [JsonPropertyName("dateMin")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public DateAny DateMin { get; init; } = new DateOnly(1970, 1, 1);

    /// <summary>
    /// The absolute maximum date the calendar can render. Defaults to 2470-12-31.
    /// </summary>
    [JsonPropertyName("dateMax")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public DateAny DateMax { get; init; } = new DateOnly(2470, 12, 31);

    /// <summary>
    /// The minimum date that can be selected by the user.
    /// </summary>
    [JsonPropertyName("displayDateMin")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public DateAny? DisplayDateMin { get; init; }

    /// <summary>
    /// The maximum date that can be selected by the user.
    /// </summary>
    [JsonPropertyName("displayDateMax")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public DateAny? DisplayDateMax { get; init; }

    /// <summary>
    /// If true, shows dates from the previous and next months in the current month's view. Defaults to true.
    /// </summary>
    [JsonPropertyName("displayDatesOutside")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool DisplayDatesOutside { get; init; } = true;

    /// <summary>
    /// If true, renders disabled dates within the calendar's absolute min/max range. Defaults to false.
    /// </summary>
    [JsonPropertyName("displayDisabledDates")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool DisplayDisabledDates { get; init; } = false;

    /// <summary>
    /// The number of months to display. Defaults to 1 to match default CalendarType.Default.
    /// Use values > 1 when Type is Multiple.
    /// </summary>
    [JsonPropertyName("displayMonthsCount")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int DisplayMonthsCount { get; init; } = 1;

    /// <summary>
    /// A list of dates to disable.
    /// </summary>
    [JsonPropertyName("disableDates")]
    [JsonConverter(typeof(DateOnlyRangeListConverter))]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<DateOnly>? DisableDates { get; init; }

    /// <summary>
    /// If true, disables all dates, intended to be used with <see cref="EnableDates"/> to create an "allow-list". Defaults to false.
    /// </summary>
    [JsonPropertyName("disableAllDates")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool DisableAllDates { get; init; } = false;

    /// <summary>
    /// If true, disables all dates in the past. Defaults to false.
    /// </summary>
    [JsonPropertyName("disableDatesPast")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool DisableDatesPast { get; init; } = false;

    /// <summary>
    /// If true, prevents selecting a date range that includes a disabled date. Defaults to false.
    /// </summary>
    [JsonPropertyName("disableDatesGaps")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool DisableDatesGaps { get; init; } = false;

    /// <summary>
    /// A list of weekdays to disable.
    /// </summary>
    [JsonPropertyName("disableWeekdays")]
    [JsonConverter(typeof(DayOfWeekListConverter))]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<DayOfWeek>? DisableWeekdays { get; init; }

    /// <summary>
    /// If true, removes the special styling for the "today" date. Defaults to false.
    /// </summary>
    [JsonPropertyName("disableToday")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool DisableToday { get; init; } = false;

    /// <summary>
    /// A list of dates to enable, typically used when <see cref="DisableAllDates"/> is true.
    /// </summary>
    [JsonPropertyName("enableDates")]
    [JsonConverter(typeof(DateOnlyRangeListConverter))]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<DateOnly>? EnableDates { get; init; }

    /// <summary>
    /// If true, when selecting a range, the `selectedDates` array will only contain the start and end dates. Defaults to true.
    /// </summary>
    [JsonPropertyName("enableEdgeDatesOnly")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool EnableEdgeDatesOnly { get; init; } = true;

    /// <summary>
    /// If true, clicking a selected date will deselect it. Defaults to true.
    /// </summary>
    [JsonPropertyName("enableDateToggle")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool EnableDateToggle { get; init; } = true;

    /// <summary>
    /// If true, displays the week number column. Defaults to false.
    /// </summary>
    [JsonPropertyName("enableWeekNumbers")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool EnableWeekNumbers { get; init; } = false;

    /// <summary>
    /// If true, clicking a date from an outside month will switch to that month. Defaults to true.
    /// </summary>
    [JsonPropertyName("enableMonthChangeOnDayClick")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool EnableMonthChangeOnDayClick { get; init; } = true;

    /// <summary>
    /// If true, the calendar will open to the month of the first selected date. Defaults to false.
    /// </summary>
    [JsonPropertyName("enableJumpToSelectedDate")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool EnableJumpToSelectedDate { get; init; } = false;

    /// <summary>
    /// Determines whether selecting one or multiple days is allowed. Defaults to <see cref="SelectionDatesMode.Single"/>.
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
    /// A list of dates that will be selected when the calendar is initialized.
    /// </summary>
    [JsonPropertyName("selectedDates")]
    [JsonConverter(typeof(DateOnlyRangeListConverter))]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<DateOnly>? SelectedDates { get; init; }

    /// <summary>
    /// The month to display on initialization (0-11). If not set, defaults to the current month or the month of a selected date.
    /// </summary>
    [JsonPropertyName("selectedMonth")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? SelectedMonth { get; init; }

    /// <summary>
    /// The year to display on initialization. If not set, defaults to the current year or the year of a selected date.
    /// </summary>
    [JsonPropertyName("selectedYear")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? SelectedYear { get; init; }

    /// <summary>
    /// A list of dates to style as holidays.
    /// </summary>
    [JsonPropertyName("selectedHolidays")]
    [JsonConverter(typeof(DateOnlyRangeListConverter))]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<DateOnly>? SelectedHolidays { get; init; }

    /// <summary>
    /// The days of the week to style as weekends. Defaults to Saturday and Sunday.
    /// </summary>
    [JsonPropertyName("selectedWeekends")]
    [JsonConverter(typeof(DayOfWeekListConverter))]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyList<DayOfWeek>? SelectedWeekends { get; init; }

    /// <summary>
    /// The theme to apply to the calendar. Can be "light", "dark", "system", or a custom theme name. Defaults to "system".
    /// </summary>
    [JsonPropertyName("selectedTheme")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string SelectedTheme { get; init; } = "system";

    /// <summary>
    /// The minimum hour that can be selected (0-23). Defaults to 0.
    /// </summary>
    [JsonPropertyName("timeMinHour")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int TimeMinHour { get; init; } = 0;

    /// <summary>
    /// The maximum hour that can be selected (0-23). Defaults to 23.
    /// </summary>
    [JsonPropertyName("timeMaxHour")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int TimeMaxHour { get; init; } = 23;

    /// <summary>
    /// The minimum minute that can be selected (0-59). Defaults to 0.
    /// </summary>
    [JsonPropertyName("timeMinMinute")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int TimeMinMinute { get; init; } = 0;

    /// <summary>
    /// The maximum minute that can be selected (0-59). Defaults to 59.
    /// </summary>
    [JsonPropertyName("timeMaxMinute")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int TimeMaxMinute { get; init; } = 59;

    /// <summary>
    /// The type of controls to show for time selection. Defaults to <see cref="TimeControl.All"/>.
    /// </summary>
    [JsonPropertyName("timeControls")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public TimeControl TimeControls { get; init; } = TimeControl.All;

    /// <summary>
    /// The step increment for the hour slider. Defaults to 1.
    /// </summary>
    [JsonPropertyName("timeStepHour")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int TimeStepHour { get; init; } = 1;

    /// <summary>
    /// The step increment for the minute slider. Defaults to 1.
    /// </summary>
    [JsonPropertyName("timeStepMinute")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public int TimeStepMinute { get; init; } = 1;

    /// <summary>
    /// A dictionary of popups to display on hover for specific dates.
    /// </summary>
    [JsonPropertyName("popups")]
    [JsonConverter(typeof(PopupsConverter))]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IReadOnlyDictionary<DateOnly, Popup>? Popups { get; init; }

    /// <summary>
    /// Overrides for ARIA labels for accessibility.
    /// </summary>
    [JsonPropertyName("labels")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Labels? Labels { get; init; }

    /// <summary>
    /// Overrides for the HTML structure of the calendar views.
    /// </summary>
    [JsonPropertyName("layouts")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Layouts? Layouts { get; init; }

    /// <summary>
    /// Overrides for the CSS classes used to style the calendar components.
    /// </summary>
    [JsonPropertyName("styles")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public Styles? Styles { get; init; }

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
    /// Settings object for deeper configuration.
    /// </summary>
    [JsonPropertyName("settings")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public object? Settings { get; init; }

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

/// <summary>
/// Converts a C# <see cref="DateAny"/> struct to the JSON string required by Vanilla Calendar.
/// </summary>
public sealed class DateAnyConverter : JsonConverter<DateAny>
{
    /// <inheritdoc />
    public override DateAny Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var str = reader.GetString();
        if (string.Equals(str, "today", StringComparison.OrdinalIgnoreCase)) return DateAny.Today;
        if (DateOnly.TryParseExact(str, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date)) return date;
        throw new JsonException($"Invalid value for DateAny: '{str}'. Expected 'today' or a 'yyyy-MM-dd' date string.");
    }

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, DateAny value, JsonSerializerOptions options)
    {
        var val = typeof(DateAny).GetField("_value", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)?.GetValue(value);
        if (val is string s) writer.WriteStringValue(s);
        else if (val is DateOnly d) writer.WriteStringValue(d.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
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