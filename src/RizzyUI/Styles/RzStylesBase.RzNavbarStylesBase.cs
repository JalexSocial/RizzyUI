namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzNavbar Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzNavbar" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzNavbar" /> component.
        /// </summary>
        public abstract class RzNavbarStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzNavbarStylesBase" /> class. </summary>
            protected RzNavbarStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzNavbar nav element (positioning, size, layout, border, background, blur). </summary>
            public abstract string Navbar { get; }
    
            /// <summary> Gets the CSS classes for the mobile toggle button (visibility, layout, text color). </summary>
            public abstract string ToggleButton { get; }
    
            /// <summary> Gets the CSS classes for the icon container inside the toggle button (text size). </summary>
            public abstract string ToggleButtonIconContainer { get; }
    
            /// <summary> Gets the CSS classes for the screen-reader-only span inside the toggle button. </summary>
            public abstract string ToggleButtonSrText { get; }
    
            /// <summary> Gets the CSS classes for the main content container div within the navbar (size, layout). </summary>
            public abstract string ContentContainer { get; }
        }
    
        #endregion
}
