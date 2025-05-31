
namespace RizzyUI;

/// <summary> Provides default styles for base typography settings. </summary>
public class DefaultRzTypographyStyles : RzStylesBase.RzTypographyStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzTypographyStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzTypographyStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string GetTextWeightCss(TextWeight? weight)
    {
        return weight switch
        {
            TextWeight.Thin => "font-thin",
            TextWeight.Normal => "font-normal", // Default for p
            TextWeight.Bold => "font-bold",     // Default for h1
            TextWeight.ExtraBold => "font-extrabold",
            _ => ""
        };
    }

    /// <inheritdoc />
    public override string GetTextSizeCss(TextSize? size)
    {
        // These map to Tailwind's text size utilities
        return size switch
        {
            TextSize.Small => "text-sm",         // Kitchen sink uses text-sm for many things
            TextSize.Medium => "text-base",      // Default paragraph size
            TextSize.Large => "text-lg",
            TextSize.ExtraLarge => "text-xl",
            TextSize.TwoXL => "text-2xl",
            TextSize.ThreeXL => "text-3xl",      // Kitchen sink h1
            TextSize.FourXL => "text-4xl",
            TextSize.FiveXL => "text-5xl",
            _ => ""
        };
    }

    /// <inheritdoc />
    public override string GetTextTransformCss(TextTransform? transform)
    {
        return transform switch
        {
            TextTransform.None => "normal-case",
            TextTransform.Uppercase => "uppercase",
            TextTransform.Lowercase => "lowercase",
            TextTransform.Capitalize => "capitalize",
            _ => ""
        };
    }

    /// <inheritdoc />
    public override string GetTextDecorationCss(TextDecoration? decoration)
    {
        return decoration switch
        {
            TextDecoration.None => "no-underline",
            TextDecoration.Underline => "underline",
            TextDecoration.Overline => "overline",
            TextDecoration.LineThrough => "line-through",
            _ => ""
        };
    }

    /// <inheritdoc />
    public override string GetLineHeightCss(Leading? leading)
    {
        // Kitchen sink uses leading-relaxed for p in alerts, leading-none for card titles
        return leading switch
        {
            Leading.None => "leading-none",
            Leading.Tight => "leading-tight",
            Leading.Snug => "leading-snug",
            Leading.Normal => "leading-normal",
            Leading.Relaxed => "leading-relaxed",
            Leading.Loose => "leading-loose",
            _ => ""
        };
    }

    /// <inheritdoc />
    public override string GetBaseCss(SemanticColor? textColor, TextWeight? weight, TextSize? size, Leading? lineHeight,
        TextDecoration? decoration, TextTransform? transform)
    {
        // Combine all individual style parts
        return
            $"{textColor?.ToTextClass() ?? ""} {GetTextWeightCss(weight)} {GetTextSizeCss(size)} {GetLineHeightCss(lineHeight)} {GetTextDecorationCss(decoration)} {GetTextTransformCss(transform)}"
                .Trim();
    }
}

/// <summary> Provides default styles for RzHeading. </summary>
public class DefaultRzHeadingStyles : RzStylesBase.RzHeadingStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzHeadingStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzHeadingStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string GetLevelCss(HeadingLevel level)
    {
        // Based on kitchen sink h1, h2, etc.
        return level switch
        {
            HeadingLevel.H1 => "text-3xl font-semibold tracking-tight", // Matches kitchen sink h1
            HeadingLevel.H2 => "text-lg font-semibold leading-none", // Common for card titles, alert titles in kitchen sink are font-medium
            HeadingLevel.H3 => "text-base font-medium", // General purpose sub-heading
            HeadingLevel.H4 => "text-sm font-medium",   // Smaller sub-heading
            _ => GetLevelCss(HeadingLevel.H1)
        };
    }
}

/// <summary> Provides default styles for RzParagraph. </summary>
public class DefaultRzParagraphStyles : RzStylesBase.RzParagraphStylesBase
{
    /// <summary>
    ///     Initializes a new instance of the <see cref="DefaultRzParagraphStyles" /> class.
    /// </summary>
    /// <param name="theme">The theme instance providing styling context.</param>
    public DefaultRzParagraphStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Paragraph => "text-sm leading-relaxed"; // Matches kitchen sink alert description p, general p

    /// <inheritdoc />
    public override string GetProseWidthCss(ProseWidth width)
    {
        // Kitchen sink doesn't explicitly use prose width utilities in the provided HTML,
        // but these are standard Tailwind typography plugin classes.
        return width switch
        {
            ProseWidth.Compact => "max-w-prose prose-sm", // Adjusted to prose-sm for compact
            ProseWidth.Comfortable => "max-w-prose",      // Standard prose
            ProseWidth.Relaxed => "max-w-prose prose-lg", // Adjusted to prose-lg for relaxed
            ProseWidth.Wide => "max-w-screen-md",         // Example for wider
            ProseWidth.UltraWide => "max-w-screen-lg",   // Example for even wider
            ProseWidth.Full => "max-w-none",
            _ => GetProseWidthCss(ProseWidth.Full)
        };
    }
}