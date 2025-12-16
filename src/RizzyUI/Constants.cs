
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
        // Ensure leading slash is removed if present, as ContentUrl assumes relative path from wwwroot
        path = path.TrimStart('/');
        return $"/_content/{PackageName}/{path}";
    }

    /// <summary>
    /// Contains constant definitions for custom JavaScript event names dispatched or listened to by RizzyUI components.
    /// Using these constants ensures consistency and avoids magic strings.
    /// </summary>
    public static class Events
    {
        /// <summary>
        /// Fired by RizzyUI immediately before Alpine initializes.
        /// </summary>
        public const string Initialize = "rz:init";

        /// <summary>
        /// The default event name that the RzDialog component listens for to trigger closing via external sources (e.g., HTMX HX-Trigger header).
        /// Can be overridden via the `CloseEventName` parameter on RzDialog.
        /// </summary>
        /// <remarks>Value: "rz:modal-close"</remarks>
        public const string DialogClose = "rz:dialog-close";

        /// <summary>
        /// Fired by the RzDialog Alpine component once during initialization, after its properties are set but before listeners are attached.
        /// Detail: `{ modalId: string, bodyId: string, footerId: string }`
        /// </summary>
        /// <remarks>Value: "rz:modal-initialized"</remarks>
        public const string DialogInitialized = "rz:dialog-initialized";

        /// <summary>
        /// Fired by the RzDialog Alpine component just before the modal's `modalOpen` state is set to `true`. This event is cancelable.
        /// Detail: `{ modalId: string, originalEvent: Event | null }`
        /// </summary>
        /// <remarks>Value: "rz:modal-before-open"</remarks>
        public const string DialogBeforeOpen = "rz:dialog-before-open";

        /// <summary>
        /// Fired by the RzDialog Alpine component after the modal's `modalOpen` state is set to `true` and opening transitions are likely complete.
        /// Detail: `{ modalId: string }`
        /// </summary>
        /// <remarks>Value: "rz:modal-after-open"</remarks>
        public const string DialogAfterOpen = "rz:dialog-after-open";

        /// <summary>
        /// Fired by the RzDialog Alpine component just before the modal's `modalOpen` state is set to `false`. This event is cancelable.
        /// Detail: `{ modalId: string, reason: 'escape' | 'backdrop' | 'button' | 'event' }`
        /// </summary>
        /// <remarks>Value: "rz:modal-before-close"</remarks>
        public const string DialogBeforeClose = "rz:dialog-before-close";

        /// <summary>
        /// Fired by the RzDialog Alpine component after the modal's `modalOpen` state is set to `false` and closing transitions are likely complete.
        /// Detail: `{ modalId: string }`
        /// </summary>
        /// <remarks>Value: "rz:modal-after-close"</remarks>
        public const string DialogAfterClose = "rz:dialog-after-close";
    }

    /// <summary>
    /// Events specific to the RzCalendar component, mirroring Vanilla Calendar Pro actions.
    /// </summary>
    public static class CalendarEvents
    {
        /// <summary>Fired when the calendar initializes.</summary>
        public const string Init = "rz:calendar:init";

        /// <summary>Fired when the calendar is destroyed.</summary>
        public const string Destroy = "rz:calendar:destroy";

        /// <summary>Fired when a day is clicked.</summary>
        public const string ClickDay = "rz:calendar:clickDay";

        /// <summary>Fired when a week number is clicked.</summary>
        public const string ClickWeekNumber = "rz:calendar:clickWeekNumber";

        /// <summary>Fired when a month is clicked in the header.</summary>
        public const string ClickMonth = "rz:calendar:clickMonth";

        /// <summary>Fired when a year is clicked in the header.</summary>
        public const string ClickYear = "rz:calendar:clickYear";

        /// <summary>Fired when navigation arrows are clicked.</summary>
        public const string ClickArrow = "rz:calendar:clickArrow";

        /// <summary>Fired when time is changed.</summary>
        public const string ChangeTime = "rz:calendar:changeTime";

        /// <summary>Fired when the view changes (e.g. month switch).</summary>
        public const string ChangeView = "rz:calendar:changeView";

        /// <summary>Fired when dates are selected/deselected.</summary>
        public const string SelectDate = "rz:calendar:selectDate";
    }
}