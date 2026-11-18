
using RizzyUI.Utility;
using Markdig;
using Markdig.Extensions.GenericAttributes;
using Markdig.Renderers.Html;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using Rizzy.Utility;
using RizzyUI.Extensions;
using System.Text;
using System.Text.Json;
using System.Web;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     A component that converts Markdown text (provided as ChildContent or Content parameter) into HTML using Markdig.
///     It supports GitHub Flavored Markdown extensions and integrates with Highlight.js for syntax highlighting.
///     Styling is determined by the active &lt;see cref="RzTheme" /&gt; and Tailwind Typography plugin.
/// </xmldoc>
public partial class RzMarkdown : RzComponent<RzMarkdown.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzMarkdown component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "prose dark:prose-invert text-foreground max-w-none",
        variants: new()
        {
            [m => ((RzMarkdown)m).ProseWidth] = new Variant<ProseWidth, Slots>
            {
                [ProseWidth.Compact] = "prose-compact",
                [ProseWidth.Comfortable] = "prose-comfortable",
                [ProseWidth.Relaxed] = "prose-relaxed",
                [ProseWidth.Wide] = "prose-wide",
                [ProseWidth.UltraWide] = "prose-ultrawide",
                [ProseWidth.Full] = "prose-full"
            }
        }
    );

    private static readonly MarkdownPipeline SafePipeline = CreateDefaultPipeline(allowUnsafeHtml: false);
    private static readonly MarkdownPipeline UnsafePipeline = CreateDefaultPipeline(allowUnsafeHtml: true);

    private string _assets = string.Empty;

    [Inject]
    private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    [CascadingParameter]
    private RzQuickReferenceContainer? QuickReferenceContainer { get; set; }

    /// <summary>
    /// Gets or sets a custom Markdig pipeline to use for rendering. When set, it is used as-is and
    /// <see cref="AllowUnsafeHtml"/> has no effect: whether the pipeline allows raw HTML or generic
    /// attributes is the caller's responsibility. When null, a cached default pipeline with advanced
    /// extensions and RizzyUI syntax highlighting is used. Unsafe Markdown link URLs (see
    /// <see cref="AllowUnsafeHtml"/>) are removed with any pipeline.
    /// </summary>
    [Parameter]
    public MarkdownPipeline? Pipeline { get; set; }

    /// <summary>
    /// Gets or sets whether the default pipeline renders raw HTML and Markdig generic attributes
    /// (for example <c>{onclick="..."}</c>). Defaults to <c>false</c>: raw HTML is escaped and shown
    /// as text, and generic attribute blocks are not parsed.
    /// </summary>
    /// <remarks>
    /// Set this to <c>true</c> only for trusted, developer-authored content. With it enabled, Markdown
    /// can inject any element and attribute, including event handlers and Alpine (<c>x-*</c>) or htmx
    /// (<c>hx-*</c>) attributes, which are live because the output is rendered inside an Alpine scope.
    /// Never enable it for user-supplied content. Ignored when <see cref="Pipeline"/> is set.
    /// Markdown links, images and autolinks with a script-capable URL (<c>javascript:</c>,
    /// <c>vbscript:</c>, or <c>data:</c> other than a raster image) are always reduced to their text,
    /// but URLs inside raw HTML are not filtered.
    /// </remarks>
    [Parameter]
    public bool AllowUnsafeHtml { get; set; }

    /// <summary>
    /// Gets or sets the Markdown content as a RenderFragment. This is used if the `Content` parameter is not set.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the Markdown content as a string. This takes precedence over `ChildContent`.
    /// </summary>
    [Parameter]
    public string? Content { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the maximum width of the rendered prose content.
    /// </summary>
    [Parameter]
    public ProseWidth ProseWidth { get; set; } = ProseWidth.Comfortable;

    /// <summary>
    ///     Optional array of asset keys (from <see cref="RizzyUIConfig.AssetUrls"/>) to load, primarily for syntax highlighting.
    ///     Defaults to keys for Highlight.js core and the Razor plugin.
    /// </summary>
    [Parameter]
    public string[] ComponentAssetKeys { get; set; } = ["HighlightJsCore", "HighlightJsRazor"];

    /// <summary>
    /// Gets the rendered HTML output as a MarkupString.
    /// </summary>
    protected MarkupString? OutputHtml { get; private set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        UpdateAssets();
    }

    private MarkdownPipeline EffectivePipeline => Pipeline ?? (AllowUnsafeHtml ? UnsafePipeline : SafePipeline);

    /// <summary>
    /// Builds a default pipeline: advanced extensions plus RizzyUI syntax highlighting. Unless
    /// <paramref name="allowUnsafeHtml"/> is true, raw HTML is disabled and the generic attributes
    /// extension is removed.
    /// </summary>
    internal static MarkdownPipeline CreateDefaultPipeline(bool allowUnsafeHtml)
    {
        var builder = new MarkdownPipelineBuilder().UseAdvancedExtensions();

        if (!allowUnsafeHtml)
        {
            builder.Extensions.TryRemove<GenericAttributesExtension>();
            builder.DisableHtml();
        }

        return builder.UseRizzySyntaxHighlighting().Build();
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        RenderMarkdownContent();
        UpdateAssets();
    }

    private void UpdateAssets()
    {
        var assetUrls = RizzyUIConfig.Value.ResolveAssets(ComponentAssetKeys, RequestPathBase);
        _assets = JsonSerializer.Serialize(assetUrls);
    }

    private void RenderMarkdownContent()
    {
        if (OutputHtml != null)
            return;

        string markdownText;

        if (!string.IsNullOrEmpty(Content))
        {
            markdownText = Content;
        }
        else if (ChildContent != null)
        {
            markdownText = ChildContent.GetSourceText().Outdent();
            markdownText = HttpUtility.HtmlDecode(markdownText);
        }
        else
        {
            markdownText = string.Empty;
        }

        var html = RenderOutput(markdownText);
        OutputHtml = new MarkupString(html);
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzMarkdown;

    private string RenderOutput(string markdownText)
    {
        var pipeline = EffectivePipeline;
        var document = Markdown.Parse(markdownText, pipeline);
        RemoveUnsafeLinks(document);

        if (QuickReferenceContainer != null)
            foreach (var block in document)
                if (block is HeadingBlock heading)
                {
                    var level = heading.Level;
                    var headingText = ExtractPlainText(heading.Inline);
                    var attributes = heading.GetAttributes();
                    attributes.Id ??= IdGenerator.UniqueId("heading");
                    attributes.AddProperty("x-data", "rzHeading");
                    if (!string.IsNullOrWhiteSpace(LoadStrategy))
                        attributes.AddProperty("x-load", LoadStrategy);

                    var headingLevel = level switch
                    {
                        1 => HeadingLevel.H1,
                        2 => HeadingLevel.H2,
                        3 => HeadingLevel.H3,
                        _ => HeadingLevel.H4
                    };

                    QuickReferenceContainer.RegisterHeading(headingLevel, headingText, attributes.Id);
                }

        return document.ToHtml(pipeline);
    }

    /// <summary>
    /// Replaces Markdown links, images and autolinks whose URL can run script with their content:
    /// a link keeps its text, an image its alt text, and an autolink its URL as plain text.
    /// </summary>
    private static void RemoveUnsafeLinks(MarkdownDocument document)
    {
        foreach (var link in document.Descendants<LinkInline>().ToList())
        {
            if (!IsUnsafeUrl(link.Url, link.IsImage))
                continue;

            var child = link.FirstChild;
            while (child != null)
            {
                var next = child.NextSibling;
                child.Remove();
                link.InsertBefore(child);
                child = next;
            }
            link.Remove();
        }

        foreach (var autolink in document.Descendants<AutolinkInline>().ToList())
        {
            if (IsUnsafeUrl(autolink.Url, isImage: false))
                autolink.ReplaceBy(new LiteralInline(autolink.Url));
        }
    }

    /// <summary>
    /// Returns true for URLs with a scheme that can run script when followed or loaded:
    /// <c>javascript:</c>, <c>vbscript:</c>, and <c>data:</c> (except raster images in an image).
    /// Whitespace and control characters are ignored, as browsers ignore them inside a scheme.
    /// </summary>
    internal static bool IsUnsafeUrl(string? url, bool isImage)
    {
        if (string.IsNullOrEmpty(url))
            return false;

        var normalized = new StringBuilder(16);
        foreach (var c in url)
        {
            if (c <= ' ' || char.IsControl(c))
                continue;
            normalized.Append(char.ToLowerInvariant(c));
            if (normalized.Length == 16)
                break;
        }

        var prefix = normalized.ToString();
        if (prefix.StartsWith("javascript:", StringComparison.Ordinal) || prefix.StartsWith("vbscript:", StringComparison.Ordinal))
            return true;

        if (!prefix.StartsWith("data:", StringComparison.Ordinal))
            return false;

        return !(isImage && prefix.StartsWith("data:image/", StringComparison.Ordinal) && !prefix.StartsWith("data:image/svg", StringComparison.Ordinal));
    }

    private string ExtractPlainText(ContainerInline? inline)
    {
        if (inline == null) return string.Empty;
        var sb = new StringBuilder();
        foreach (var child in inline)
            if (child is LiteralInline literal)
                sb.Append(literal.Content.Text.Substring(literal.Content.Start, literal.Content.Length));
            else if (child is ContainerInline container) sb.Append(ExtractPlainText(container));

        return sb.ToString().Trim();
    }

    /// <summary>
    /// Defines the slots available for styling in the RzMarkdown component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}