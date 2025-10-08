
namespace RizzyUI;

public abstract partial class RzStylesBase
{
    /// <summary>
    /// Defines the abstract structure for styling the <see cref="RzKbdGroup" /> component.
    /// </summary>
    public abstract class RzKbdGroupStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzKbdGroupStylesBase" /> class. </summary>
        protected RzKbdGroupStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        /// Gets the base CSS classes for the RzKbdGroup kbd element.
        /// </summary>
        public abstract string Group { get; }
    }
}