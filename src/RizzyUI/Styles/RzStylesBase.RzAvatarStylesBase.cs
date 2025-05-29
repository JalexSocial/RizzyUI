namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    #region RzAvatar Styles

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="RzAvatar" /> component.
    /// </summary>
    public abstract class RzAvatarStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzAvatarStylesBase" /> class. </summary>
        protected RzAvatarStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        ///     Gets the base CSS classes for the main RzAvatar container element (positioning, aspect ratio, object-fit, overflow). 
        ///     Size and shape are applied separately.
        /// </summary>
        public abstract string Container { get; }

        /// <summary>
        ///     Gets the CSS classes for the border if the Border parameter is true.
        /// </summary>
        public abstract string Border { get; }

        /// <summary> Gets the CSS classes for the avatar's shape (e.g., rounded-full, rounded-lg). </summary>
        /// <param name="shape">The desired avatar shape.</param>
        /// <returns>A string of CSS classes.</returns>
        public abstract string GetShapeCss(AvatarShape shape);

        /// <summary> Gets the CSS classes for the avatar's overall size (width and height). </summary>
        /// <param name="size">The desired avatar size.</param>
        /// <returns>A string of CSS classes (e.g., "size-10").</returns>
        public abstract string GetSizeCss(Size size);

        /// <summary> Gets the CSS classes for the text size of the initials, used by AvatarFallback. </summary>
        /// <param name="size">The corresponding avatar size.</param>
        /// <returns>A string of CSS classes (e.g., "text-base").</returns>
        public abstract string GetInitialsSizeCss(Size size);

        /// <summary> Gets the CSS classes for the size of the placeholder icon, used by AvatarFallback. </summary>
        /// <param name="size">The corresponding avatar size.</param>
        /// <returns>A string of CSS classes (e.g., "size-6").</returns>
        public abstract string GetPlaceholderSizeCss(Size size);
    }

    #endregion    
    #region AvatarImage Styles

    /// <summary>
    /// Defines the abstract structure for styling the AvatarImage component.
    /// </summary>
    public abstract class AvatarImageStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="AvatarImageStylesBase"/> class. </summary>
        protected AvatarImageStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the img element. Shape and size are applied dynamically. </summary>
        public abstract string Image { get; }
    }

    #endregion

    #region AvatarFallback Styles

    /// <summary>
    /// Defines the abstract structure for styling the AvatarFallback component.
    /// </summary>
    public abstract class AvatarFallbackStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="AvatarFallbackStylesBase"/> class. </summary>
        protected AvatarFallbackStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the initials container div. Size, shape, and text size are applied dynamically. </summary>
        public abstract string InitialsContainer { get; }

        /// <summary> Gets the base CSS classes for the placeholder container div. Size and shape are applied dynamically. </summary>
        public abstract string PlaceholderContainer { get; }

        /// <summary> Gets the base CSS classes for the placeholder SVG icon. Size is applied dynamically. </summary>
        public abstract string PlaceholderIcon { get; }
    }

    #endregion
}