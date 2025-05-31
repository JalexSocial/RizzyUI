
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzTableRow component.
/// </summary>
public class DefaultRzTableRowStyles : RzStylesBase.RzTableRowStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzTableRowStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance to use for styling.</param>
    public DefaultRzTableRowStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string TableRowBase =>
        "border-b transition-colors"; // Matches kitchen sink tr

    /// <inheritdoc />
    public override string TableRowHover =>
        "hover:bg-muted/50"; // Matches kitchen sink tr hover
}