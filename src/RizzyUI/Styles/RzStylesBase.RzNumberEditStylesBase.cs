namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzNumber Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzNumberEdit{TValue}" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzNumberEdit" /> component.
        /// </summary>
        public abstract class RzNumberEditStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzNumberEditStylesBase" /> class. </summary>
            protected RzNumberEditStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the CSS classes for the relative div wrapping the input and prepend element. </summary>
            public abstract string InputWrapper { get; }
    
            /// <summary>
            ///     Gets the CSS classes for the prepend element div (positioning, layout, padding, border, background,
            ///     typography).
            /// </summary>
            public abstract string PrependElement { get; }
    
            /// <summary> Gets the CSS classes for the Blazicon component if PrependIcon is used (text size). </summary>
            public abstract string PrependIconContainer { get; }
    
            /// <summary>
            ///     Gets the base CSS classes for the input element (layout, rounding, border, padding, typography, focus
            ///     styles).
            /// </summary>
            public abstract string Input { get; }
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzNumberField{TValue}" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzNumberField" /> component.
        /// </summary>
        public abstract class RzNumberFieldStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzNumberFieldStylesBase" /> class. </summary>
            protected RzNumberFieldStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary>
            ///     Gets the base CSS classes for the RzNumberField container (typically handled by
            ///     <see cref="RzFieldStylesBase" />).
            /// </summary>
            public abstract string Field { get; }
        }
    
        #endregion
}
