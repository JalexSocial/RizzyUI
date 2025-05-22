
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzTableCell component.
/// </summary>
public class DefaultRzTableCellStyles : RzStylesBase.RzTableCellStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzTableCellStyles"/> class with the specified theme.
    /// </summary>
    /// <param name="theme">The theme to use for styling.</param>
    public DefaultRzTableCellStyles(RzTheme theme) : base(theme)
    {
    }

    /// <summary>
    /// Gets the CSS classes for the base table cell element (padding).
    /// </summary>
    public override string TableCellBase => "p-4";

    /// <summary>
    /// Gets the CSS classes for a bordered table cell element.
    /// Default adds a right border. Use with CSS :last-child selectors for cleaner table appearance if needed.
    /// </summary>
    public override string TableCellBordered => "border-r border-outline dark:border-outline"; 
    // Consider if a full border "border border-outline" is better or if this should be more specific (e.g. border-x)
    // For now, just right border, assuming row handles bottom.
}