
using Blazicons;

namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzTableHeaderCell component.
/// </summary>
public class DefaultRzTableHeaderCellStyles : RzStylesBase.RzTableHeaderCellStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzTableHeaderCellStyles"/> class with the specified theme.
    /// </summary>
    /// <param name="theme">The theme to use for styling.</param>
    public DefaultRzTableHeaderCellStyles(RzTheme theme) : base(theme)
    {
    }

    /// <summary>
    /// Gets the CSS classes for the base header cell element.
    /// Default is "p-4" which provides consistent padding.
    /// </summary>
    public override string HeaderCellBase => "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"; // Matches kitchen sink th

    /// <summary>
    /// Gets the CSS classes for the sort button inside sortable header cells.
    /// Styles include spacing, alignment, and focus states for better accessibility.
    /// </summary>
    public override string SortableButton => "flex items-center justify-between gap-2 w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background rounded-sm"; // Retained, good default

    /// <summary>
    /// Gets the CSS classes for sortable header cells.
    /// Changes the cursor and adds hover states to provide visual feedback for interactive cells.
    /// </summary>
    public override string SortableHeaderCell => "cursor-pointer hover:bg-muted/50"; // Matches kitchen sink tr hover

    /// <summary>
    /// Gets the CSS classes for the title span within header cells.
    /// Uses flex-grow to allow the sort indicator to be properly positioned.
    /// </summary>
    public override string TitleSpan => "flex-grow"; // Retained

    /// <summary>
    /// Gets the CSS classes for a bordered header cell element.
    /// </summary>
    public override string HeaderCellBordered => ""; // Border is handled by <tr> in kitchen sink

    /// <summary>
    /// Gets the CSS classes for the sort direction indicator based on the current sort direction.
    /// </summary>
    /// <param name="direction">The current sort direction.</param>
    /// <returns>CSS classes for styling the sort indicator appropriate to the sort direction.</returns>
    public override string GetSortIndicatorCss(SortDirection direction)
    {
        return direction switch
        {
            SortDirection.Ascending => "size-4 text-foreground", // Use foreground color
            SortDirection.Descending => "size-4 text-foreground",
            SortDirection.Unset => "size-4 text-muted-foreground opacity-60",
            _ => "size-4 opacity-0"
        };
    }

    /// <summary>
    /// Gets the appropriate SVG icon for the sort direction indicator based on the current sort direction.
    /// </summary>
    /// <param name="direction">The current sort direction.</param>
    /// <returns>An SvgIcon instance (e.g., MdiIcon.ArrowUp) or null if no icon should be displayed.</returns>
    public override SvgIcon? GetSortIndicatorIcon(SortDirection direction)
    {
        return direction switch
        {
            SortDirection.Ascending => MdiIcon.ArrowUp,
            SortDirection.Descending => MdiIcon.ArrowDown,
            SortDirection.Unset => MdiIcon.ArrowUpDownBoldOutline, // Or a more subtle default like ChevronsUpDown
            _ => null
        };
    }
}