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
        /// The default event name that the RzModal component listens for to trigger closing via external sources (e.g., HTMX HX-Trigger header).
        /// Can be overridden via the `CloseEventName` parameter on RzModal.
        /// </summary>
        /// <remarks>Value: "rz:modal-close"</remarks>
        public const string ModalClose = "rz:modal-close";

        /// <summary>
        /// Fired by the RzModal Alpine component once during initialization, after its properties are set but before listeners are attached.
        /// Detail: `{ modalId: string, bodyId: string, footerId: string }`
        /// </summary>
        /// <remarks>Value: "rz:modal-initialized"</remarks>
        public const string ModalInitialized = "rz:modal-initialized";

        /// <summary>
        /// Fired by the RzModal Alpine component just before the modal's `modalOpen` state is set to `true`. This event is cancelable.
        /// Detail: `{ modalId: string, originalEvent: Event | null }`
        /// </summary>
        /// <remarks>Value: "rz:modal-before-open"</remarks>
        public const string ModalBeforeOpen = "rz:modal-before-open";

        /// <summary>
        /// Fired by the RzModal Alpine component after the modal's `modalOpen` state is set to `true` and opening transitions are likely complete.
        /// Detail: `{ modalId: string }`
        /// </summary>
        /// <remarks>Value: "rz:modal-after-open"</remarks>
        public const string ModalAfterOpen = "rz:modal-after-open";

        /// <summary>
        /// Fired by the RzModal Alpine component just before the modal's `modalOpen` state is set to `false`. This event is cancelable.
        /// Detail: `{ modalId: string, reason: 'escape' | 'backdrop' | 'button' | 'event' }`
        /// </summary>
        /// <remarks>Value: "rz:modal-before-close"</remarks>
        public const string ModalBeforeClose = "rz:modal-before-close";

        /// <summary>
        /// Fired by the RzModal Alpine component after the modal's `modalOpen` state is set to `false` and closing transitions are likely complete.
        /// Detail: `{ modalId: string }`
        /// </summary>
        /// <remarks>Value: "rz:modal-after-close"</remarks>
        public const string ModalAfterClose = "rz:modal-after-close";
    }
}