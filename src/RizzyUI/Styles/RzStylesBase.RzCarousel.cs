
namespace RizzyUI;

public abstract partial class RzStylesBase
{
    /// <summary>
    /// Defines the abstract structure for styling the <see cref="RzCarousel" /> component family.
    /// </summary>
    public abstract class RzCarouselStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzCarouselStylesBase" /> class. </summary>
        protected RzCarouselStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the root RzCarousel container. </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes for the wrapper div that contains the Alpine.js component. </summary>
        public abstract string Wrapper { get; }

        /// <summary> Gets the CSS classes for the viewport element that clips the content. </summary>
        public abstract string Viewport { get; }

        /// <summary> Gets the CSS classes for the content container that holds the items. </summary>
        public abstract string Content { get; }

        /// <summary> Gets the CSS classes for each individual carousel item. </summary>
        public abstract string Item { get; }

        /// <summary> Gets the CSS classes for the 'previous' navigation button. </summary>
        public abstract string PreviousButton { get; }

        /// <summary> Gets the CSS classes for the 'next' navigation button. </summary>
        public abstract string NextButton { get; }

        /// <summary> Gets the CSS classes for the icons inside the navigation buttons. </summary>
        public abstract string ButtonIcon { get; }
    }
}