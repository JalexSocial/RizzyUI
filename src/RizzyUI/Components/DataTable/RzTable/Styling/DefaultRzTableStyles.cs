
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzTable component and its direct parts (table, thead, tfoot).
/// Styles for RzTableBody, RzTableHeaderCell, RzTableCell, and RzPagination will be in their respective files.
/// </summary>
public class DefaultRzTableStyles : RzStylesBase.RzTableStylesBase
{
    public DefaultRzTableStyles(RzTheme theme) : base(theme)
    {
    }

    // Based on the first PenguinUI table example
    public override string Container => "overflow-hidden w-full overflow-x-auto rounded-theme border border-outline dark:border-outline";

    public override string Table => "w-full text-left text-sm text-on-surface dark:text-on-surface";

    public override string Thead => "border-b border-outline bg-surface-alt text-sm text-on-surface-strong dark:border-outline dark:bg-surface-alt dark:text-on-surface-strong";
    
    public override string Tfoot => "border-t border-outline bg-surface-alt text-sm text-on-surface dark:border-outline dark:bg-surface-alt dark:text-on-surface";
}