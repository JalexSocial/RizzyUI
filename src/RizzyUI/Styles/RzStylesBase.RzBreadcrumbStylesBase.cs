namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    #region RzBreadcrumb Styles

    /// <summary>
    ///     Defines the abstract structure for styling the RzBreadcrumb component family.
    /// </summary>
    public abstract class RzBreadcrumbStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzBreadcrumbStylesBase" /> class. </summary>
        protected RzBreadcrumbStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the RzBreadcrumb nav element. </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes for the ordered list (ol) element wrapping the items. </summary>
        public abstract string List { get; }

        /// <summary> Gets the CSS classes for the list item (li) element. </summary>
        public abstract string Item { get; }

        /// <summary> Gets the CSS classes for the anchor (a) element used for navigation links. </summary>
        public abstract string Link { get; }

        /// <summary> Gets the CSS classes for the span element used for the current page. </summary>
        public abstract string Page { get; }

        /// <summary> Gets the CSS classes for the separator element. </summary>
        public abstract string Separator { get; }

        /// <summary> Gets the CSS classes for the ellipsis container span. </summary>
        public abstract string EllipsisContainer { get; }
        
        /// <summary> Gets the CSS classes for the ellipsis icon SVG. </summary>
        public abstract string EllipsisIcon { get; }
    }

    #endregion
}