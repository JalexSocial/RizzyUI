namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzBadge Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzBadge" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzBadge" /> component.
        /// </summary>
        public abstract class RzBadgeStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzBadgeStylesBase" /> class. </summary>
            protected RzBadgeStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzBadge span element (layout, border, font). </summary>
            public abstract string Badge { get; }
    
            /// <summary> Gets the CSS classes for the inner span containing the icon and text content (padding, alignment). </summary>
            public abstract string InnerSpan { get; }
    
            /// <summary> Gets the variant-specific CSS classes (border, background, text color) for a standard badge. </summary>
            /// <param name="color">The semantic color for the badge.</param>
            /// <returns>A string of CSS classes.</returns>
            public abstract string GetVariantCss(SemanticColor color);
    
            /// <summary> Gets the variant-specific CSS classes (border, background, text color) for a "soft" badge. </summary>
            /// <param name="color">The semantic color for the badge.</param>
            /// <returns>A string of CSS classes.</returns>
            public abstract string GetVariantSoftCss(SemanticColor color);
        }
    
        #endregion
}
