namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzTab Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzTabs" /> container.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzTabs" /> component.
        /// </summary>
        public abstract class RzTabsStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzTabsStylesBase" /> class. </summary>
            protected RzTabsStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the main RzTabs container div (which holds Alpine.js x-data). </summary>
            public abstract string Container { get; }
    
            /// <summary> Gets the CSS classes for the div containing the TabPanels. </summary>
            public abstract string PanelsContainer { get; }
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzTabStrip" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzTabStrip" /> component.
        /// </summary>
        public abstract class RzTabStripStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzTabStripStylesBase" /> class. </summary>
            protected RzTabStripStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzTabStrip container div (positioning, layout). </summary>
            public abstract string Strip { get; }
    
            /// <summary>
            ///     Gets the CSS classes for the tab marker div used for selection indication (positioning, size, transitions,
            ///     pseudo-element setup).
            /// </summary>
            public abstract string Marker { get; }
    
            /// <summary> Gets the CSS classes for the inner div within the marker. </summary>
            public abstract string MarkerInner { get; }
    
            /// <summary> Gets the grid columns CSS class based on the number of tabs. </summary>
            /// <param name="tabCount">The number of tabs.</param>
            /// <returns>A string representing a grid columns class (e.g., "grid-cols-3").</returns>
            public abstract string GetColumnsCss(int tabCount);
    
            /// <summary> Gets the gap CSS class based on the specified spacing size. </summary>
            /// <param name="spaceBetween">The desired gap size.</param>
            /// <returns>A string representing a gap class (e.g., "gap-2").</returns>
            public abstract string GetGapCss(Size spaceBetween);
    
            /// <summary> Gets the background color class for the marker's ::after pseudo-element based on the specified SemanticColor. </summary>
            /// <param name="color">The semantic color for the marker underline.</param>
            /// <returns>A string representing a background color class prefixed with 'after:' (e.g., "after:bg-primary").</returns>
            public abstract string GetMarkerAfterBackgroundCss(SemanticColor color);
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzTab" /> button component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzTab" /> component.
        /// </summary>
        public abstract class RzTabStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzTabStylesBase" /> class. </summary>
            protected RzTabStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary>
            ///     Gets the base CSS classes for the RzTab button element (positioning, layout, size, cursor, whitespace,
            ///     rounding, typography, transitions).
            /// </summary>
            public abstract string Button { get; }
    
            /// <summary> Gets the justification CSS class based on the Justify enum. </summary>
            /// <param name="justify">The desired justification.</param>
            /// <returns>A string representing a justify-content class (e.g., "justify-center").</returns>
            public abstract string GetJustifyCss(Justify justify);
    
            /// <summary> Gets the text color CSS class for the tab in its non-selected state. </summary>
            /// <param name="color">The semantic color specified by the parent RzTabs.</param>
            /// <returns>A string representing a text color class.</returns>
            public abstract string GetTextColorCss(SemanticColor color);
    
            /// <summary> Gets the background color CSS class for the tab in its non-selected state. </summary>
            /// <param name="color">The semantic color specified by the parent RzTabs.</param>
            /// <returns>A string representing a background color class.</returns>
            public abstract string GetBackgroundColorCss(SemanticColor color);
            // Note: Selected text color is handled dynamically via Alpine :class binding based on RzTabs parameter
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzTabPanel" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzTabPanel" /> component.
        /// </summary>
        public abstract class RzTabPanelStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzTabPanelStylesBase" /> class. </summary>
            protected RzTabPanelStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the outer container div of the RzTabPanel (positioning). </summary>
            public abstract string OuterContainer { get; }
    
            /// <summary>
            ///     Gets the base CSS classes for the inner content div of the RzTabPanel (padding/background are often applied
            ///     via attributes).
            /// </summary>
            public abstract string InnerContainer { get; }
    
            /// <summary> Gets the text color CSS class, typically inherited from the parent RzTabs component. </summary>
            /// <param name="color">The semantic text color specified by the parent RzTabs.</param>
            /// <returns>A string representing a text color class.</returns>
            public abstract string GetTextColorCss(SemanticColor color);
        }
    
        #endregion
}
