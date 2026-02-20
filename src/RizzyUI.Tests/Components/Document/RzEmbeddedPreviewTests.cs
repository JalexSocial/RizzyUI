
using Bunit;

namespace RizzyUI.Tests.Components.Document;

public class RzEmbeddedPreviewTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzEmbeddedPreviewTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_ShowsIFrame()
    {
        // Arrange
        var id = "preview";

        // Act
        var cut = Render<RzEmbeddedPreview>(parameters => parameters
            .Add(p => p.Id, id)
            .AddChildContent("<div>Preview Content</div>")
        );

        // Assert
        var iframe = cut.Find("iframe");
        Assert.Equal("rzEmbeddedPreview", iframe.GetAttribute("x-data"));
        Assert.Equal(id, iframe.GetAttribute("data-alpine-root"));
        Assert.NotNull(iframe.GetAttribute("srcdoc"));
        Assert.Contains("Preview Content", iframe.GetAttribute("srcdoc"));
    }

    [Fact]
    public void IFrameTitle_AppliesAttribute()
    {
        // Act
        var cut = Render<RzEmbeddedPreview>(parameters => parameters
            .AddChildContent("Content")
            .Add(p => p.IFrameTitle, "My Demo")
        );

        // Assert
        var iframe = cut.Find("iframe");
        Assert.Equal("My Demo", iframe.GetAttribute("title"));
    }
}