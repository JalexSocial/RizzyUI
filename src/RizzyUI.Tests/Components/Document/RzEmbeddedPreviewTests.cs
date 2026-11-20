
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

        // Assert: the Alpine component is on the wrapper. The CSP build of Alpine refuses to evaluate
        // expressions on an <iframe>, so the iframe carries no Alpine directives except x-ref.
        var root = cut.Find("[data-slot='embedded-preview']");
        Assert.Equal("rzEmbeddedPreview", root.GetAttribute("x-data"));
        Assert.Equal(id, root.GetAttribute("data-alpine-root"));
        Assert.Equal(id, root.Id);

        var iframe = cut.Find("iframe");
        Assert.Equal("iframe", iframe.GetAttribute("x-ref"));
        Assert.DoesNotContain(iframe.Attributes, a => a.Name.StartsWith("x-", StringComparison.Ordinal) && a.Name != "x-ref");
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