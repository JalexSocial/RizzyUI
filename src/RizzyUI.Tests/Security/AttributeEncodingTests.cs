using AngleSharp;
using Bunit;
using Markdig;
using RizzyUI.Extensions;

namespace RizzyUI.Tests.Security;

/// <summary>
/// Regression tests for HTML attribute injection in markup that RizzyUI builds as strings
/// (asChild markup merging and the Markdown code-fence renderer).
/// </summary>
public class AttributeEncodingTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public AttributeEncodingTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void AsChild_MarkupChild_CallerAttributeWithQuotes_StaysInsideItsAttribute()
    {
        const string payload = "x\" onmouseover=\"alert(1)";

        var cut = Render<RzDialog>(parameters => parameters
            .AddChildContent<DialogTrigger>(trigger => trigger
                .Add(p => p.AsChild, true)
                .AddUnmatched("title", payload)
                .AddChildContent("<a href=\"/somewhere\">Open</a>"))
            .AddChildContent<DialogContent>(content => content.AddChildContent("Body")));

        var anchor = cut.Find("a[href='/somewhere']");
        Assert.Null(anchor.GetAttribute("onmouseover"));
        Assert.Equal(payload, anchor.GetAttribute("title"));
    }

    [Fact]
    public void AsChild_MarkupChild_TailwindArbitraryVariantClassesAreNotDoubleEncoded()
    {
        var cut = Render<RzDialog>(parameters => parameters
            .AddChildContent<DialogTrigger>(trigger => trigger
                .Add(p => p.AsChild, true)
                .AddUnmatched("class", "[&_svg]:size-4")
                .AddChildContent("<a href=\"/somewhere\">Open</a>"))
            .AddChildContent<DialogContent>(content => content.AddChildContent("Body")));

        var anchor = cut.Find("a[href='/somewhere']");
        Assert.Contains("[&_svg]:size-4", anchor.GetAttribute("class"));
    }

    [Fact]
    public void AsChild_MarkupChild_CallerValuesAreShownAsTyped()
    {
        // RZUI-015 follow-up: '&' in a caller value was written unencoded, so "a &amp; b" was shown
        // as "a & b" and "<b>" relied on the browser's lenient parsing.
        var cut = Render<RzDialog>(parameters => parameters
            .AddChildContent<DialogTrigger>(trigger => trigger
                .Add(p => p.AsChild, true)
                .AddUnmatched("title", "Tom &amp; Jerry <b>")
                .AddUnmatched("data-note", "it's \"quoted\"")
                .AddChildContent("<a href=\"/somewhere\">Open</a>"))
            .AddChildContent<DialogContent>(content => content.AddChildContent("Body")));

        var anchor = cut.Find("a[href='/somewhere']");
        Assert.Equal("Tom &amp; Jerry <b>", anchor.GetAttribute("title"));
        Assert.Equal("it's \"quoted\"", anchor.GetAttribute("data-note"));
    }

    [Fact]
    public void AsChild_MarkupChild_MergedMarkupValuesAreNotDoubleEncoded()
    {
        // A class written in the child's markup with an entity is decoded before merging and encoded
        // once on output.
        var cut = Render<RzDialog>(parameters => parameters
            .AddChildContent<DialogTrigger>(trigger => trigger
                .Add(p => p.AsChild, true)
                .AddUnmatched("class", "px-2")
                .AddChildContent("<a href=\"/somewhere\" class=\"[&amp;_svg]:size-4 py-1\">Open</a>"))
            .AddChildContent<DialogContent>(content => content.AddChildContent("Body")));

        var classes = cut.Find("a[href='/somewhere']").GetAttribute("class")!;
        Assert.Contains("[&_svg]:size-4", classes);
        Assert.DoesNotContain("&amp;", classes);
        Assert.Contains("px-2", classes);
    }

    [Fact]
    public async Task MarkdownCodeFence_InfoStringCannotInjectAttributes()
    {
        var pipeline = new MarkdownPipelineBuilder().UseRizzySyntaxHighlighting().Build();
        var markdown = "```x\"onmouseover=\"alert(1)\"\ncode\n```";

        var html = Markdown.ToHtml(markdown, pipeline);

        var context = BrowsingContext.New(AngleSharp.Configuration.Default);
        var document = await context.OpenAsync(request => request.Content(html));
        var code = document.QuerySelector("code")!;

        Assert.Null(code.GetAttribute("onmouseover"));
        Assert.StartsWith("hljs language-", code.GetAttribute("class"));
    }
}
