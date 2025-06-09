
namespace RizzyUI;

public abstract partial class RzStylesBase
{
    /// <summary>
    /// Defines the abstract structure for styling the <see cref="RzNavigationMenu" /> component.
    /// </summary>
    public abstract class RzNavigationMenuStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzNavigationMenuStylesBase" /> class. </summary>
        protected RzNavigationMenuStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the root navigation menu container (<nav>). </summary>
        public abstract string Container { get; }

        /// <summary> Gets the CSS classes for the list container (<ul>). </summary>
        public abstract string List { get; }

        /// <summary> Gets the CSS classes for a list item (<li>). </summary>
        public abstract string Item { get; }

        /// <summary> Gets the CSS classes for a trigger (<button>). </summary>
        public abstract string Trigger { get; }

        /// <summary> Gets the CSS classes for a simple link (<a>). </summary>
        public abstract string Link { get; }

        /// <summary> Gets the CSS classes for the content panel that drops down. </summary>
        public abstract string Content { get; }

        /// <summary> Gets the CSS classes for the viewport container that positions the content panels. </summary>
        public abstract string Viewport { get; }
        
        /// <summary> Gets the CSS classes for the active item indicator. </summary>
        public abstract string Indicator { get; }
    }
}