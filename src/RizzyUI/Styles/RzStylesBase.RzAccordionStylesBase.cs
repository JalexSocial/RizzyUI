namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzAccordion Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzAccordion" /> component.
        /// </summary>
        public abstract class RzAccordionStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzAccordionStylesBase" /> class. </summary>
            protected RzAccordionStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the main RzAccordion container div. </summary>
            public abstract string Container { get; }
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzAccordionSection" /> component.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzAccordionSection" /> component.
        /// </summary>
        public abstract class RzAccordionSectionStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzAccordionSectionStylesBase" /> class. </summary>
            protected RzAccordionSectionStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the section's clickable button element. </summary>
            public abstract string Button { get; }
    
            /// <summary> Gets the base CSS classes for the section's collapsible content container div. </summary>
            public abstract string ContentContainer { get; }
    
            /// <summary> Gets the CSS classes for the chevron indicator icon. </summary>
            public abstract string ChevronIcon { get; }
    
            /// <summary> Gets the CSS classes applied to the chevron icon when the section is expanded. </summary>
            public abstract string ChevronIconExpanded { get; }
        }
    
        #endregion
}
