namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    #region Typography Styles (Shared by RzHeading, RzParagraph)

    /// <summary>
    ///     Defines the abstract structure for base typography styling utilities used by components like
    ///     <see cref="RzHeading" /> and <see cref="RzParagraph" />.
    /// </summary>
    public abstract class RzTypographyStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzTypographyStylesBase" /> class. </summary>
        protected RzTypographyStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the CSS class corresponding to the specified text weight. </summary>
        /// <param name="weight">The desired text weight.</param>
        /// <returns>A string like "font-bold" or "".</returns>
        public abstract string GetTextWeightCss(TextWeight? weight);

        /// <summary> Gets the CSS class corresponding to the specified text size. </summary>
        /// <param name="size">The desired text size.</param>
        /// <returns>A string like "text-lg" or "".</returns>
        public abstract string GetTextSizeCss(TextSize? size);

        /// <summary> Gets the CSS class corresponding to the specified text transformation. </summary>
        /// <param name="transform">The desired text transformation.</param>
        /// <returns>A string like "uppercase" or "".</returns>
        public abstract string GetTextTransformCss(TextTransform? transform);

        /// <summary> Gets the CSS class corresponding to the specified text decoration. </summary>
        /// <param name="decoration">The desired text decoration.</param>
        /// <returns>A string like "underline" or "".</returns>
        public abstract string GetTextDecorationCss(TextDecoration? decoration);

        /// <summary> Gets the CSS class corresponding to the specified line height (leading). </summary>
        /// <param name="leading">The desired line height.</param>
        /// <returns>A string like "leading-relaxed" or "".</returns>
        public abstract string GetLineHeightCss(Leading? leading);

        /// <summary> Combines all individual typography style classes (color, weight, size, etc.) into a single string. </summary>
        /// <param name="textColor">Optional text color.</param>
        /// <param name="weight">Optional text weight.</param>
        /// <param name="size">Optional text size.</param>
        /// <param name="lineHeight">Optional line height.</param>
        /// <param name="decoration">Optional text decoration.</param>
        /// <param name="transform">Optional text transformation.</param>
        /// <returns>A consolidated string of CSS classes.</returns>
        public abstract string GetBaseCss(SemanticColor? textColor, TextWeight? weight, TextSize? size,
            Leading? lineHeight, TextDecoration? decoration, TextTransform? transform);
    }

    #endregion
}