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
        /// <summary>
        /// The theme that provides the styling context.
        /// </summary>
        protected readonly RzTheme Theme;

        /// <summary>
        /// Initializes a new instance of the <see cref="RzTableRowStylesBase"/> class with the specified theme.
        /// </summary>
        /// <param name="theme">The theme to use for styling.</param>
        protected RzTableRowStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>Gets the base CSS classes for the table row (&lt;tr&gt;) element, without hover or striping.</summary>
        public abstract string TableRowBase { get; }
        
        /// <summary>Gets the CSS classes to apply for hover effects on a table row.</summary>
        public abstract string TableRowHover { get; }
    }    
}
