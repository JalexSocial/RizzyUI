namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzBrowser Styles
        /// <summary>
        /// Defines the abstract structure for styling the <see cref="RzBrowser"/> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzBrowser" /> component.
        /// </summary>
        public abstract class RzBrowserStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
            /// <summary> Initializes a new instance of the <see cref="RzBrowserStylesBase"/> class. </summary>
            protected RzBrowserStylesBase(RzTheme theme) => Theme = theme;
            /// <summary> Gets the base CSS classes for the main RzBrowser container div. </summary>
            public abstract string Container { get; }
            /// <summary> Gets the CSS classes for the browser top bar (holding traffic lights and controls). </summary>
            public abstract string TopBar { get; }
            /// <summary> Gets the CSS classes for the traffic lights container. </summary>
            public abstract string TrafficLightsContainer { get; }
            /// <summary> Gets the CSS class for the red traffic light. </summary>
            public abstract string TrafficLightRed { get; }
            /// <summary> Gets the CSS class for the yellow traffic light. </summary>
            public abstract string TrafficLightYellow { get; }
            /// <summary> Gets the CSS class for the green traffic light. </summary>
            public abstract string TrafficLightGreen { get; }
            /// <summary> Gets the CSS classes for the screen size controls container (desktop only). </summary>
            public abstract string ScreenSizeControlsContainer { get; }
            /// <summary> Gets the CSS classes for the screen size control buttons' shared style. </summary>
            public abstract string ScreenSizeButton { get; }
            /// <summary> Gets the CSS classes for the inner div grouping the screen size buttons </summary>
            public abstract string ScreenSizeButtonGroup { get; }
            // Note: ScreenSizeButtonIcon is removed as its dynamic part is handled by Alpine :class
            /// <summary> Gets the CSS classes for the main content area div with the grid pattern. </summary>
            public abstract string ContentArea { get; }
            /// <summary> Gets the CSS classes for the inner container div that holds the actual preview/iframe. </summary>
            public abstract string PreviewContainer { get; }
            // Note: Methods for dynamic classes (GetBrowserBorderCss, GetDesktopScreenButtonCss, etc.) are REMOVED
        }
        #endregion
}
