namespace RizzyUI;

/// <summary>
/// Abstract base class defining the structure for component style definitions.
/// Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
/// allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    #region RzModal Styles

    /// <summary>
    /// Defines the abstract structure for styling the <see cref="RzModal"/> component.
    /// </summary>
    public abstract class RzModalStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzModalStylesBase"/> class. </summary>
        protected RzModalStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the CSS classes for the modal backdrop overlay. </summary>
        public abstract string Backdrop { get; }

        /// <summary> Gets the base CSS classes for the modal dialog container. Size class is added separately. </summary>
        public abstract string Dialog { get; }

        /// <summary> Gets the CSS classes for the modal header section. </summary>
        public abstract string Header { get; }

        /// <summary> Gets the CSS classes for the container div optionally wrapping the title content. </summary>
        public abstract string TitleContainer { get; }

        /// <summary> Gets the CSS classes for the modal title (h3) element. </summary>
        public abstract string Title { get; }

        /// <summary> Gets the CSS classes for the container div holding the close button. </summary>
        public abstract string CloseButtonContainer { get; }

        /// <summary> Gets the CSS classes for the close button element. </summary>
        public abstract string CloseButton { get; }

        /// <summary> Gets the CSS classes for the icon within the close button. </summary>
        public abstract string CloseButtonIcon { get; }

        /// <summary> Gets the CSS classes for the modal body section. </summary>
        public abstract string Body { get; }

        /// <summary> Gets the CSS classes for the modal footer section. </summary>
        public abstract string Footer { get; }

        /// <summary> Gets the size-specific max-width CSS class for the modal dialog. </summary>
        /// <param name="size">The desired modal size.</param>
        /// <returns>A string representing a max-width class (e.g., "max-w-lg").</returns>
        public abstract string GetSizeCss(ModalSize size);
    }

    #endregion
}