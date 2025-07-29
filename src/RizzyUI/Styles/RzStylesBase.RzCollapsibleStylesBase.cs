
namespace RizzyUI;

public abstract partial class RzStylesBase
{
    /// <summary>
    /// Defines the abstract structure for styling the <see cref="RzCollapsible" /> component.
    /// </summary>
    public abstract class RzCollapsibleStylesBase
    {
        protected readonly RzTheme Theme;
        protected RzCollapsibleStylesBase(RzTheme theme) { Theme = theme; }

        /// <summary> Gets the base CSS classes for the RzCollapsible container. </summary>
        public abstract string Container { get; }
        /// <summary> Gets the base CSS classes for the CollapsibleTrigger. </summary>
        public abstract string Trigger { get; }
        /// <summary> Gets the base CSS classes for the CollapsibleContent. </summary>
        public abstract string Content { get; }
    }
}