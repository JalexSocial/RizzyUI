namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    #region RzButton Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzButton" /> component.
    /// </summary>
    public abstract class RzButtonStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzButtonStylesBase" /> class. </summary>
        protected RzButtonStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the button element (layout, cursor, base typography, transitions). </summary>
        public abstract string Button { get; }

        /// <summary> Gets the CSS classes applied when the button has animation enabled (transforms, transitions). </summary>
        public abstract string Animated { get; }

        /// <summary> Gets the variant-specific CSS classes (background, text, focus styles) for a standard (solid) button. </summary>
        /// <param name="variant">The button variant type.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetVariantCss(ButtonVariant variant);

        /// <summary> Gets the variant-specific CSS classes (background, border, text, focus styles) for an outlined button. </summary>
        /// <param name="variant">The button variant type.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetVariantOutlineCss(ButtonVariant variant);

        /// <summary> Gets the size-specific CSS classes (padding, text size) for the button. </summary>
        /// <param name="size">The desired button size.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetSizeCss(Size size);
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzButtonGroup" /> component and its interaction with
    ///     child buttons.
    /// </summary>
    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzButtonGroup" /> component.
    /// </summary>
    public abstract class RzButtonGroupStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzButtonGroupStylesBase" /> class. </summary>
        protected RzButtonGroupStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the ButtonGroup container div (layout). </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes applied to the first button in a group (corner rounding). </summary>
        public abstract string GroupFirst { get; }

        /// <summary> Gets the CSS classes applied to the last button in a group (corner rounding, border adjustment). </summary>
        public abstract string GroupLast { get; }

        /// <summary>
        ///     Gets the CSS classes applied to buttons that are neither first nor last in a group (corner rounding, border
        ///     adjustment).
        /// </summary>
        public abstract string GroupMiddle { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzDarkModeToggle" /> button.
    /// </summary>
    public abstract class RzDarkmodeToggleStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzDarkmodeToggleStylesBase" /> class. </summary>
        protected RzDarkmodeToggleStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the DarkmodeToggle button element (layout, padding, base colors, transitions). </summary>
        public abstract string Button { get; }

        /// <summary> Gets the CSS classes for the icons (SVG/Blazicon) within the button (transitions). </summary>
        public abstract string Icon { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzSearchButton" /> component.
    /// </summary>
    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzSearchButton" /> component.
    /// </summary>
    public abstract class RzSearchButtonStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzSearchButtonStylesBase" /> class. </summary>
        protected RzSearchButtonStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the SearchButton button element (layout, border, background, typography,
        ///     transitions).
        /// </summary>
        public abstract string Button { get; }

        /// <summary> Gets the CSS classes for the inner div containing the icon and label (layout, gap). </summary>
        public abstract string InnerContainer { get; }

        /// <summary> Gets the CSS classes for the span wrapping the search icon (text size). </summary>
        public abstract string IconSpan { get; }
    }

    #endregion
}