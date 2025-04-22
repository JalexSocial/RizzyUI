namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    #region RzHeading Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzHeading" /> component.
    /// </summary>
    public abstract class RzHeadingStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzHeadingStylesBase" /> class. </summary>
        protected RzHeadingStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the level-specific CSS classes for the heading element (margins, responsive text sizes, font weight). </summary>
        /// <param name="level">The heading level (H1-H4).</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetLevelCss(HeadingLevel level);
    }

    #endregion
}