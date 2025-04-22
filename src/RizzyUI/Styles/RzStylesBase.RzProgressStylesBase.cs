namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzProgress Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzProgress" /> component.
        /// </summary>
        public abstract class RzProgressStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzProgressStylesBase" /> class. </summary>
            protected RzProgressStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the main RzProgress container div (width). </summary>
            public abstract string Container { get; }
    
            /// <summary> Gets the CSS classes for the optional outside label container div (layout, margin). </summary>
            public abstract string OutsideLabelContainer { get; }
    
            /// <summary> Gets the CSS classes for the outside label text span (text color). </summary>
            public abstract string OutsideLabelText { get; }
    
            /// <summary>
            ///     Gets the CSS classes for the outer progress bar container div (track styling: layout, overflow, rounding,
            ///     background).
            /// </summary>
            public abstract string OuterBar { get; }
    
            /// <summary>
            ///     Gets the base CSS classes for the inner progress bar div (value indicator: layout, typography, transitions).
            ///     Variant styles are applied separately.
            /// </summary>
            public abstract string InnerBarBase { get; }
    
            /// <summary> Gets the CSS classes for the inside label container div (positioning). </summary>
            public abstract string InsideLabelContainer { get; }
    
            /// <summary> Gets the base CSS classes for the inside label text span (usually empty, styled by container). </summary>
            public abstract string InsideLabelText { get; }
    
            /// <summary> Gets the height CSS class for the OuterBar based on the label's position. </summary>
            /// <param name="position">The position of the label.</param>
            /// <returns>A string representing a height class (e.g., "h-4").</returns>
            public abstract string GetOuterBarHeightCss(ProgressLabelPosition position);
    
            /// <summary> Gets the variant-specific CSS classes for the InnerBar (height, rounding, background, text color). </summary>
            /// <param name="variant">The status color variant.</param>
            /// <returns>A string of CSS classes.</returns>
            public abstract string GetInnerBarVariantCss(StatusColor variant);
    
            /// <summary> Gets the text color CSS class for the InsideLabel when it overflows the InnerBar. </summary>
            /// <param name="overflows">Whether the label overflows the bar.</param>
            /// <returns>A string representing a text color class or an empty string.</returns>
            public abstract string GetInsideLabelColorCss(bool overflows);
        }
    
        #endregion
}
