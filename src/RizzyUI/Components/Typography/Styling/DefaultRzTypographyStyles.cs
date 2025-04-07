using RizzyUI.Components.RzTypography;

namespace RizzyUI;

/// <summary> Provides default styles for base typography settings. </summary>
public class DefaultRzTypographyStyles : RzStylesBase.RzTypographyStylesBase // Not sealed
{
    public DefaultRzTypographyStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string GetTextWeightCss(TextWeight? weight)
    {
        return weight switch
        {
            TextWeight.Thin => "font-thin", TextWeight.Normal => "font-normal",
            TextWeight.Bold => "font-bold", TextWeight.ExtraBold => "font-extrabold",
            _ => ""
        };
    }

    /// <inheritdoc />
    public override string GetTextSizeCss(TextSize? size)
    {
        return size switch
        {
            TextSize.Small => "text-sm", TextSize.Medium => "text-base", TextSize.Large => "text-lg",
            TextSize.ExtraLarge => "text-xl", TextSize.TwoXL => "text-2xl", TextSize.ThreeXL => "text-3xl",
            TextSize.FourXL => "text-4xl", TextSize.FiveXL => "text-5xl",
            _ => ""
        };
    }

    /// <inheritdoc />
    public override string GetTextTransformCss(TextTransform? transform)
    {
        return transform switch
        {
            TextTransform.None => "normal-case", TextTransform.Uppercase => "uppercase",
            TextTransform.Lowercase => "lowercase", TextTransform.Capitalize => "capitalize",
            _ => ""
        };
    }

    /// <inheritdoc />
    public override string GetTextDecorationCss(TextDecoration? decoration)
    {
        return decoration switch
        {
            TextDecoration.None => "no-underline", TextDecoration.Underline => "underline",
            TextDecoration.Overline => "overline", TextDecoration.LineThrough => "line-through",
            _ => ""
        };
    }

    /// <inheritdoc />
    public override string GetLineHeightCss(Leading? leading)
    {
        return leading switch
        {
            Leading.None => "leading-none", Leading.Tight => "leading-tight", Leading.Snug => "leading-snug",
            Leading.Normal => "leading-normal", Leading.Relaxed => "leading-relaxed", Leading.Loose => "leading-loose",
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
public class DefaultRzHeadingStyles : RzStylesBase.RzHeadingStylesBase // Not sealed
{
    public DefaultRzHeadingStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string GetLevelCss(HeadingLevel level)
    {
        return level switch
        {
            // Tailwind defaults provide good responsive sizing based on H tag
            HeadingLevel.H1 => "mb-5 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold",
            HeadingLevel.H2 => "mb-4 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold",
            HeadingLevel.H3 => "mb-3 text-base sm:text-lg md:text-xl lg:text-2xl font-medium",
            HeadingLevel.H4 => "mb-2 text-base sm:text-lg md:text-xl lg:text-2xl font-normal", // Adjusted H4 slightly
            _ => GetLevelCss(HeadingLevel.H1) // Default to H1 style if needed
        };
    }
}

/// <summary> Provides default styles for RzParagraph. </summary>
public class DefaultRzParagraphStyles : RzStylesBase.RzParagraphStylesBase // Not sealed
{
    public DefaultRzParagraphStyles(RzTheme theme) : base(theme)
    {
    }

    /// <inheritdoc />
    public override string Paragraph => "my-4 leading-relaxed"; // Base margin and leading

    /// <inheritdoc />
    public override string GetProseWidthCss(ProseWidth width)
    {
        return width switch
        {
            ProseWidth.Compact => "max-w-prose prose-compact", // Use standard prose and potentially a custom compact utility if defined
            ProseWidth.Comfortable => "max-w-prose prose-comfortable",
            ProseWidth.Relaxed => "max-w-prose prose-relaxed",
            ProseWidth.Wide => "max-w-prose prose-wide",
            ProseWidth.UltraWide => "max-w-prose prose-ultrawide",
            ProseWidth.Full => "max-w-none", // No max-width constraint
            _ => GetProseWidthCss(ProseWidth.Full) // Default Paragraphs to full width unless specified
        };
    }
}