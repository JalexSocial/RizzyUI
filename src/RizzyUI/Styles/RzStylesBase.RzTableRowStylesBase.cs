namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    /// <summary>
    /// Defines the abstract structure for styling the <see cref="RzTableRow{TItem}"/> component.
    /// </summary>
    public abstract class RzTableRowStylesBase
    {
        protected readonly RzTheme Theme;

        protected RzTableRowStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>Gets the base CSS classes for the table row (<tr>) element, without hover or striping.</summary>
        public abstract string TableRowBase { get; }
        
        /// <summary>Gets the CSS classes to apply for hover effects on a table row.</summary>
        public abstract string TableRowHover { get; }
    }    
}

