namespace RizzyUI;

/// <summary>
///     Provides the default styles for the RzArticle component.
/// </summary>
public class DefaultRzArticleStyles : RzStylesBase.RzArticleStylesBase
{
    /// <inheritdoc />
    public DefaultRzArticleStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Container =>
        "flex w-full justify-between pr-0 text-foreground dark:text-foreground"; // Base container styles

    /// <inheritdoc />
    public override string InnerContainer => "mx-auto flex max-w-7xl grow flex-col overflow-x-auto overflow-y-hidden";

    /// <inheritdoc />
    public override string Article => ""; // Base article element, prose width added by method

    /// <inheritdoc />
    public override string Aside =>
        "hidden shrink-0 flex-col gap-2 overflow-y-auto p-8 pl-0 text-sm xl:flex"; // Base aside, fixed/width added by method

    /// <inheritdoc />
    public override string GetArticleProseCss(ProseWidth width)
    {
        return width switch
        {
            ProseWidth.Compact => "prose-compact",
            ProseWidth.Comfortable => "prose-comfortable",
            ProseWidth.Relaxed => "prose-relaxed",
            ProseWidth.Wide => "prose-wide",
            ProseWidth.UltraWide => "prose-ultrawide",
            ProseWidth.Full => "prose-full", // or "" if max-w-none is sufficient
            _ => GetArticleProseCss(ProseWidth.Comfortable)
        };
    }

    /// <inheritdoc />
    public override string GetAsideCss(Size columnWidth, bool isFixed)
    {
        var fixedCss =
            isFixed
                ? "h-fill fixed right-0 top-16 z-0"
                : ""; // Fixed positioning + top offset (adjust if navbar height changes)
        var widthCss = columnWidth switch
        {
            Size.ExtraSmall => "w-48",
            Size.Small => "w-56",
            Size.Medium => "w-64",
            Size.Large => "w-72",
            Size.ExtraLarge => "w-80",
            _ => GetAsideCss(Size.Large, isFixed) // Recalculate width based on default size
        };
        // Combine base, fixed, and width
        return $"{Aside} {fixedCss} {widthCss}";
    }

    /// <inheritdoc />
    public override string GetContainerPaddingCss(Size columnWidth)
    {
        return columnWidth switch // Adds right padding to main container to avoid overlap with fixed aside
        {
            Size.ExtraSmall => "xl:pr-48",
            Size.Small => "xl:pr-56",
            Size.Medium => "xl:pr-64",
            Size.Large => "xl:pr-72",
            Size.ExtraLarge => "xl:pr-80",
            _ => GetContainerPaddingCss(Size.Large)
        };
    }
}