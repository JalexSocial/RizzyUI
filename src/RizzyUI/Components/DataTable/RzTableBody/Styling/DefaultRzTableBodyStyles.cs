
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzTableBody component.
/// Defines styling for the table body element and empty state display.
/// </summary>
public class DefaultRzTableBodyStyles : RzStylesBase.RzTableBodyStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzTableBodyStyles"/> class with the specified theme.
    /// </summary>
    /// <param name="theme">The theme to use for styling.</param>
    public DefaultRzTableBodyStyles(RzTheme theme) : base(theme)
    {
    }

    /// <summary>
    /// Gets the CSS classes for the table body element.
    /// Provides divider styling between rows and establishes relative positioning
    /// for potential overlays or loading indicators.
    /// </summary>
    public override string TableBody => "[&_tr:last-child]:border-0"; // Matches kitchen sink tbody

    /// <summary>
    /// Gets the CSS classes for cells in empty state rows.
    /// Styles include padding, centered text alignment, and muted text color
    /// to properly display the empty state message.
    /// </summary>
    public override string EmptyRowCell => "p-4 text-center text-muted-foreground"; // Retained, good default

    /// <summary>
    /// Gets the CSS classes that enable and style the scrollable behavior of the table body.
    /// Defines overflow properties allowing vertical scrolling for content within the table body area.
    /// </summary>
    public override string ScrollableBody => "block overflow-y-auto"; // Retained, useful for fixed header
}