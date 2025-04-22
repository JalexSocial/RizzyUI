namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzCheckbox Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCheckboxGroup{TValue}" /> container.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCheckboxGroup" /> component.
        /// </summary>
        public abstract class RzCheckboxGroupStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzCheckboxGroupStylesBase" /> class. </summary>
            protected RzCheckboxGroupStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzCheckboxGroup container div (layout, gap). </summary>
            public abstract string Container { get; }
    
            /// <summary> Gets the layout-specific CSS classes based on the Orientation (flex direction). </summary>
            /// <param name="orientation">The layout orientation.</param>
            /// <returns>A string of CSS classes.</returns>
            public abstract string GetOrientationCss(Orientation orientation);
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling individual <see cref="RzCheckboxGroupItem{TValue}" /> components.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCheckboxGroupItem" /> component.
        /// </summary>
        public abstract class RzCheckboxGroupItemStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzCheckboxGroupItemStylesBase" /> class. </summary>
            protected RzCheckboxGroupItemStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzCheckboxGroupItem label element (layout, cursor). </summary>
            public abstract string Label { get; }
    
            /// <summary> Gets the CSS classes for the relative div wrapping the checkbox input and icon. </summary>
            public abstract string CheckboxWrapper { get; }
    
            /// <summary> Gets the CSS classes for the checkbox input element itself (size, border, rounding, focus styles). </summary>
            public abstract string CheckboxInput { get; }
    
            /// <summary> Gets the CSS classes for the div containing the check icon (positioning, text color). </summary>
            public abstract string IconContainer { get; }
    
            /// <summary> Gets the CSS classes for the span containing the title text (margin). </summary>
            public abstract string TitleSpan { get; }
    
            /// <summary>
            ///     Returns the CSS class ("hidden" or "") to control the visibility of the check icon based on the checked
            ///     state.
            /// </summary>
            /// <param name="isChecked">Whether the checkbox is checked.</param>
            /// <returns>A string ("hidden" or "").</returns>
            public abstract string GetIconVisibilityCss(bool isChecked);
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCheckboxGroupField{TValue}" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCheckboxGroupField" /> component.
        /// </summary>
        public abstract class RzCheckboxGroupFieldStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzCheckboxGroupFieldStylesBase" /> class. </summary>
            protected RzCheckboxGroupFieldStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary>
            ///     Gets the base CSS classes for the RzCheckboxGroupField container (typically handled by
            ///     <see cref="RzFieldStylesBase" />).
            /// </summary>
            public abstract string Field { get; }
    
            /// <summary>
            ///     Gets the CSS classes applied specifically to the <see cref="RzCheckboxGroup{TValue}" /> when it's rendered
            ///     inside this field container (e.g., margins).
            /// </summary>
            public abstract string GroupWithinField { get; }
        }
    
        #endregion
}
