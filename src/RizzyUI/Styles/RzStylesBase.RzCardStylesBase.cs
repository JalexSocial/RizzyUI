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
    ///     Defines the abstract structure for styling the <see cref="CardHeader" /> section.
    /// </summary>
    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="CardHeader" /> component.
    /// </summary>
    public abstract class CardHeaderStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="CardHeaderStylesBase" /> class. </summary>
        protected CardHeaderStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the CardHeader div (layout, padding, alignment). </summary>
        public abstract string Header { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="CardContent" /> section.
    /// </summary>
    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="CardContent" /> component.
    /// </summary>
    public abstract class CardContentStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="CardContentStylesBase" /> class. </summary>
        protected CardContentStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the CardContent div (flex grow, padding). </summary>
        public abstract string Body { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="CardFooter" /> section.
    /// </summary>
    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="CardFooter" /> component.
    /// </summary>
    public abstract class CardFooterStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="CardFooterStylesBase" /> class. </summary>
        protected CardFooterStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the CardFooter div (padding, typography, bottom rounding). </summary>
        public abstract string Footer { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="CardTitle" />.
    /// </summary>
    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="CardTitle" /> component.
    /// </summary>
    public abstract class CardTitleStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="CardTitleStylesBase" /> class. </summary>
        protected CardTitleStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the CardTitle h3 element (layout, margin, typography). </summary>
        public abstract string Title { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="CardDescription" />.
    /// </summary>
    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="CardDescription" /> component.
    /// </summary>
    public abstract class CardDescriptionStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="CardDescriptionStylesBase" /> class. </summary>
        protected CardDescriptionStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the CardDescription h4 element (typography). </summary>
        public abstract string Subtitle { get; }
    }

    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="CardAction" /> container in a card header.
    /// </summary>
    /// <summary>
    ///     Defines the abstract structure for styling the <see cref="CardAction" /> component.
    /// </summary>
    public abstract class CardActionStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="CardActionStylesBase" /> class. </summary>
        protected CardActionStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the CardAction div (layout, gap, negative margin for alignment). </summary>
        public abstract string ActionsContainer { get; }
    }

    #endregion
}