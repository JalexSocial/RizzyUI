
namespace RizzyUI;

/// <summary>
///     Provides the default styles for the RzBreadcrumb component.
/// </summary>
public class DefaultRzBreadcrumbStyles : RzStylesBase.RzBreadcrumbStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzBreadcrumbStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzBreadcrumbStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "text-sm"; // Base container, text color handled by items

    /// <inheritdoc />
    public override string List => "text-muted-foreground flex flex-wrap items-center gap-1.5 sm:gap-2.5 break-words"; // Matches kitchen sink <ol>
}

/// <summary>
///     Provides the default styles for the RzBreadcrumbItem component.
/// </summary>
public class DefaultRzBreadcrumbItemStyles : RzStylesBase.RzBreadcrumbItemStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzBreadcrumbItemStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzBreadcrumbItemStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string ListItem => "inline-flex items-center gap-1.5"; // Matches kitchen sink <li>

    /// <inheritdoc />
    public override string Link =>
        "hover:text-foreground transition-colors"; // Matches kitchen sink <a>

    /// <inheritdoc />
    public override string ActiveSpan => "text-foreground font-normal"; // Matches kitchen sink active <span>

    /// <inheritdoc />
    public override string IconSpan => "size-3.5"; // Matches kitchen sink separator svg size, can be used for item icons too
}