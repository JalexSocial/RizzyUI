using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Utility;

public class RzBackToTopTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzBackToTopTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_UsesButtonWithRequiredAttributes()
    {
        var cut = Render<RzBackToTop>(parameters => parameters
            .Add(p => p.AriaLabel, "Back to top"));

        var root = cut.Find("[data-slot='back-to-top']");

        Assert.Equal("button", root.TagName.ToLowerInvariant());
        Assert.Equal("rzBackToTop", root.GetAttribute("x-data"));
        Assert.Equal(root.GetAttribute("id"), root.GetAttribute("data-alpine-root"));
        Assert.Equal("Back to top", root.GetAttribute("aria-label"));
        Assert.Equal("back-to-top", root.GetAttribute("data-slot"));
        Assert.Equal("300", root.GetAttribute("data-threshold"));
        Assert.Equal("scrollToTop", root.GetAttribute("x-on:click.prevent"));
    }

    [Fact]
    public void DefaultRender_RendersFallbackIconWhenChildContentMissing()
    {
        var cut = Render<RzBackToTop>();

        var icon = cut.Find("[data-slot='icon']");

        Assert.Equal("true", icon.GetAttribute("aria-hidden"));
    }

    [Fact]
    public void AsChild_MergesAttributesOntoChildElement()
    {
        RenderFragment child = b =>
        {
            b.OpenElement(0, "a");
            b.AddAttribute(1, "href", "#top");
            b.AddContent(2, "Top");
            b.CloseElement();
        };

        var cut = Render<RzBackToTop>(parameters => parameters
            .Add(p => p.AsChild, true)
            .Add(p => p.Threshold, 500)
            .Add(p => p.ChildContent, child));

        var root = cut.Find("[data-slot='back-to-top']");

        Assert.Equal("a", root.TagName.ToLowerInvariant());
        Assert.Equal("500", root.GetAttribute("data-threshold"));
        Assert.Equal("button", root.GetAttribute("type"));
        Assert.Equal("scrollToTop", root.GetAttribute("x-on:click.prevent"));
        Assert.Equal("#top", root.GetAttribute("href"));
    }
}
