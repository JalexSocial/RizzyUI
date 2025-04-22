namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    #region RzToggle Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzToggle" /> switch component.
    /// </summary>
    public abstract class RzToggleStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzToggleStylesBase" /> class. </summary>
        protected RzToggleStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the RzToggle input (checkbox) element, including base appearance, ::before
        ///     pseudo-element styles, and checked state styles.
        /// </summary>
        public abstract string Toggle { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzToggleField" /> component.
    /// </summary>
    public abstract class RzToggleFieldStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzToggleFieldStylesBase" /> class. </summary>
        protected RzToggleFieldStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the RzToggleField container (typically handled by
        ///     <see cref="RzFieldStylesBase" />).
        /// </summary>
        public abstract string Field { get; }

        /// <summary> Gets the CSS classes for the div containing the label and toggle switch (layout). </summary>
        public abstract string ContentWrapper { get; }

        /// <summary> Gets the CSS classes for the inner div structuring the label and toggle (layout, alignment). </summary>
        public abstract string InnerWrapper { get; }

        /// <summary> Gets the CSS classes for the <see cref="RzFieldLabel{TValue}" /> component when used within this field. </summary>
        public abstract string LabelInField { get; }

        /// <summary> Gets the CSS classes for the <see cref="RzToggle" /> component when used within this field (usually empty). </summary>
        public abstract string ToggleInField { get; }

        /// <summary> Gets the CSS classes for the Description span within the label. </summary>
        public abstract string DescriptionInLabel { get; }
    }

    #endregion
}