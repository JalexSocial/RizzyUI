namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    #region RzArticle Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzArticle" /> layout component.
    /// </summary>
    public abstract class RzArticleStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzArticleStylesBase" /> class. </summary>
        protected RzArticleStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzArticle container div (layout, text color). </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes for the inner div wrapping the article and aside (layout, max-width, overflow). </summary>
        public abstract string InnerContainer { get; }

        /// <summary> Gets the base CSS classes for the article element. Prose width is applied separately. </summary>
        public abstract string Article { get; }

        /// <summary>
        ///     Gets the base CSS classes for the aside element (side content: layout, overflow, padding, typography). Width
        ///     and positioning are applied separately.
        /// </summary>
        public abstract string Aside { get; }

        /// <summary> Gets the prose width utility class based on the specified width. </summary>
        /// <param name="width">The desired prose width.</param>
        /// <returns>A string representing a Tailwind prose width class.</returns>
        public abstract string GetArticleProseCss(ProseWidth width);

        /// <summary> Gets the CSS classes for the aside element based on column width and fixed state. </summary>
        /// <param name="columnWidth">The desired width of the aside column.</param>
        /// <param name="isFixed">Whether the aside should be fixed-positioned.</param>
        /// <returns>A string of CSS classes including width and positioning.</returns>
        public abstract string GetAsideCss(Size columnWidth, bool isFixed);

        /// <summary>
        ///     Gets the CSS class for the main container's right padding, used to prevent content overlap with a fixed
        ///     aside.
        /// </summary>
        /// <param name="columnWidth">The width of the aside column.</param>
        /// <returns>A string representing a right padding class (e.g., "xl:pr-72").</returns>
        public abstract string GetContainerPaddingCss(Size columnWidth);
    }

    #endregion
}