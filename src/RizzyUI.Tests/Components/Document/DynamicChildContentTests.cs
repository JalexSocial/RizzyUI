using Bunit;
using Microsoft.AspNetCore.Components;
using RizzyUI.Utility;

namespace RizzyUI.Tests.Components.Document;

/// <summary>
/// RZUI-050: child content produced by a Razor expression (a text frame, as in
/// <c>&lt;RzMarkdown&gt;@model.Text&lt;/RzMarkdown&gt;</c>) was dropped because only markup frames
/// were read.
/// </summary>
public class DynamicChildContentTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public DynamicChildContentTests(WebAppFixture fixture) : base(fixture)
    {
    }

    // What Razor generates for "@text" between the tags: a text frame.
    private static RenderFragment Expression(string text) => builder => builder.AddContent(0, text);

    [Fact]
    public void RzMarkdown_RendersContentFromAnExpression()
    {
        var cut = Render<RzMarkdown>(p => p.Add(x => x.ChildContent, Expression("# From the model\n\nA & B are **bold**")));

        var html = cut.Markup;
        Assert.Contains("From the model</h1>", html);
        Assert.Contains("<strong>bold</strong>", html);
        Assert.Contains("A &amp; B", html);
    }

    [Fact]
    public void RzCodeViewer_ShowsCodeFromAnExpression()
    {
        var cut = Render<RzCodeViewer>(p => p.Add(x => x.ChildContent, Expression("if (a < b && c) { }")));

        Assert.Contains("if (a &lt; b &amp;&amp; c) { }", cut.Markup);
    }

    [Fact]
    public void SourceText_KeepsLiteralMarkupAndExpressionsInOrder()
    {
        RenderFragment mixed = b =>
        {
            b.AddMarkupContent(0, "\n    Hello ");
            b.AddContent(1, "<Ada>");
            b.AddMarkupContent(2, "!\n");
        };

        // Literal markup stays as Razor wrote it; the expression is encoded the same way, so one
        // HtmlDecode by the caller restores both.
        Assert.Equal("    Hello &lt;Ada&gt;!", mixed.GetSourceText());
    }
}
