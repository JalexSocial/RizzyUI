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
        ///     Defines the abstract structure for styling the <see cref="RzBreadcrumb" /> component container.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzBreadcrumb" /> component.
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
    
            /// <summary> Gets the base CSS classes for the RzBreadcrumb nav element (typography, margin). </summary>
            public abstract string Container { get; }
    
            /// <summary> Gets the CSS classes for the ordered list (ol) element wrapping the items (layout, gap). </summary>
            public abstract string List { get; }
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling individual items within the <see cref="RzBreadcrumb" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzBreadcrumbItem" /> component.
        /// </summary>
        public abstract class RzBreadcrumbItemStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzBreadcrumbItemStylesBase" /> class. </summary>
            protected RzBreadcrumbItemStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the CSS classes for the list item (li) element (layout, gap, base text color). </summary>
            public abstract string ListItem { get; }
    
            /// <summary> Gets the CSS classes for the anchor (a) element used for non-active items (hover states). </summary>
            public abstract string Link { get; }
    
            /// <summary> Gets the CSS classes for the span element used for the active item (font weight). </summary>
            public abstract string ActiveSpan { get; }
    
            /// <summary> Gets the CSS classes for the span wrapping an icon, if used. </summary>
            public abstract string IconSpan { get; }
        }
    
        #endregion
}
