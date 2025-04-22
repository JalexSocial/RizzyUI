namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    #region RzFormSection Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzFormSection" /> component.
    /// </summary>
    public abstract class RzFormSectionStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzFormSectionStylesBase" /> class. </summary>
        protected RzFormSectionStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzFormSection container div (layout determined by method). </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes for the description container div (layout determined by method). </summary>
        public abstract string DescriptionContainer { get; }

        /// <summary> Gets the CSS classes for the title h2 element (typography). </summary>
        public abstract string Title { get; }

        /// <summary> Gets the CSS classes for the description p element (typography). </summary>
        public abstract string Description { get; }

        /// <summary> Gets the CSS classes for the content container div (layout determined by method). </summary>
        public abstract string ContentContainer { get; }

        /// <summary> Gets the layout-specific CSS classes for the main container div. </summary>
        /// <param name="layout">The section layout type.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetLayoutCss(SectionLayout layout);

        /// <summary> Gets the layout-specific CSS classes for the description container div. </summary>
        /// <param name="layout">The section layout type.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetDescriptionLayoutCss(SectionLayout layout);

        /// <summary> Gets the layout-specific CSS classes for the content container div. </summary>
        /// <param name="layout">The section layout type.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetContentLayoutCss(SectionLayout layout);
    }

    #endregion
}