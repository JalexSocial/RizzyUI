
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Renders an HTML heading element (h1-h4) with appropriate typography styling based on the level and active
///     &lt;see cref="RzTheme" /&gt;.
///     Inherits common text styling options from &lt;see cref="RzTypographyBase" /&gt;. Can register itself with an
///     &lt;see cref="RzQuickReferenceContainer" /&gt;.
/// </xmldoc>
public partial class RzHeading : RzTypographyBase<RzHeading.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzHeading component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "scroll-m-20 tracking-tight",
        variants: new()
        {
            [c => ((RzHeading)c).Level] = new Variant<HeadingLevel, Slots>
            {
                [HeadingLevel.H1] = "text-4xl font-extrabold lg:text-5xl",
                [HeadingLevel.H2] = "border-b pb-2 text-3xl font-semibold first:mt-0",
                [HeadingLevel.H3] = "text-2xl font-semibold",
                [HeadingLevel.H4] = "text-xl font-semibold"
            },
            [c => ((RzHeading)c).TextColor] = new Variant<SemanticColor?, Slots>
            {
                [SemanticColor.Primary] = "text-primary",
                [SemanticColor.Secondary] = "text-secondary",
                [SemanticColor.Muted] = "text-muted-foreground",
                [SemanticColor.Foreground] = "text-foreground",
            },
            [c => ((RzHeading)c).Weight] = new Variant<TextWeight?, Slots>
            {
                [TextWeight.Thin] = "font-thin",
                [TextWeight.Normal] = "font-normal",
                [TextWeight.Bold] = "font-bold",
                [TextWeight.ExtraBold] = "font-extrabold"
            },
            [c => ((RzHeading)c).Size] = new Variant<TextSize?, Slots>
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
            [c => ((RzHeading)c).LineHeight] = new Variant<Leading?, Slots>
            {
                [Leading.None] = "leading-none",
                [Leading.Tight] = "leading-tight",
                [Leading.Snug] = "leading-snug",
                [Leading.Normal] = "leading-normal",
                [Leading.Relaxed] = "leading-relaxed",
                [Leading.Loose] = "leading-loose"
            },
            [c => ((RzHeading)c).Decoration] = new Variant<TextDecoration?, Slots>
            {
                [TextDecoration.None] = "no-underline",
                [TextDecoration.Underline] = "underline",
                [TextDecoration.Overline] = "overline",
                [TextDecoration.LineThrough] = "line-through"
            },
            [c => ((RzHeading)c).Transform] = new Variant<TextTransform?, Slots>
            {
                [TextTransform.None] = "normal-case",
                [TextTransform.Uppercase] = "uppercase",
                [TextTransform.Lowercase] = "lowercase",
                [TextTransform.Capitalize] = "capitalize"
            }
        }
    );

    private bool _registered;

    /// <summary> Represents the heading level (H1-H4), determining the HTML tag and base styles. Required. </summary>
    [Parameter]
    [EditorRequired]
    public required HeadingLevel Level { get; set; }

    /// <summary> The content to be rendered inside the heading tag. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    ///     The title text to use when registering this heading with an &lt;see cref="RzQuickReferenceContainer" /&gt;. If null
    ///     or empty, the heading will not be registered.
    /// </summary>
    [Parameter]
    public string? QuickReferenceTitle { get; set; }

    /// <summary> Gets the parent &lt;see cref="RzQuickReferenceContainer" /&gt; if this heading is nested within one. </summary>
    [CascadingParameter]
    private RzQuickReferenceContainer? QuickReferenceContainer { get; set; }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        Element = Level switch
        {
            HeadingLevel.H1 => "h1",
            HeadingLevel.H2 => "h2",
            HeadingLevel.H3 => "h3",
            HeadingLevel.H4 => "h4",
            _ => "h1"
        };

        if (TextColor is null)
            TextColor = SemanticColor.Foreground;

        if (!_registered && QuickReferenceContainer != null)
        {
            if (string.IsNullOrEmpty(QuickReferenceTitle))
                QuickReferenceTitle = ChildContent?.AsMarkupString() ?? "[Missing QuickReferenceTitle]";

            QuickReferenceContainer.RegisterHeading(Level, QuickReferenceTitle, Id);

            _registered = true;
        }
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzHeading;

    /// <summary>
    /// Defines the slots available for styling in the RzHeading component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}