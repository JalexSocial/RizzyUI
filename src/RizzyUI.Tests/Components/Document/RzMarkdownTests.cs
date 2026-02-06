
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
        var cut = RenderComponent<RzMarkdown>(parameters => parameters
            .Add(p => p.Content, markdown)
        );

        // Assert
        var root = cut.Find("[data-slot='markdown']");
        var alpineDiv = root.FirstElementChild;
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
        var cut = RenderComponent<RzMarkdown>(parameters => parameters
            .Add(p => p.Content, "text")
            .Add(p => p.ProseWidth, width)
        );

        // Assert
        var root = cut.Find("[data-slot='markdown']");
        Assert.Contains(expectedClass, root.ClassList);
    }
}