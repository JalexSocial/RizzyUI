
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzTableCell component.
/// </summary>
public class DefaultRzTableCellStyles : RzStylesBase.RzTableCellStylesBase
{
    public DefaultRzTableCellStyles(RzTheme theme) : base(theme)
    {
    }

    public override string TableCell => "p-4";
}