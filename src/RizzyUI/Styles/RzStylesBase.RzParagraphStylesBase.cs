namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzParagraph Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzParagraph" /> component.
        /// </summary>
        public abstract class RzParagraphStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzParagraphStylesBase" /> class. </summary>
            protected RzParagraphStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzParagraph p element (margin, leading). </summary>
            public abstract string Paragraph { get; }
    
            /// <summary> Gets the prose width utility class based on the specified width. </summary>
            /// <param name="width">The desired prose width.</param>
            /// <returns>A string representing a Tailwind prose width class.</returns>
            public abstract string GetProseWidthCss(ProseWidth width);
        }
    
        #endregion
}
