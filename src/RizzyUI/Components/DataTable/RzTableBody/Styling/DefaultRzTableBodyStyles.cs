
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzTableBody component.
/// </summary>
public class DefaultRzTableBodyStyles : RzStylesBase.RzTableBodyStylesBase
{
    public DefaultRzTableBodyStyles(RzTheme theme) : base(theme)
    {
    }

    public override string TableBody => "divide-y divide-outline dark:divide-outline relative"; 

    public override string EmptyRowCell => "p-4 text-center text-on-surface-muted dark:text-on-surface-muted";
}