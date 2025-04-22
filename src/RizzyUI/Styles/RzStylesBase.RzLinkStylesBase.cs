namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzLink Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzLink" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzLink" /> component.
        /// </summary>
        public abstract class RzLinkStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzLinkStylesBase" /> class. </summary>
            protected RzLinkStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzLink anchor (a) element (typography, color, focus styles). </summary>
            public abstract string Link { get; }
    
            /// <summary> Gets the CSS classes applied when underlining is enabled (hover/focus states). </summary>
            public abstract string UnderlineEnabled { get; }
        }
    
        #endregion
}
