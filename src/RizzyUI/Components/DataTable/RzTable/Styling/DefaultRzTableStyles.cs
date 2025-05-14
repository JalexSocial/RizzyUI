
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzTable component and its direct parts (table, thead, tfoot).
/// Styles for RzTableBody, RzTableHeaderCell, RzTableCell, and RzPagination will be in their respective files.
/// </summary>
public class DefaultRzTableStyles : RzStylesBase.RzTableStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzTableStyles"/> class with the specified theme.
    /// </summary>
    /// <param name="theme">The theme to use for styling.</param>
    public DefaultRzTableStyles(RzTheme theme) : base(theme)
    {
    }

    /// <summary>
    /// Gets the CSS classes for the outer container wrapping the table.
    /// Provides overflow handling, width control, and rounded borders with appropriate colors.
    /// </summary>
    public override string Container => "overflow-hidden w-full overflow-x-auto rounded-theme border border-outline dark:border-outline";

    /// <summary>
    /// Gets the CSS classes for the table element itself.
    /// Sets width, text alignment, and appropriate text colors in both light and dark modes.
    /// </summary>
    public override string Table => "w-full text-left text-sm text-on-surface dark:text-on-surface";

    /// <summary>
    /// Gets the CSS classes for the table header (thead) element.
    /// Adds a bottom border, background color, and stronger text color for better contrast.
    /// </summary>
    public override string Thead => "border-b border-outline bg-surface-alt text-sm text-on-surface-strong dark:border-outline dark:bg-surface-alt dark:text-on-surface-strong";
    
    /// <summary>
    /// Gets the CSS classes for the table footer (tfoot) element.
    /// Adds a top border, background color, and appropriate text colors for consistent styling.
    /// </summary>
    public override string Tfoot => "border-t border-outline bg-surface-alt text-sm text-on-surface dark:border-outline dark:bg-surface-alt dark:text-on-surface";
}
