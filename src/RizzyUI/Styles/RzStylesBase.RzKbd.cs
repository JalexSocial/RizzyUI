
namespace RizzyUI;

public abstract partial class RzStylesBase
{
    /// <summary>
    /// Defines the abstract structure for styling the <see cref="RzKbd" /> component.
    /// </summary>
    public abstract class RzKbdStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzKbdStylesBase" /> class. </summary>
        protected RzKbdStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>
        /// Gets the base CSS classes for the RzKbd kbd element.
        /// </summary>
        public abstract string Kbd { get; }
    }
}