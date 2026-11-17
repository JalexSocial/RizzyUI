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
