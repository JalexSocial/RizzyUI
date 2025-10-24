
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Renders a paragraph (&lt;c&gt;p&lt;/c&gt;) element with standard typography styling.
///     Inherits text styling options from &lt;see cref="RzTypographyBase" /&gt;.
///     Styling, including prose width, is determined by the active &lt;see cref="RzTheme" /&gt;.
/// </xmldoc>
public partial class RzParagraph : RzTypographyBase<RzParagraph.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzParagraph component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "leading-7 [&:not(:first-child)]:mt-6",
        variants: new()
        {
            [c => ((RzParagraph)c).ProseWidth] = new Variant<ProseWidth, Slots>
            {
                [ProseWidth.Compact] = "max-w-prose prose-sm",
                [ProseWidth.Comfortable] = "max-w-prose",
                [ProseWidth.Relaxed] = "max-w-prose prose-lg",
                [ProseWidth.Wide] = "max-w-screen-md",
                [ProseWidth.UltraWide] = "max-w-screen-lg",
                [ProseWidth.Full] = "max-w-none"
            },
            [c => ((RzParagraph)c).TextColor] = new Variant<SemanticColor?, Slots>
            {
                [SemanticColor.Primary] = "text-primary",
                [SemanticColor.Secondary] = "text-secondary",
                [SemanticColor.Muted] = "text-muted-foreground",
                [SemanticColor.Foreground] = "text-foreground",
            },
            [c => ((RzParagraph)c).Weight] = new Variant<TextWeight?, Slots>
            {
                [TextWeight.Thin] = "font-thin",
                [TextWeight.Normal] = "font-normal",
                [TextWeight.Bold] = "font-bold",
                [TextWeight.ExtraBold] = "font-extrabold"
            },
            [c => ((RzParagraph)c).Size] = new Variant<TextSize?, Slots>
            {
                [TextSize.Small] = "text-sm",
                [TextSize.Medium] = "text-base",
                [TextSize.Large] = "text-lg",
                [TextSize.ExtraLarge] = "text-xl",
                [TextSize.TwoXL] = "text-2xl",
                [TextSize.ThreeXL] = "text-3xl",
                [TextSize.FourXL] = "text-4xl",
                [TextSize.FiveXL] = "text-5xl"
            },
            [c => ((RzParagraph)c).LineHeight] = new Variant<Leading?, Slots>
            {
                [Leading.None] = "leading-none",
                [Leading.Tight] = "leading-tight",
                [Leading.Snug] = "leading-snug",
                [Leading.Normal] = "leading-normal",
                [Leading.Relaxed] = "leading-relaxed",
                [Leading.Loose] = "leading-loose"
            },
            [c => ((RzParagraph)c).Decoration] = new Variant<TextDecoration?, Slots>
            {
                [TextDecoration.None] = "no-underline",
                [TextDecoration.Underline] = "underline",
                [TextDecoration.Overline] = "overline",
                [TextDecoration.LineThrough] = "line-through"
            },
            [c => ((RzParagraph)c).Transform] = new Variant<TextTransform?, Slots>
            {
                [TextTransform.None] = "normal-case",
                [TextTransform.Uppercase] = "uppercase",
                [TextTransform.Lowercase] = "lowercase",
                [TextTransform.Capitalize] = "capitalize"
            }
        }
    );

    /// <summary> The content to be rendered inside the paragraph. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary> Gets or sets the maximum character width of the paragraph. Defaults to Full. </summary>
    [Parameter]
    public ProseWidth ProseWidth { get; set; } = ProseWidth.Full;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "p";

        TextColor ??= SemanticColor.Foreground;
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzParagraph;

    /// <summary>
    /// Defines the slots available for styling in the RzParagraph component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}