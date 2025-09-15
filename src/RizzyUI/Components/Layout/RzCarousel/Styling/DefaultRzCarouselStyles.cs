
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzCarousel component family.
/// </summary>
public class DefaultRzCarouselStyles : RzStylesBase.RzCarouselStylesBase
{
    public DefaultRzCarouselStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc />
    public override string Container => "relative p-10";

    /// <inheritdoc />
    public override string Wrapper => "relative";

    /// <inheritdoc />
    public override string Viewport => "overflow-hidden";

    /// <inheritdoc />
    public override string Content => "flex";

    /// <inheritdoc />
    public override string Item => "min-w-0 shrink-0 grow-0 basis-full";

    /// <inheritdoc />
    public override string PreviousButton =>
        "absolute size-8 rounded-full top-1/2 -translate-y-1/2 -left-12 " +
        "inline-flex items-center justify-center " +
        "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground " +
        "disabled:pointer-events-none disabled:opacity-50 " +
        "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";
    
    /// <inheritdoc />
    public override string NextButton =>
        "absolute size-8 rounded-full top-1/2 -translate-y-1/2 -right-12 " +
        "inline-flex items-center justify-center " +
        "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground " +
        "disabled:pointer-events-none disabled:opacity-50 " +
        "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";
    
    /// <inheritdoc />
    public override string ButtonIcon => "h-4 w-4";
}