
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     A layout component rendering a responsive two-column layout, typically for main article content
///     and a side navigation or information panel (&lt;see cref="RzQuickReference" /&gt;).
///     Styling and layout details are determined by the active &lt;see cref="RzTheme" /&gt;.
/// </xmldoc>
public partial class RzArticle : RzComponent<RzArticle.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzArticle component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex w-full justify-between pr-0 text-foreground dark:text-foreground",
        slots: new()
        {
            [s => s.InnerContainer] = "mx-auto flex max-w-7xl grow items-start gap-8",
            [s => s.Article] = "prose flex-1 min-w-0",
            [s => s.Aside] = "hidden shrink-0 self-start flex-col gap-2 lg:p-8 text-sm xl:flex"
        },
        variants: new()
        {
            [a => ((RzArticle)a).ProseWidth] = new Variant<ProseWidth, Slots>
            {
                [ProseWidth.Compact] = new() { [s => s.Article] = "prose-compact" },
                [ProseWidth.Comfortable] = new() { [s => s.Article] = "prose-comfortable" },
                [ProseWidth.Relaxed] = new() { [s => s.Article] = "prose-relaxed" },
                [ProseWidth.Wide] = new() { [s => s.Article] = "prose-wide" },
                [ProseWidth.UltraWide] = new() { [s => s.Article] = "prose-ultrawide" },
                [ProseWidth.Full] = new() { [s => s.Article] = "prose-full" }
            },
            [a => ((RzArticle)a).ColumnWidth] = new Variant<Size, Slots>
            {
                [Size.ExtraSmall] = new() { [s => s.Aside] = "w-48" },
                [Size.Small] = new() { [s => s.Aside] = "w-56" },
                [Size.Medium] = new() { [s => s.Aside] = "w-64" },
                [Size.Large] = new() { [s => s.Aside] = "w-72" },
                [Size.ExtraLarge] = new() { [s => s.Aside] = "w-80" }
            },
            [a => ((RzArticle)a).IsSideSticky] = new Variant<bool, Slots>
            {
                [true] = new() { [s => s.Aside] = "sticky top-0 z-10 max-h-[calc(100vh-4rem)] overflow-y-auto" },
                [false] = new() { [s => s.Aside] = "static z-auto max-h-none overflow-visible" }

            }
        }
    );

    /// <summary> Gets or sets the maximum character width of the main article content area. Defaults to Full. </summary>
    [Parameter]
    public ProseWidth ProseWidth { get; set; } = ProseWidth.Full;

    /// <summary> Gets or sets the width of the side column. Defaults to Large. </summary>
    [Parameter]
    public Size ColumnWidth { get; set; } = Size.Large;

    /// <summary> Gets or sets the content to render in the side column (e.g., QuickReference). </summary>
    [Parameter]
    public RenderFragment? SideContent { get; set; }

    /// <summary> Gets or sets the main content to render in the primary article area. Required. </summary>
    [Parameter]
    [EditorRequired]
    public required RenderFragment MainContent { get; set; }

    /// <summary>
    ///     Gets or sets a value indicating whether the side column should be fixed-positioned on larger screens.
    ///     Defaults to true.
    /// </summary>
    [Parameter]
    public bool IsSideSticky { get; set; } = false;

    /// <summary>
    /// Gets or sets the aria-label for the aside element, providing context for screen readers.
    /// If not set, defaults to a localized "Supplementary Content". Consider providing a more specific label based on the content
    /// (e.g., "On this page navigation", "Related links").
    /// </summary>
    [Parameter]
    public string? AsideAriaLabel { get; set; }


    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AsideAriaLabel ??= Localizer["RzArticle.DefaultAsideAriaLabel"];
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AsideAriaLabel ??= Localizer["RzArticle.DefaultAsideAriaLabel"];
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzArticle;

    /// <summary>
    /// Defines the slots available for styling in the RzArticle component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("article")]
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the inner container that holds the article and aside.
        /// </summary>
        [Slot("article-inner-container")]
        public string? InnerContainer { get; set; }
        /// <summary>
        /// The slot for the main article content.
        /// </summary>
        [Slot("article-content")]
        public string? Article { get; set; }
        /// <summary>
        /// The slot for the aside (side content).
        /// </summary>
        [Slot("article-aside")]
        public string? Aside { get; set; }
    }
}