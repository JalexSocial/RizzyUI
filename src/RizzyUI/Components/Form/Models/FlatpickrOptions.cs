using System.Text.Json.Serialization;
using Jalex.UI.Components.Form.Converters;

namespace RizzyUI;

/// <summary>
///     Specifies the selection mode for the date picker.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Mode
{
    /// <summary>
    ///     Single date selection mode.
    /// </summary>
    Single,

    /// <summary>
    ///     Multiple date selection mode.
    /// </summary>
    Multiple,

    /// <summary>
    ///     Range selection mode, allowing a start and end date.
    /// </summary>
    Range,

    /// <summary>
    ///     Time-only selection mode, hiding the calendar.
    /// </summary>
    Time
}

/// <summary>
///     Defines how the month selector in the calendar is displayed.
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum MonthSelectorType
{
    /// <summary>
    ///     Displays the month selector as a dropdown.
    /// </summary>
    Dropdown,

    /// <summary>
    ///     Displays the month selector as a static list.
    /// </summary>
    Static
}

/// <summary>
///     Specifies the positioning strategy for the Flatpickr calendar.
/// </summary>
[JsonConverter(typeof(CalendarPositionConverter))]
public enum CalendarPosition
{
    /// <summary>
    ///     Automatic positioning based on available space.
    /// </summary>
    Auto,

    /// <summary>
    ///     Force the calendar to appear above the input.
    /// </summary>
    Above,

    /// <summary>
    ///     Force the calendar to appear below the input.
    /// </summary>
    Below,

    /// <summary>
    ///     Automatic placement with left alignment.
    /// </summary>
    AutoLeft,

    /// <summary>
    ///     Automatic placement with center alignment.
    /// </summary>
    AutoCenter,

    /// <summary>
    ///     Automatic placement with right alignment.
    /// </summary>
    AutoRight,

    /// <summary>
    ///     Force the calendar above and aligned to the left.
    /// </summary>
    AboveLeft,

    /// <summary>
    ///     Force the calendar above and centered horizontally.
    /// </summary>
    AboveCenter,

    /// <summary>
    ///     Force the calendar above and aligned to the right.
    /// </summary>
    AboveRight,

    /// <summary>
    ///     Force the calendar below and aligned to the left.
    /// </summary>
    BelowLeft,

    /// <summary>
    ///     Force the calendar below and centered horizontally.
    /// </summary>
    BelowCenter,

    /// <summary>
    ///     Force the calendar below and aligned to the right.
    /// </summary>
    BelowRight
}

/// <summary>
///     Represents a date range used to enable or disable selection in the date picker.
/// </summary>
public class CalendarDateRange
{
    /// <summary>
    ///     Gets or sets the starting date for this range.
    /// </summary>
    public DateTime From { get; set; }

    /// <summary>
    ///     Gets or sets the ending date for this range. May be null if only a single date is used.
    /// </summary>
    public DateTime? To { get; set; }
}

/// <summary>
///     Configuration options for Flatpickr date/time picker.
/// </summary>
public class FlatpickrOptions
{
    /// <summary>
    ///     Allows the user to enter a date directly into the input field. By default, direct entry is disabled.
    /// </summary>
    [JsonPropertyName("allowInput")]
    public bool? AllowInput { get; set; }

    /// <summary>
    ///     Allows preloading of an invalid date. Useful when you're using date strings as default values, or if the input
    ///     element is optional.
    /// </summary>
    [JsonPropertyName("allowInvalidPreload")]
    public bool? AllowInvalidPreload { get; set; }

    /// <summary>
    ///     Exactly the same as date format, but for the altInput field.
    /// </summary>
    [JsonPropertyName("altFormat")]
    public string? AltFormat { get; set; }

    /// <summary>
    ///     Show the user a readable date (as per altFormat), but return something totally different to the server.
    /// </summary>
    [JsonPropertyName("altInput")]
    public bool? AltInput { get; set; }

    /// <summary>
    ///     This class will be added to the input element created by the altInput option. Note that altInput already inherits
    ///     classes from the original input.
    /// </summary>
    [JsonPropertyName("altInputClass")]
    public string? AltInputClass { get; set; }

    /// <summary>
    ///     Whether to enable animations, such as month transitions.
    /// </summary>
    [JsonPropertyName("animate")]
    public bool? Animate { get; set; }

    /// <summary>
    ///     Defines how the date will be formatted in the aria-label for calendar days, using the same tokens as dateFormat.
    ///     Defaults to "F j, Y".
    /// </summary>
    [JsonPropertyName("ariaDateFormat")]
    public string? AriaDateFormat { get; set; }

    /// <summary>
    ///     Whether the default time should be auto-filled when the input is empty and gains or loses focus. Defaults to true.
    /// </summary>
    [JsonPropertyName("autoFillDefaultTime")]
    public bool? AutoFillDefaultTime { get; set; }

    /// <summary>
    ///     Whether clicking on the input should open the picker. Set it to false if you only want to open the calendar
    ///     programmatically.
    /// </summary>
    [JsonPropertyName("clickOpens")]
    public bool? ClickOpens { get; set; }

    /// <summary>
    ///     Whether calendar should close after date selection. By default, the calendar stays open unless the user clicks
    ///     outside of it.
    /// </summary>
    [JsonPropertyName("closeOnSelect")]
    public bool? CloseOnSelect { get; set; }

    /// <summary>
    ///     If "mode" is "multiple", this string will be used to join selected dates together for the date input value.
    /// </summary>
    [JsonPropertyName("conjunction")]
    public string? Conjunction { get; set; }

    /// <summary>
    ///     A string of characters which are used to define how the date will be displayed in the input box.
    /// </summary>
    [JsonPropertyName("dateFormat")]
    public string? DateFormat { get; set; }

    /// <summary>
    ///     The initial selected date(s).
    /// </summary>
    [JsonPropertyName("defaultDate")]
    public string? DefaultDate { get; set; }

    /// <summary>
    ///     Initial value of the hour element, when no date is selected.
    /// </summary>
    [JsonPropertyName("defaultHour")]
    public int? DefaultHour { get; set; }

    /// <summary>
    ///     Initial value of the minute element, when no date is selected.
    /// </summary>
    [JsonPropertyName("defaultMinute")]
    public int? DefaultMinute { get; set; }

    /// <summary>
    ///     Initial value of the seconds element, when no date is selected.
    /// </summary>
    [JsonPropertyName("defaultSeconds")]
    public int? DefaultSeconds { get; set; }

    /// <summary>
    ///     Disables certain dates, preventing them from being selected.
    /// </summary>
    [JsonPropertyName("disable")]
    public List<CalendarDateRange>? Disable { get; set; }

    /// <summary>
    ///     Set this to true to always use the non-native picker on mobile devices.
    ///     By default, Flatpickr utilizes native datetime widgets unless certain options (e.g., disable) are used.
    /// </summary>
    [JsonPropertyName("disableMobile")]
    public bool? DisableMobile { get; set; }

    /// <summary>
    ///     Disables all dates except for those specified.
    /// </summary>
    [JsonPropertyName("enable")]
    public List<CalendarDateRange>? Enable { get; set; }

    /// <summary>
    ///     Enables seconds selection in the time picker.
    /// </summary>
    [JsonPropertyName("enableSeconds")]
    public bool? EnableSeconds { get; set; }

    /// <summary>
    ///     Enables the time picker.
    /// </summary>
    [JsonPropertyName("enableTime")]
    public bool? EnableTime { get; set; }

    /// <summary>
    ///     Adjusts the step for the hour input (incl. scrolling).
    /// </summary>
    [JsonPropertyName("hourIncrement")]
    public int? HourIncrement { get; set; }

    /// <summary>
    ///     Displays the calendar inline.
    /// </summary>
    [JsonPropertyName("inline")]
    public bool? Inline { get; set; }

    /// <summary>
    ///     The locale, either as a string (e.g., "ru", "en") or as an object.
    /// </summary>
    [JsonPropertyName("locale")]
    public string? Locale { get; set; }

    /// <summary>
    ///     The maximum date that a user can pick to (inclusive).
    /// </summary>
    [JsonPropertyName("maxDate")]
    public DateTime? MaxDate { get; set; }

    /// <summary>
    ///     The maximum time that a user can pick to (inclusive).
    /// </summary>
    [JsonPropertyName("maxTime")]
    public DateTime? MaxTime { get; set; }

    /// <summary>
    ///     The minimum date that a user can start picking from (inclusive).
    /// </summary>
    [JsonPropertyName("minDate")]
    public DateTime? MinDate { get; set; }

    /// <summary>
    ///     The minimum time that a user can start picking from (inclusive).
    /// </summary>
    [JsonPropertyName("minTime")]
    public DateTime? MinTime { get; set; }

    /// <summary>
    ///     Adjusts the step for the minute input (incl. scrolling). Defaults to 5.
    /// </summary>
    [JsonPropertyName("minuteIncrement")]
    public int? MinuteIncrement { get; set; }

    /// <summary>
    ///     Date selection mode, defaults to "single".
    /// </summary>
    [JsonPropertyName("mode")]
    public Mode? Mode { get; set; }

    /// <summary>
    ///     How the month selector in the calendar should be shown. Can be set to "dropdown" to display a dropdown
    ///     menu for month selection, or "static" to display the months as a static list.
    /// </summary>
    [JsonPropertyName("monthSelectorType")]
    public MonthSelectorType? MonthSelectorType { get; set; }

    /// <summary>
    ///     HTML for the right arrow icon, used to switch months.
    /// </summary>
    [JsonPropertyName("nextArrow")]
    public string? NextArrow { get; set; }

    /// <summary>
    ///     Hides the day selection in the calendar. Use it along with "enableTime" to create a time picker.
    /// </summary>
    [JsonPropertyName("noCalendar")]
    public bool? NoCalendar { get; set; }

    /// <summary>
    ///     How the calendar should be positioned with regards to the input. Can accept multiple positioning options like
    ///     "auto", "above", "below", "auto left", "auto right", etc.
    /// </summary>
    [JsonPropertyName("position")]
    public CalendarPosition? CalendarPosition { get; set; }

    /// <summary>
    ///     HTML for the left arrow icon, used to switch months.
    /// </summary>
    [JsonPropertyName("prevArrow")]
    public string? PrevArrow { get; set; }

    /// <summary>
    ///     Whether to display the current month name in shorthand mode, e.g., "Sep" instead of "September".
    /// </summary>
    [JsonPropertyName("shorthandCurrentMonth")]
    public bool? ShorthandCurrentMonth { get; set; }

    /// <summary>
    ///     Creates a wrapper to position the calendar. Useful if the input is inside a scrollable element or you need the
    ///     calendar to be positioned in a specific way relative to the input.
    /// </summary>
    [JsonPropertyName("static")]
    public bool? Static { get; set; }

    /// <summary>
    ///     Sets the number of months to show in the calendar. Useful for displaying multiple months at once.
    /// </summary>
    [JsonPropertyName("showMonths")]
    public int? ShowMonths { get; set; }

    /// <summary>
    ///     Displays time picker in 24-hour mode without AM/PM selection when enabled.
    /// </summary>
    [JsonPropertyName("time_24hr")]
    public bool? Time24Hr { get; set; }

    /// <summary>
    ///     Display week numbers to the left of the calendar.
    /// </summary>
    [JsonPropertyName("weekNumbers")]
    public bool? WeekNumbers { get; set; }

    /// <summary>
    ///     See https://chmln.github.io/flatpickr/examples/#flatpickr-external-elements. Allows the flatpickr calendar to wrap
    ///     around a custom input and open/close the calendar when this input is focused or clicked.
    /// </summary>
    [JsonPropertyName("wrap")]
    public bool? Wrap { get; set; }
}