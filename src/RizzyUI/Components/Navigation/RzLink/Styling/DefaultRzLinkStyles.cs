namespace RizzyUI;

/// <summary>
///     Provides the default styles for the RzLink component.
/// </summary>
public class DefaultRzLinkStyles : RzStylesBase.RzLinkStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzLinkStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzLinkStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    // Use theme primary color for link, adjust dark mode as needed by theme
    public override string Link => "font-medium text-primary underline-offset-2 focus:outline-hidden dark:text-primary";

    /// <inheritdoc />
    public override string UnderlineEnabled => "hover:underline focus:underline";
}