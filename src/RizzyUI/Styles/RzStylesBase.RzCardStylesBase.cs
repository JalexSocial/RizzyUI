namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
        #region RzCard Styles
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCard" /> component container.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCard" /> component.
        /// </summary>
        public abstract class RzCardStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzCardStylesBase" /> class. </summary>
            protected RzCardStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzCard container div (layout, rounding, overflow, shadow, border). </summary>
            public abstract string Container { get; }
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCardHeader" /> section.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCardHeader" /> component.
        /// </summary>
        public abstract class RzCardHeaderStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzCardHeaderStylesBase" /> class. </summary>
            protected RzCardHeaderStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzCardHeader div (layout, padding, alignment). </summary>
            public abstract string Header { get; }
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCardBody" /> section.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCardBody" /> component.
        /// </summary>
        public abstract class RzCardBodyStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzCardBodyStylesBase" /> class. </summary>
            protected RzCardBodyStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzCardBody div (flex grow, padding). </summary>
            public abstract string Body { get; }
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCardFooter" /> section.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCardFooter" /> component.
        /// </summary>
        public abstract class RzCardFooterStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzCardFooterStylesBase" /> class. </summary>
            protected RzCardFooterStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzCardFooter div (padding, typography, bottom rounding). </summary>
            public abstract string Footer { get; }
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCardTitle" />.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCardTitle" /> component.
        /// </summary>
        public abstract class RzCardTitleStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzCardTitleStylesBase" /> class. </summary>
            protected RzCardTitleStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzCardTitle h3 element (layout, margin, typography). </summary>
            public abstract string Title { get; }
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCardSubtitle" />.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCardSubtitle" /> component.
        /// </summary>
        public abstract class RzCardSubtitleStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzCardSubtitleStylesBase" /> class. </summary>
            protected RzCardSubtitleStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzCardSubtitle h4 element (typography). </summary>
            public abstract string Subtitle { get; }
        }
    
        /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCardButtons" /> container in a card header.
        /// </summary>
            /// <summary>
        ///     Defines the abstract structure for styling the <see cref="RzCardButtons" /> component.
        /// </summary>
        public abstract class RzCardButtonsStylesBase
        {
            /// <summary> The theme instance providing color and sizing tokens. </summary>
            protected readonly RzTheme Theme;
    
            /// <summary> Initializes a new instance of the <see cref="RzCardButtonsStylesBase" /> class. </summary>
            protected RzCardButtonsStylesBase(RzTheme theme)
            {
                Theme = theme;
            }
    
            /// <summary> Gets the base CSS classes for the RzCardButtons div (layout, gap, negative margin for alignment). </summary>
            public abstract string ButtonsContainer { get; }
        }
    
        #endregion
}
