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
            ///     Gets the base CSS classes for the main RzAvatar container element (positioning and object-fit). Size is
            ///     applied separately.
            /// </summary>
            public abstract string Container { get; }
    
            /// <summary>
            ///     Gets the CSS classes for the status indicator div (base style, border). Size and color are applied
            ///     separately.
            /// </summary>
            public abstract string Indicator { get; }
    
            /// <summary> Gets the base CSS classes for the img element. Size and shape are applied separately. </summary>
            public abstract string Image { get; }
    
            /// <summary>
            ///     Gets the base CSS classes for the initials container div (flex, alignment, base colors). Size, shape, and
            ///     text size are applied separately.
            /// </summary>
            public abstract string InitialsContainer { get; }
    
            /// <summary>
            ///     Gets the base CSS classes for the placeholder container div (flex, alignment, base colors). Size and shape
            ///     are applied separately.
            /// </summary>
            public abstract string PlaceholderContainer { get; }
    
            /// <summary> Gets the base CSS classes for the placeholder SVG icon. Size is applied separately. </summary>
            public abstract string PlaceholderIcon { get; }
    
            /// <summary> Gets the CSS classes for the avatar's shape (e.g., rounded-full, rounded-lg). </summary>
            /// <param name="shape">The desired avatar shape.</param>
            /// <returns>A string of CSS classes.</returns>
            public abstract string GetShapeCss(AvatarShape shape);
    
            /// <summary> Gets the CSS classes for the avatar's overall size (width and height). </summary>
            /// <param name="size">The desired avatar size.</param>
            /// <returns>A string of CSS classes (e.g., "size-10").</returns>
            public abstract string GetSizeCss(Size size);
    
            /// <summary> Gets the CSS classes for the text size of the initials. </summary>
            /// <param name="size">The corresponding avatar size.</param>
            /// <returns>A string of CSS classes (e.g., "text-base").</returns>
            public abstract string GetInitialsSizeCss(Size size);
    
            /// <summary> Gets the CSS classes for the size of the placeholder icon. </summary>
            /// <param name="size">The corresponding avatar size.</param>
            /// <returns>A string of CSS classes (e.g., "size-6").</returns>
            public abstract string GetPlaceholderSizeCss(Size size);
    
            /// <summary> Gets the CSS classes for the size of the status indicator. </summary>
            /// <param name="size">The corresponding avatar size.</param>
            /// <returns>A string of CSS classes (e.g., "size-3").</returns>
            public abstract string GetIndicatorSizeCss(Size size);
    
            /// <summary> Gets the CSS background color classes (light and dark) for the status indicator. </summary>
            /// <param name="color">The desired accent color.</param>
            /// <returns>A string of CSS classes (e.g., "bg-emerald-200 dark:bg-emerald-800").</returns>
            public abstract string GetIndicatorColorCss(AccentColor color);
        }
    
        #endregion
}
