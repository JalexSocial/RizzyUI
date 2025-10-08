
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzEmpty component family.
/// </summary>
public class DefaultRzEmptyStyles : RzStylesBase.RzEmptyStylesBase
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DefaultRzEmptyStyles"/> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzEmptyStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc />
    public override string Empty => "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12";

    /// <inheritdoc />
    public override string Header => "flex max-w-sm flex-col items-center gap-2 text-center";

    /// <inheritdoc />
    public override string Title => "text-lg font-medium tracking-tight";

    /// <inheritdoc />
    public override string Description => "text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4";

    /// <inheritdoc />
    public override string Content => "flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance";

    /// <inheritdoc />
    public override string GetMediaCss(EmptyMediaVariant variant)
    {
        var baseStyle = "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0";
        var variantStyle = variant switch
        {
            EmptyMediaVariant.Icon => "bg-muted text-foreground flex size-10 text-2xl shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
            _ => "bg-transparent",
        };
        return $"{baseStyle} {variantStyle}";
    }
}