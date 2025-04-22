namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    #region RzRadio Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzRadioGroup{TValue}" /> container.
    /// </summary>
    public abstract class RzRadioGroupStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzRadioGroupStylesBase" /> class. </summary>
        protected RzRadioGroupStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzRadioGroup container div (layout, gap, padding). </summary>
        public abstract string Container { get; }

        /// <summary> Gets the grid column CSS class based on the orientation and item count. </summary>
        /// <param name="orientation">The layout orientation.</param>
        /// <param name="itemCount">The number of radio items.</param>
        /// <returns>A string representing a grid columns class (e.g., "grid-cols-1").</returns>
        public abstract string GetGridColumnsCss(Orientation orientation, int itemCount);
    }

    /// <summary>
    ///     Defines the abstract structure for styling individual <see cref="RzRadioGroupItem{TValue}" /> components.
    /// </summary>
    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzRadioGroupItem" /> component.
    /// </summary>
    public abstract class RzRadioGroupItemStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzRadioGroupItemStylesBase" /> class. </summary>
        protected RzRadioGroupItemStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzRadioGroupItem label element (layout). </summary>
        public abstract string LabelWrapper { get; }

        /// <summary> Gets the CSS classes for the visually hidden radio input element. </summary>
        public abstract string RadioInput { get; }

        /// <summary> Gets the CSS classes for the check icon container span (positioning, appearance, transitions). </summary>
        public abstract string IconContainer { get; }

        /// <summary>
        ///     Gets the CSS classes for the main clickable container span (layout, cursor, rounding, border, padding, peer
        ///     states).
        /// </summary>
        public abstract string ClickableContainer { get; }

        /// <summary> Gets the CSS classes for the div containing the optional icon and text content (layout). </summary>
        public abstract string ContentWrapper { get; }

        /// <summary> Gets the CSS classes for the optional leading icon div (margin, typography). </summary>
        public abstract string LeadingIconContainer { get; }

        /// <summary> Gets the CSS classes for the span holding the label and description (layout, padding). </summary>
        public abstract string TextContainer { get; }

        /// <summary> Gets the CSS classes for the label text span (margin, typography). </summary>
        public abstract string LabelText { get; }

        /// <summary> Gets the CSS classes for the description text span (layout, typography). </summary>
        public abstract string DescriptionText { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzRadioGroupField{TValue}" /> component.
    /// </summary>
    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzRadioGroupField" /> component.
    /// </summary>
    public abstract class RzRadioGroupFieldStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzRadioGroupFieldStylesBase" /> class. </summary>
        protected RzRadioGroupFieldStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the RzRadioGroupField container (typically handled by
        ///     <see cref="RzFieldStylesBase" />).
        /// </summary>
        public abstract string Field { get; }

        /// <summary>
        ///     Gets the CSS classes applied specifically to the <see cref="RzRadioGroup{TValue}" /> when it's rendered
        ///     inside this field container.
        /// </summary>
        public abstract string GroupWithinField { get; }
    }

    #endregion
}