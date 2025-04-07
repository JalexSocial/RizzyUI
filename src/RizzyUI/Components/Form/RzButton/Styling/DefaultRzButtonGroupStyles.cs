namespace RizzyUI.Components.Form.RzButton.Styling;

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
    public override string Container => "inline-flex";

    /// <inheritdoc />
    public override string GroupFirst => "rounded-none rounded-l-borderRadius"; // Use theme token

    /// <inheritdoc />
    public override string GroupLast => "rounded-none rounded-r-borderRadius border-l-0"; // Use theme token

    /// <inheritdoc />
    public override string GroupMiddle => "rounded-none border-l-0";
}