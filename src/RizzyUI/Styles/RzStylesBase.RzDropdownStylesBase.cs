namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzDropdown Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzDropdown" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzDropdown" /> component.
        /// </summary>
        public abstract class RzDropdownStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzDropdownStylesBase" /> class. </summary>
            protected RzDropdownStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the main RzDropdown container div (usually empty or just display property). </summary>
            public abstract string Container { get; }
    
            /// <summary> Gets the CSS classes for the relative div that wraps both the trigger and the floating menu. </summary>
            public abstract string RelativeWrapper { get; }
    
            /// <summary> Gets the CSS classes for the div that wraps the trigger content (layout properties). </summary>
            public abstract string TriggerWrapper { get; }
    
            /// <summary>
            ///     Gets the CSS classes for the dropdown menu container div (positioning, width, rounding, shadow). Anchor
            ///     positioning classes are added dynamically.
            /// </summary>
            public abstract string MenuContainer { get; }
    
            /// <summary>
            ///     Gets the CSS classes for the inner div inside the menu container, which typically holds sections and provides
            ///     background/border styling.
            /// </summary>
            public abstract string MenuInnerContainer { get; }
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling sections within an <see cref="RzDropdown" />.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzDropdownSection" /> component.
        /// </summary>
        public abstract class RzDropdownSectionStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzDropdownSectionStylesBase" /> class. </summary>
            protected RzDropdownSectionStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzDropdownSection div (layout, padding). </summary>
            public abstract string Section { get; }
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling individual items within an <see cref="RzDropdownSection" />.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzDropdownMenuItem" /> component.
        /// </summary>
        public abstract class RzDropdownMenuItemStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzDropdownMenuItemStylesBase" /> class. </summary>
            protected RzDropdownMenuItemStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary>
            ///     Gets the base CSS classes for the RzDropdownMenuItem anchor (a) element (layout, rounding, cursor, border,
            ///     padding, typography, transitions, focus styles).
            /// </summary>
            public abstract string MenuItem { get; }
    
            /// <summary> Gets the CSS classes for the span wrapping the icon (typography size). </summary>
            public abstract string IconSpan { get; }
    
            /// <summary> Gets the CSS classes for the Blazicon component within the icon span (size, layout, opacity). </summary>
            public abstract string Icon { get; }
    
            /// <summary> Gets the CSS classes for the span containing the title text (flex grow). </summary>
            public abstract string TitleSpan { get; }
    
            /// <summary>
            ///     Gets the CSS classes for the div displaying the optional count badge (layout, rounding, border, padding,
            ///     typography).
            /// </summary>
            public abstract string CountDiv { get; }
        }
    
        #endregion
}
