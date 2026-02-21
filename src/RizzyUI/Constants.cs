
namespace RizzyUI;

/// <summary>
/// Contains constant values used throughout the RizzyUI library.
/// </summary>
public static class Constants
{
    /// <summary>
    /// Package name used for content resolution.
    /// </summary>
    public const string PackageName = "RizzyUI";

    /// <summary>
    /// Conventional name for RizzyLocalization override resource files provided by the consuming application.
    /// </summary>
    public const string RizzyLocalizationResourceName = "RizzyLocalization";

    /// <summary>
    /// Resolves path to internal package assets.
    /// </summary>
    /// <param name="path">The relative path within the package's wwwroot.</param>
    /// <returns>A URL path suitable for referencing package content (e.g., /_content/RizzyUI/js/rizzyui.js).</returns>
    public static string ContentUrl(string path)
    {
        path = path.TrimStart('/');
        return $"/_content/{PackageName}/{path}";
    }

    /// <summary>
    /// Contains constant definitions for custom JavaScript event names dispatched or listened to by RizzyUI components.
    /// </summary>
    public static class Events
    {
        /// <summary>Fired by RizzyUI immediately before Alpine initializes.</summary>
        public const string Initialize = "rz:init";

        /// <summary>The default event name for dialog closing.</summary>
        public const string DialogClose = "rz:dialog-close";
        
        /// <summary>Fired when dialog is initialized.</summary>
        public const string DialogInitialized = "rz:dialog-initialized";
        
        /// <summary>Fired before dialog opens.</summary>
        public const string DialogBeforeOpen = "rz:dialog-before-open";
        
        /// <summary>Fired after dialog opens.</summary>
        public const string DialogAfterOpen = "rz:dialog-after-open";
        
        /// <summary>Fired before dialog closes.</summary>
        public const string DialogBeforeClose = "rz:dialog-before-close";
        
        /// <summary>Fired after dialog closes.</summary>
        public const string DialogAfterClose = "rz:dialog-after-close";

        /// <summary>Fired after color changes.</summary>
        public const string ColorPickerOnChange = "rz:colorpicker:on-change";

        /// <summary>Fired when any OTP input slot value is modified.</summary>
        public const string InputOTPOnInput = "rz:inputotp:oninput";

        /// <summary>Fired when OTP input changes and all slots are filled.</summary>
        public const string InputOTPOnChange = "rz:inputotp:onchange";
    }

    /// <summary>
    /// Events specific to the RzCalendar component.
    /// Standardized to kebab-case for consistency with DOM event patterns.
    /// </summary>
    public static class CalendarEvents
    {
        /// <summary>Fired when the calendar initializes.</summary>
        public const string Init = "rz:calendar:init";

        /// <summary>Fired when the calendar is destroyed.</summary>
        public const string Destroy = "rz:calendar:destroy";

        /// <summary>Fired when a day is clicked (maps to VCP onClickDate).</summary>
        public const string ClickDay = "rz:calendar:click-day";

        /// <summary>Fired when a week number is clicked (maps to VCP onClickWeekNumber).</summary>
        public const string ClickWeekNumber = "rz:calendar:click-week-number";

        /// <summary>Fired when a month is clicked in the header (maps to VCP onClickMonth).</summary>
        public const string ClickMonth = "rz:calendar:click-month";

        /// <summary>Fired when a year is clicked in the header (maps to VCP onClickYear).</summary>
        public const string ClickYear = "rz:calendar:click-year";

        /// <summary>Fired when navigation arrows are clicked (maps to VCP onClickArrow).</summary>
        public const string ClickArrow = "rz:calendar:click-arrow";

        /// <summary>Fired when time is changed (maps to VCP onChangeTime).</summary>
        public const string ChangeTime = "rz:calendar:change-time";

        /// <summary>Fired when the view changes (e.g. month switch).</summary>
        public const string ChangeView = "rz:calendar:change-view";

        /// <summary>Fired when dates are selected/deselected.</summary>
        public const string SelectDate = "rz:calendar:select-date";

        /// <summary>
        /// Fired by the RzCalendarProvider when a range selection is completed (both start and end dates are set).
        /// This event bubbles and is composed, making it suitable for closing popovers.
        /// </summary>
        public const string RangeComplete = "rz:calendar:range-complete";
    }
}