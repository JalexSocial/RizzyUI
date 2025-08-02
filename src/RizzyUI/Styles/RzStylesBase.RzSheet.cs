
// src/RizzyUI/Styles/RzStylesBase.RzSheet.cs
namespace RizzyUI;

public abstract partial class RzStylesBase
{
    /// <summary>
    /// Defines the abstract structure for styling the <see cref="RzSheet" /> component family.
    /// </summary>
    public abstract class RzSheetStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzSheetStylesBase" /> class. </summary>
        protected RzSheetStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the CSS classes for the sheet overlay. </summary>
        public abstract string Overlay { get; }

        /// <summary> Gets the base CSS classes for the sheet content panel. </summary>
        public abstract string Content { get; }

        /// <summary> Gets the CSS classes for the default close button inside the content panel. </summary>
        public abstract string CloseButton { get; }

        /// <summary> Gets the CSS classes for the icon inside the close button. </summary>
        public abstract string CloseButtonIcon { get; }

        /// <summary> Gets the CSS classes for the sheet header container. </summary>
        public abstract string Header { get; }

        /// <summary> Gets the CSS classes for the sheet footer container. </summary>
        public abstract string Footer { get; }

        /// <summary> Gets the CSS classes for the sheet title element. </summary>
        public abstract string Title { get; }

        /// <summary> Gets the CSS classes for the sheet description element. </summary>
        public abstract string Description { get; }

        /// <summary> Gets the side-specific CSS classes for the sheet content panel. </summary>
        /// <param name="side">The side from which the sheet appears.</param>
        /// <returns>A string of CSS classes for positioning and animation.</returns>
        public abstract string GetSideCss(SheetSide side);
    }
}