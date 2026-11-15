
using AngleSharp;
using Bunit;
using Markdig;

namespace RizzyUI.Tests.Components.Document;

public class RzMarkdownTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzMarkdownTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_ConvertsMarkdownToHtml()
    {
        // Arrange
        var markdown = "# Hello World";

        // Act
        var cut = Render<RzMarkdown>(parameters => parameters
            .Add(p => p.Content, markdown)
        );

        // Assert
        var root = cut.Find("[data-slot='markdown']");
        var alpineDiv = root.FirstElementChild
            ?? throw new InvalidOperationException("Expected the markdown root to render an Alpine child element.");

        Assert.Equal("rzMarkdown", alpineDiv.GetAttribute("x-data"));

        var html = alpineDiv.ToHtml() ?? string.Empty;

        // Check conversion
        Assert.Contains("<h1 id=\"hello-world\">Hello World</h1>", html);
    }

    [Theory]
    [InlineData(ProseWidth.Compact, "prose-compact")]
    [InlineData(ProseWidth.UltraWide, "prose-ultrawide")]
    public void ProseWidth_AppliesCorrectClass(ProseWidth width, string expectedClass)
    {
        // Act
        var cut = Render<RzMarkdown>(parameters => parameters
            .Add(p => p.Content, "text")
            .Add(p => p.ProseWidth, width)
        );

        // Assert
        var root = cut.Find("[data-slot='markdown']");
        Assert.Contains(expectedClass, root.ClassList);
    }

    private const string RawHtmlMarkdown = "Before\n\n<img src=x onerror=alert(1)>\n\nInline <span onmouseover=\"alert(2)\">hover</span> text.";
    private const string GenericAttributeMarkdown = "# Title {onclick=\"alert(3)\" .injected}\n\n[link](https://example.com){onclick=\"alert(4)\"}";

    [Fact]
    public void Default_EscapesRawHtml()
    {
        var cut = Render<RzMarkdown>(parameters => parameters
            .Add(p => p.Content, RawHtmlMarkdown));

        var markdown = cut.Find("[x-data='rzMarkdown']");
        Assert.Empty(markdown.QuerySelectorAll("img"));
        Assert.Empty(markdown.QuerySelectorAll("span"));
        Assert.Empty(markdown.QuerySelectorAll("[onerror], [onmouseover]"));
        Assert.Contains("&lt;img src=x onerror=alert(1)&gt;", markdown.InnerHtml);
        Assert.Contains("<img src=x onerror=alert(1)>", markdown.TextContent);
    }

    [Fact]
    public void Default_IgnoresGenericAttributes()
    {
        var cut = Render<RzMarkdown>(parameters => parameters
            .Add(p => p.Content, GenericAttributeMarkdown));

        var markdown = cut.Find("[x-data='rzMarkdown']");
        Assert.Empty(markdown.QuerySelectorAll("[onclick]"));
        Assert.Empty(markdown.QuerySelectorAll(".injected"));
        Assert.Single(markdown.QuerySelectorAll("a[href='https://example.com']"));
    }

    [Fact]
    public void Default_KeepsHtmlEntitiesAndCodeBlocks()
    {
        var cut = Render<RzMarkdown>(parameters => parameters
            .Add(p => p.Content, "Use &lt;div&gt; here.\n\n```html\n<div class=\"x\">code</div>\n```"));

        var markdown = cut.Find("[x-data='rzMarkdown']");
        Assert.Contains("Use <div> here.", markdown.QuerySelector("p")!.TextContent);
        var code = markdown.QuerySelector("pre code")!;
        Assert.Contains("language-html", code.ClassList);
        Assert.Equal("<div class=\"x\">code</div>", code.TextContent.Trim());
    }

    [Fact]
    public void AllowUnsafeHtml_RendersRawHtmlAndGenericAttributes()
    {
        var cut = Render<RzMarkdown>(parameters => parameters
            .Add(p => p.Content, RawHtmlMarkdown + "\n\n" + GenericAttributeMarkdown)
            .Add(p => p.AllowUnsafeHtml, true));

        var markdown = cut.Find("[x-data='rzMarkdown']");
        Assert.Equal("alert(1)", markdown.QuerySelector("img")!.GetAttribute("onerror"));
        Assert.Equal("alert(2)", markdown.QuerySelector("span")!.GetAttribute("onmouseover"));
        var heading = markdown.QuerySelector("h1")!;
        Assert.Equal("alert(3)", heading.GetAttribute("onclick"));
        Assert.Contains("injected", heading.ClassList);
        Assert.Equal("alert(4)", markdown.QuerySelector("a")!.GetAttribute("onclick"));
    }

    [Fact]
    public void CustomPipeline_IsUsedAndAllowUnsafeHtmlIsIgnored()
    {
        var htmlPipeline = new MarkdownPipelineBuilder().Build();

        var withHtml = Render<RzMarkdown>(parameters => parameters
            .Add(p => p.Content, RawHtmlMarkdown)
            .Add(p => p.Pipeline, htmlPipeline));
        Assert.Single(withHtml.Find("[x-data='rzMarkdown']").QuerySelectorAll("img[onerror]"));

        var safePipeline = new MarkdownPipelineBuilder().DisableHtml().Build();
        var withoutHtml = Render<RzMarkdown>(parameters => parameters
            .Add(p => p.Content, RawHtmlMarkdown + "\n\n```csharp\nvar x = 1;\n```")
            .Add(p => p.Pipeline, safePipeline)
            .Add(p => p.AllowUnsafeHtml, true));
        var markdown = withoutHtml.Find("[x-data='rzMarkdown']");
        Assert.Empty(markdown.QuerySelectorAll("img"));
        // The custom pipeline has no RizzyUI syntax highlighting, so code is not given the hljs class.
        Assert.Empty(markdown.QuerySelectorAll("code.hljs"));
    }

    [Fact]
    public void DefaultPipelines_AreCachedAcrossInstances()
    {
        var pipelineProperty = typeof(RzMarkdown).GetProperty("EffectivePipeline",
            System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.NonPublic)!;

        var first = Render<RzMarkdown>(parameters => parameters.Add(p => p.Content, "a"));
        var second = Render<RzMarkdown>(parameters => parameters.Add(p => p.Content, "b"));
        var unsafeFirst = Render<RzMarkdown>(parameters => parameters.Add(p => p.Content, "c").Add(p => p.AllowUnsafeHtml, true));
        var unsafeSecond = Render<RzMarkdown>(parameters => parameters.Add(p => p.Content, "d").Add(p => p.AllowUnsafeHtml, true));

        Assert.Same(pipelineProperty.GetValue(first.Instance), pipelineProperty.GetValue(second.Instance));
        Assert.Same(pipelineProperty.GetValue(unsafeFirst.Instance), pipelineProperty.GetValue(unsafeSecond.Instance));
        Assert.NotSame(pipelineProperty.GetValue(first.Instance), pipelineProperty.GetValue(unsafeFirst.Instance));
    }

    [Fact]
    public void Default_DoesNotRewriteJavaScriptLinkUrls()
    {
        // Documents a known limitation of the safe default: link URLs are not filtered.
        var cut = Render<RzMarkdown>(parameters => parameters
            .Add(p => p.Content, "[x](javascript:alert(5))"));

        var link = cut.Find("[x-data='rzMarkdown'] a");
        Assert.StartsWith("javascript:", link.GetAttribute("href"));
    }
}