using Bunit;

namespace RizzyUI.Tests.Components.Utility;

public class RzBackToTopTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzBackToTopTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_UsesButtonWithRequiredAttributes()
    {
        var cut = Render<RzBackToTop>();

        var root = cut.Find("[data-slot='back-to-top']");

        Assert.Equal("button", root.TagName.ToLowerInvariant());
        Assert.Equal("rzBackToTop", root.GetAttribute("x-data"));
        Assert.Equal(root.GetAttribute("id"), root.GetAttribute("data-alpine-root"));
        Assert.Equal("Back to top", root.GetAttribute("aria-label"));
        Assert.Equal("back-to-top", root.GetAttribute("data-slot"));
    }
}