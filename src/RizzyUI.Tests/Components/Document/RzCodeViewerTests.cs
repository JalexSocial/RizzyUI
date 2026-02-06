
using Bunit;

namespace RizzyUI.Tests.Components.Document;

public class RzCodeViewerTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzCodeViewerTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_ShowsCorrectStructureWithAlpine()
    {
        // Arrange
        var id = "code-viewer";

        // Act
        var cut = RenderComponent<RzCodeViewer>(parameters => parameters
            .Add(p => p.Id, id)
            .Add(p => p.Source, "console.log('hi');")
        );

        // Assert
        var root = cut.Find($"[data-alpine-root='{id}']");
        Assert.Equal("rzCodeViewer", root.GetAttribute("x-data"));
        Assert.NotNull(root.GetAttribute("data-assets")); // Should have assets for HLJS
        Assert.NotNull(root.GetAttribute("data-codeid"));
    }

    [Fact]
    public void SourceParameter_RendersCodeBlock()
    {
        // Act
        var cut = RenderComponent<RzCodeViewer>(parameters => parameters
            .Add(p => p.Source, "var x = 1;")
            .Add(p => p.Language, "javascript")
        );

        // Assert
        var code = cut.Find("code");
        Assert.Contains("language-javascript", code.ClassList);
        Assert.Contains("var x = 1;", code.TextContent);
    }

    [Fact]
    public void ViewerTitle_RendersHeader()
    {
        // Act
        var cut = RenderComponent<RzCodeViewer>(parameters => parameters
            .Add(p => p.Source, "test")
            .Add(p => p.ViewerTitle, "My Snippet")
        );

        // Assert
        var title = cut.Find("span"); // Based on DefaultDescriptor structure for HeaderTitle
        Assert.Contains("My Snippet", title.TextContent);
    }
}