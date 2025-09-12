
namespace RizzyUI;

/// <summary>
/// Provides the default styles for the RzCarousel component family.
/// </summary>
public class DefaultRzCarouselStyles : RzStylesBase.RzCarouselStylesBase
{
    public DefaultRzCarouselStyles(RzTheme theme) : base(theme) { }

    /// <inheritdoc />
    public override string Container => "relative";

    /// <inheritdoc />
    public override string Wrapper => "relative";

    /// <inheritdoc />
    public override string Viewport => "overflow-hidden";

    /// <inheritdoc />
    public override string Content => "flex";

    /// <inheritdoc />
    public override string Item => "min-w-0 shrink-0 grow-0 basis-full";

    /// <inheritdoc />
    public override string PreviousButton => "absolute h-8 w-8 rounded-full bg-background/50 hover:bg-background/75 text-foreground disabled:opacity-50 transition-colors z-10 top-1/2 -translate-y-1/2 left-4 flex items-center justify-center";

    /// <inheritdoc />
    public override string NextButton => "absolute h-8 w-8 rounded-full bg-background/50 hover:bg-background/75 text-foreground disabled:opacity-50 transition-colors z-10 top-1/2 -translate-y-1/2 right-4 flex items-center justify-center";

    /// <inheritdoc />
    public override string ButtonIcon => "h-4 w-4";
}