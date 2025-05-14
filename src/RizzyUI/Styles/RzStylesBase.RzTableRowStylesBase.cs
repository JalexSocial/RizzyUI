namespace RizzyUI;

/// <summary>
///     Abstract base class defining the structure for component style definitions.
///     Concrete themes (<see cref="RzTheme" />) will provide instances derived from these nested abstract classes,
///     allowing for customizable component styling across the application.
/// </summary>
public abstract partial class RzStylesBase
{
    #region RzTableRow Styles

    /// <summary>
    /// Defines the abstract structure for styling the <see cref="RzTableRow{TItem}"/> component.
    /// </summary>
    public abstract class RzTableRowStylesBase
    {
        /// <summary> The theme instance providing color and sizing tokens. </summary>
        protected readonly RzTheme Theme;

        /// <summary> Initializes a new instance of the <see cref="RzTableRowStylesBase"/> class. </summary>
        protected RzTableRowStylesBase(RzTheme theme)
        {
            Theme = theme;
        }

        /// <summary>Gets the base CSS classes for the table row (<tr>) element.</summary>
        public abstract string TableRow { get; }

        // Potentially add other style properties later if needed, e.g., for selected rows, hover states, etc.
        // public abstract string TableRowHover { get; }
        // public abstract string TableRowSelected { get; }
    }

    #endregion
}