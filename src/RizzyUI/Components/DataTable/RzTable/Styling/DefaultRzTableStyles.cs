
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
    public override string Container => "relative w-full overflow-x-auto rounded-lg border"; // Matches kitchen sink table wrapper

    /// <summary>
    /// Gets the CSS classes for the table element itself.
    /// Sets width, text alignment, and appropriate text colors in both light and dark modes.
    /// </summary>
    public override string Table => "w-full caption-bottom text-sm"; // Matches kitchen sink table

    /// <summary>
    /// Gets the CSS classes for the table header (&lt;thead&gt;) element.
    /// Adds a bottom border, background color, and stronger text color for better contrast.
    /// </summary>
    public override string Thead => "[&_tr]:border-b"; // Matches kitchen sink thead

    /// <summary>
    /// Gets the CSS classes for the table footer (&lt;tfoot&gt;) element.
    /// Adds a top border, background color, and appropriate text colors for consistent styling.
    /// </summary>
    public override string Tfoot => "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0"; // Matches kitchen sink tfoot

    /// <summary>
    /// Gets the CSS classes for the container managing a table with a fixed header configuration.
    /// Ensures relative positioning and vertical overflow control for supporting fixed header behavior.
    /// </summary>
    public override string FixedHeaderContainer => "relative overflow-y-auto"; // Retained, useful for fixed header scenarios

    /// <summary>
    /// Defines the CSS class for a table's fixed header row.
    /// Ensures the header remains visible by making it sticky at the top of the container
    /// with proper stacking context and positioning.
    /// </summary>
    public override string FixedThead => "sticky top-0 z-10 bg-card"; // Added bg-card for fixed header background

    /// <summary>
    /// Gets the CSS classes for a fixed-position table footer (&lt;tfoot&gt;).
    /// Ensures the footer remains visible at the bottom edge of its container when scrolling vertically.
    /// Commonly used in tables with vertical overflow for improved accessibility and usability.
    /// </summary>
    public override string FixedTfoot => "sticky bottom-0 z-10 bg-muted/50"; // Added bg-muted/50 for fixed footer background
}