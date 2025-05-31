
namespace RizzyUI;

/// <summary>
///     Provides the default styles for the RzButtonGroup component.
/// </summary>
public class DefaultRzButtonGroupStyles : RzStylesBase.RzButtonGroupStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzButtonGroupStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance to use for styling.</param>
    public DefaultRzButtonGroupStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "inline-flex rounded-md shadow-sm"; // Added rounded-md and shadow-sm for group consistency

    /// <inheritdoc />
    public override string GroupFirst => "-ml-px first:rounded-l-md"; // Use -ml-px for overlap, ensure left rounding

    /// <inheritdoc />
    public override string GroupLast => "-ml-px last:rounded-r-md"; // Use -ml-px for overlap, ensure right rounding

    /// <inheritdoc />
    public override string GroupMiddle => "-ml-px rounded-none"; // Middle buttons are not rounded and overlap
}