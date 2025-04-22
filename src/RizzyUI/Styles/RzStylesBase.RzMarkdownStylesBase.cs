namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzMarkdown Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzMarkdown" /> component container.
        /// </summary>
        public abstract class RzMarkdownStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzMarkdownStylesBase" /> class. </summary>
            protected RzMarkdownStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary>
            ///     Gets the base CSS classes for the RzMarkdown container div (prose base, dark mode, text color, max-width
            ///     reset).
            /// </summary>
            public abstract string Container { get; }
    
            /// <summary> Gets the prose width utility class based on the specified width. </summary>
            /// <param name="width">The desired prose width.</param>
            /// <returns>A string representing a Tailwind prose width class (e.g., "prose-wide").</returns>
            public abstract string GetProseWidthCss(ProseWidth width);
        }
    
        #endregion
}
