
using Blazicons;

namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzTableHeaderCell component.
/// </summary>
public class DefaultRzTableHeaderCellStyles : RzStylesBase.RzTableHeaderCellStylesBase
{
    public DefaultRzTableHeaderCellStyles(RzTheme theme) : base(theme)
    {
    }

    public override string HeaderCell => "p-4";

    public override string SortableButton => "flex items-center justify-between gap-2 w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-alt rounded-sm"; // Added focus styles, full width, justify between

    public override string SortableHeaderCell => "cursor-pointer hover:bg-surface-alt/50 dark:hover:bg-surface-alt/50";
    
    public override string TitleSpan => "flex-grow";

    public override string GetSortIndicatorCss(SortDirection direction)
    {
        return direction switch
        {
            SortDirection.Ascending => "size-4 text-on-surface-strong dark:text-on-surface-strong",
            SortDirection.Descending => "size-4 text-on-surface-strong dark:text-on-surface-strong",
            SortDirection.Unset => "size-4 text-on-surface-muted dark:text-on-surface-muted opacity-60",
            _ => "size-4 opacity-0" // Should ideally not be hit if icon is null
        };
    }
    
    public override SvgIcon? GetSortIndicatorIcon(SortDirection direction)
    {
        return direction switch
        {
            SortDirection.Ascending => MdiIcon.ArrowUp,
            SortDirection.Descending => MdiIcon.ArrowDown,
            SortDirection.Unset => MdiIcon.ArrowUpDownBoldOutline, // A more neutral "sortable" icon
            _ => null
        };
    }
}