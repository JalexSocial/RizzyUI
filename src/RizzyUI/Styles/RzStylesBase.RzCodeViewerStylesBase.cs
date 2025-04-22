namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzCodeViewer Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCodeViewer" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCodeViewer" /> component.
        /// </summary>
        public abstract class RzCodeViewerStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzCodeViewerStylesBase" /> class. </summary>
            protected RzCodeViewerStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the main RzCodeViewer container div (margin, overflow). </summary>
            public abstract string Container { get; }
    
            /// <summary> Gets the CSS classes for the configuration header div (layout, padding, border, background, typography). </summary>
            public abstract string Header { get; }
    
            /// <summary> Gets the CSS classes for the title span within the header. </summary>
            public abstract string HeaderTitle { get; }
    
            /// <summary> Gets the CSS classes for the main code display container div (border, rounding, overflow). </summary>
            public abstract string CodeContainer { get; }
    
            /// <summary> Gets the CSS classes for the div containing the copy button (layout, border, background). </summary>
            public abstract string CopyButtonContainer { get; }
    
            /// <summary> Gets the CSS classes for the copy button (layout, padding, rounding, focus styles). </summary>
            public abstract string CopyButton { get; }
    
            /// <summary> Gets the CSS classes for the SVG icon when the content is not yet copied. </summary>
            public abstract string CopyIconDefault { get; }
    
            /// <summary> Gets the CSS classes for the SVG icon when the content has been copied. </summary>
            public abstract string CopyIconCopied { get; }
    
            /// <summary> Gets the CSS classes for the div wrapping the pre/code block (positioning, overflow). </summary>
            public abstract string PreWrapper { get; }
    
            /// <summary> Gets the CSS classes for the pre element (typography, padding, overflow, border). </summary>
            public abstract string PreElement { get; }
    
            // Note: Code element classes are added by Highlight.js and theme variables
            /// <summary> Gets the CSS classes for the expand/collapse button (layout, padding, border, background, focus styles). </summary>
            public abstract string ExpandButton { get; }
    
            /// <summary> Gets the CSS classes for the expand/collapse SVG icon (size, transition). </summary>
            public abstract string ExpandIcon { get; }
    
            /// <summary> Gets the CSS classes for the PreWrapper div based on the expand state (e.g., max-height). </summary>
            /// <param name="isExpanded">Whether the code view is expanded.</param>
            /// <returns>A string of CSS classes.</returns>
            public abstract string GetExpandContentCss(bool isExpanded);
    
            /// <summary> Gets the CSS classes for the expand icon based on the expand state (e.g., rotate-180). </summary>
            /// <param name="isExpanded">Whether the code view is expanded.</param>
            /// <returns>A string of CSS classes.</returns>
            public abstract string GetExpandButtonIconCss(bool isExpanded);
    
            /// <summary> Gets the CSS classes for the copy button based on the copied state (e.g., focus outline color). </summary>
            /// <param name="isCopied">Whether the code has just been copied.</param>
            /// <returns>A string of CSS classes.</returns>
            public abstract string GetCopyButtonStateCss(bool isCopied);
        }
    
        #endregion
}
