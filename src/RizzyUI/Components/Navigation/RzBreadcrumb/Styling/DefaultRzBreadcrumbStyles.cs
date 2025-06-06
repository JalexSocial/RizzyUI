
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzBreadcrumb component family.
/// </summary>
public class DefaultRzBreadcrumbStyles : RzStylesBase.RzBreadcrumbStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzBreadcrumbStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzBreadcrumbStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container => "text-sm";

    /// <inheritdoc />
    public override string List => "flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5 text-muted-foreground";

    /// <inheritdoc />
    public override string Item => "inline-flex items-center gap-1.5";

    /// <inheritdoc />
    public override string Link => "transition-colors hover:text-foreground";

    /// <inheritdoc />
    public override string Page => "font-normal text-foreground";

    /// <inheritdoc />
    public override string Separator => "size-3.5";

    /// <inheritdoc />
    public override string EllipsisContainer => "flex h-9 w-9 items-center justify-center";

    /// <inheritdoc />
    public override string EllipsisIcon => "size-4";
}