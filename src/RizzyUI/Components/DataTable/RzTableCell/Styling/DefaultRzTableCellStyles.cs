
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
    /// Gets the CSS classes for the table cell element.
    /// Default is "p-4" which provides consistent padding.
    /// </summary>
    public override string TableCell => "p-4";
}
