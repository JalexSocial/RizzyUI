namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzQuickReference Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzQuickReference" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzQuickReference" /> component.
        /// </summary>
        public abstract class RzQuickReferenceStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzQuickReferenceStylesBase" /> class. </summary>
            protected RzQuickReferenceStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzQuickReference container div (base text color). </summary>
            public abstract string Container { get; }
    
            /// <summary> Gets the CSS classes for the title paragraph (margin, font weight). </summary>
            public abstract string Title { get; }
    
            /// <summary> Gets the CSS classes for the list (ul) element containing heading links (layout, gap). </summary>
            public abstract string List { get; }
    
            /// <summary> Gets the base CSS classes for individual list items (li). Indentation is applied separately. </summary>
            public abstract string ListItem { get; }
    
            /// <summary> Gets the base CSS classes for the anchor (a) tag linking to headings. </summary>
            public abstract string Link { get; }
    
            /// <summary> Gets the CSS class applied to the link when it corresponds to the currently highlighted heading. </summary>
            public abstract string LinkSelected { get; }
    
            /// <summary>
            ///     Gets the indentation CSS class (e.g., "ml-4") for a list item based on its heading level relative to the
            ///     minimum level shown.
            /// </summary>
            /// <param name="level">The heading level of the item.</param>
            /// <param name="minLevel">The minimum heading level being displayed in the quick reference.</param>
            /// <returns>A string representing a margin-left class.</returns>
            public abstract string GetIndentationCss(HeadingLevel level, HeadingLevel minLevel);
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzQuickReferenceContainer" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzQuickReferenceContainer" /> component.
        /// </summary>
        public abstract class RzQuickReferenceContainerStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzQuickReferenceContainerStylesBase" /> class. </summary>
            protected RzQuickReferenceContainerStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzQuickReferenceContainer div (usually none). </summary>
            public abstract string Container { get; }
        }
    
        #endregion
}
