namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    #region RzSpinner Styles

    /// <summary>
    /// Defines the abstract structure for styling the <see cref="RzSpinner" /> component.
    /// </summary>
    public abstract class RzSpinnerStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzSpinnerStylesBase" /> class. </summary>
        protected RzSpinnerStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the spinner SVG element (animation, default fill). </summary>
        public abstract string SpinnerBase { get; }

        /// <summary> Gets the size-specific CSS class for the spinner. </summary>
        /// <param name="size">The desired spinner size.</param>
        /// <returns>A string representing a size class (e.g., "size-6").</returns>
        public abstract string GetSizeCss(Size size);

        /// <summary> Gets the color-specific CSS fill class for the spinner. </summary>
        /// <param name="color">The semantic color for the spinner.</param>
        /// <returns>A string representing a fill color class (e.g., "fill-primary").</returns>
        public abstract string GetColorCss(SemanticColor color);
    }

    #endregion
}

