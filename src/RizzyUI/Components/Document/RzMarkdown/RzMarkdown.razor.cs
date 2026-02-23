
using Markdig;
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

    private string _assets = string.Empty;

    [Inject]
    private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    [CascadingParameter]
    private RzQuickReferenceContainer? QuickReferenceContainer { get; set; }

    /// <summary>
    /// Gets or sets the Markdig pipeline to use for rendering. If null, a default pipeline with advanced extensions is used.
    /// </summary>
    [Parameter]
    public MarkdownPipeline? Pipeline { get; set; }

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

        Pipeline ??= new MarkdownPipelineBuilder()
            .UseAdvancedExtensions()
            .UseRizzySyntaxHighlighting()
            .Build();

        UpdateAssets();
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
        var assetUrls = ComponentAssetKeys
            .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
            .Where(url => !string.IsNullOrEmpty(url))
            .ToList();
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
            markdownText = ChildContent.AsMarkupString().Outdent();
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
        var document = Markdown.Parse(markdownText, Pipeline);

        if (QuickReferenceContainer != null)
            foreach (var block in document)
                if (block is HeadingBlock heading)
                {
                    var level = heading.Level;
                    var headingText = ExtractPlainText(heading.Inline);
                    var attributes = heading.GetAttributes();
                    attributes.Id ??= IdGenerator.UniqueId("heading");
                    attributes.AddProperty("x-data", "rzHeading");

                    var headingLevel = level switch
                    {
                        1 => HeadingLevel.H1,
                        2 => HeadingLevel.H2,
                        3 => HeadingLevel.H3,
                        _ => HeadingLevel.H4
                    };

                    QuickReferenceContainer.RegisterHeading(headingLevel, headingText, attributes.Id);
                }

        return document.ToHtml(Pipeline);
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