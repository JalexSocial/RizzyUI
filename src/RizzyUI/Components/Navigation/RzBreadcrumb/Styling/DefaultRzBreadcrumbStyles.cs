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
    public override string Container => "text-sm font-medium text-on-primary mb-4"; // Adjusted color

    /// <inheritdoc />
    public override string List => "flex flex-wrap items-center gap-1";
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
    public override string ListItem => "flex items-center gap-1 text-on-surface";

    /// <inheritdoc />
    public override string Link =>
        "text-on-surface hover:text-on-surface-strong dark:hover:text-on-surface-strong";

    /// <inheritdoc />
    public override string ActiveSpan => "font-bold text-on-surface";

    /// <inheritdoc />
    public override string IconSpan => "text-xl";
}