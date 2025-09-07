namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    #region RzPopover Styles

    /// <summary>
    /// Defines the abstract structure for styling the RzPopover component.
    /// </summary>
    public abstract class RzPopoverStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzPopoverStylesBase"/> class. </summary>
        protected RzPopoverStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the base CSS classes for the main RzPopover container div. </summary>
        public abstract string Container { get; }
    }
    
    /// <summary>
    /// Defines the abstract structure for styling the <see cref="PopoverTrigger" /> component.
    /// </summary>
    public abstract class PopoverTriggerStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="PopoverTriggerStylesBase"/> class. </summary>
        protected PopoverTriggerStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the CSS classes for the trigger wrapper. </summary>
        public abstract string TriggerWrapper { get; }
    }

    /// <summary>
    /// Defines the abstract structure for styling the <see cref="PopoverContent" /> component.
    /// </summary>
    public abstract class PopoverContentStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="PopoverContentStylesBase"/> class. </summary>
        protected PopoverContentStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary> Gets the CSS classes for the popover content container. </summary>
        public abstract string ContentContainer { get; }
    }    

    #endregion
}

