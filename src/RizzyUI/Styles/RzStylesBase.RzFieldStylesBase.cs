namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzField Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzField" /> container component.
        /// </summary>
        public abstract class RzFieldStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzFieldStylesBase" /> class. </summary>
            protected RzFieldStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzField container div (layout, spacing). </summary>
            public abstract string Field { get; }
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzFieldLabel{TValue}" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzFieldLabel" /> component.
        /// </summary>
        public abstract class RzFieldLabelStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzFieldLabelStylesBase" /> class. </summary>
            protected RzFieldLabelStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzFieldLabel label element (typography). </summary>
            public abstract string Label { get; }
    
            /// <summary> Gets the CSS classes for the required indicator span (color, typography). </summary>
            public abstract string RequiredIndicator { get; }
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzFieldHelp" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzFieldHelp" /> component.
        /// </summary>
        public abstract class RzFieldHelpStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzFieldHelpStylesBase" /> class. </summary>
            protected RzFieldHelpStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzFieldHelp p element (typography, color). </summary>
            public abstract string HelpText { get; }
        }
    
        #endregion
}
