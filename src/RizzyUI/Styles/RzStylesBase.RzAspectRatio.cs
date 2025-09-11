
namespace RizzyUI;

public abstract partial class RzStylesBase
{
    /// <summary>
    /// Defines the abstract structure for styling the <see cref="RzAspectRatio" /> component.
    /// </summary>
    public abstract class RzAspectRatioStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzAspectRatioStylesBase" /> class. </summary>
        protected RzAspectRatioStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        /// Gets the base CSS classes for the outer wrapper div that creates the aspect ratio.
        /// </summary>
        public abstract string Wrapper { get; }

        /// <summary>
        /// Gets the CSS classes for the inner div that contains the child content.
        /// </summary>
        public abstract string Inner { get; }
    }
}