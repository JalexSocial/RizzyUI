
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
        "border-b border-outline dark:border-outline transition-colors duration-150 ease-in-out";

    /// <inheritdoc />
    public override string TableRowHover =>
        "hover:bg-surface-alt/50 dark:hover:bg-surface-alt/50";
}