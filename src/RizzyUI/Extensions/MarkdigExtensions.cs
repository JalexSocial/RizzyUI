
using Markdig;
using Markdig.Renderers;
using Markdig.Renderers.Html;
using Markdig.Renderers.Html.Inlines;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;

namespace RizzyUI.Extensions;

/// <summary>
///     A Markdown extension that customizes the rendering of both block and inline code.
///     It ensures that all code tags include the "hljs" class, wraps fenced code blocks in a &lt;pre&gt; tag,
///     and renders inline code without a &lt;pre&gt; wrapper.
/// </summary>
public class RizzyCodeBlockExtension : IMarkdownExtension
{
    /// <summary>
    ///     Performs initial setup for the Markdown pipeline.
    /// </summary>
    /// <param name="pipeline">The Markdown pipeline builder.</param>
    public void Setup(MarkdownPipelineBuilder pipeline)
    {
        // No additional setup required.
    }

    /// <summary>
    ///     Configures the Markdown renderer to use custom renderers for code blocks and inline code.
    /// </summary>
    /// <param name="pipeline">The Markdown pipeline.</param>
    /// <param name="renderer">The Markdown renderer.</param>
    public void Setup(MarkdownPipeline pipeline, IMarkdownRenderer renderer)
    {
        if (renderer is HtmlRenderer htmlRenderer)
        {
            // Remove and replace the existing CodeBlockRenderer.
            var originalCodeBlockRenderer = htmlRenderer.ObjectRenderers.FindExact<CodeBlockRenderer>();
            if (originalCodeBlockRenderer != null) htmlRenderer.ObjectRenderers.Remove(originalCodeBlockRenderer);
            htmlRenderer.ObjectRenderers.AddIfNotAlready(new RizzyCodeBlockRenderer(originalCodeBlockRenderer));

            // Remove and replace the existing CodeInlineRenderer.
            var originalCodeInlineRenderer = htmlRenderer.ObjectRenderers.FindExact<CodeInlineRenderer>();
            if (originalCodeInlineRenderer != null) htmlRenderer.ObjectRenderers.Remove(originalCodeInlineRenderer);
            htmlRenderer.ObjectRenderers.AddIfNotAlready(new RizzyCodeInlineRenderer(originalCodeInlineRenderer));
        }
    }
}

/// <summary>
///     A custom HTML renderer for Markdown code blocks that outputs them with the "hljs" class and an optional language
///     class.
///     Fenced code blocks are wrapped in &lt;pre&gt; tags, while non-fenced blocks are rendered with just a &lt;code&gt;
///     tag.
/// </summary>
public class RizzyCodeBlockRenderer : HtmlObjectRenderer<CodeBlock>
{
    private readonly CodeBlockRenderer? _originalRenderer;

    /// <summary>
    ///     Initializes a new instance of the <see cref="RizzyCodeBlockRenderer" /> class.
    /// </summary>
    /// <param name="originalRenderer">The original code block renderer, if any.</param>
    public RizzyCodeBlockRenderer(CodeBlockRenderer? originalRenderer = null)
    {
        _originalRenderer = originalRenderer;
    }

    /// <summary>
    ///     Writes the specified <see cref="CodeBlock" /> as HTML.
    /// </summary>
    /// <param name="renderer">The HTML renderer.</param>
    /// <param name="obj">The code block to render.</param>
    protected override void Write(HtmlRenderer renderer, CodeBlock obj)
    {
        // Build the base class attribute value with "hljs".
        var classes = "hljs";

        if (obj is FencedCodeBlock fencedCodeBlock)
        {
            var language = fencedCodeBlock.Info?.Trim() ?? string.Empty;
            if (!string.IsNullOrEmpty(language)) classes += $" language-{language}";

            // Write the opening tags for a fenced code block.
            renderer.Write("<pre><code");
            renderer.Write($" class=\"{classes}\"");
            renderer.Write(">");
        }
        else
        {
            // For non-fenced code blocks, only write the <code> tag.
            renderer.Write("<code");
            renderer.Write($" class=\"{classes}\"");
            renderer.Write(">");
        }

        // Write the content of the code block with HTML escaping.
        var content = obj.Lines.ToString();
        renderer.WriteEscape(content);

        // Write the closing tags.
        if (obj is FencedCodeBlock)
            renderer.Write("</code></pre>");
        else
            renderer.Write("</code>");
    }
}

/// <summary>
///     A custom HTML renderer for inline code that outputs code spans with the "hljs" class.
///     Inline code is rendered without a wrapping &lt;pre&gt; tag.
/// </summary>
public class RizzyCodeInlineRenderer : HtmlObjectRenderer<CodeInline>
{
    private readonly CodeInlineRenderer? _originalRenderer;

    /// <summary>
    ///     Initializes a new instance of the <see cref="RizzyCodeInlineRenderer" /> class.
    /// </summary>
    /// <param name="originalRenderer">The original inline code renderer, if any.</param>
    public RizzyCodeInlineRenderer(CodeInlineRenderer? originalRenderer = null)
    {
        _originalRenderer = originalRenderer;
    }

    /// <summary>
    ///     Writes the specified <see cref="CodeInline" /> as HTML.
    /// </summary>
    /// <param name="renderer">The HTML renderer.</param>
    /// <param name="obj">The inline code element to render.</param>
    protected override void Write(HtmlRenderer renderer, CodeInline obj)
    {
        renderer.Write("<code class=\"hljs\">");
        renderer.WriteEscape(obj.Content);
        renderer.Write("</code>");
    }
}

/// <summary>
///     Provides extension methods for <see cref="MarkdownPipelineBuilder" /> to add Rizzy syntax highlighting.
/// </summary>
public static class MarkdownPipelineBuilderExtensions
{
    /// <summary>
    ///     Adds the Rizzy syntax highlighting extension to the Markdown pipeline.
    /// </summary>
    /// <param name="pipeline">The Markdown pipeline builder.</param>
    /// <returns>The updated Markdown pipeline builder.</returns>
    public static MarkdownPipelineBuilder UseRizzySyntaxHighlighting(this MarkdownPipelineBuilder pipeline)
    {
        pipeline.Extensions.Add(new RizzyCodeBlockExtension());
        return pipeline;
    }
}