using Bunit;

namespace RizzyUI.Tests.Components.Navigation;

public class RzPaginationTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzPaginationTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RzPagination_DefaultsToNavAndHasDataSlot()
    {
        var cut = RenderComponent<RzPagination>();

        var nav = cut.Find("nav");
        Assert.Equal("pagination", nav.GetAttribute("data-slot"));
        Assert.False(string.IsNullOrWhiteSpace(nav.GetAttribute("aria-label")));
    }

    [Fact]
    public void PaginationLink_WhenActive_UsesAriaCurrentPage()
    {
        var cut = RenderComponent<PaginationLink>(parameters => parameters
            .Add(p => p.IsActive, true)
            .Add(p => p.Href, "/page/2")
            .AddChildContent("2"));

        var link = cut.Find("a");
        Assert.Equal("page", link.GetAttribute("aria-current"));
        Assert.Equal("/page/2", link.GetAttribute("href"));
    }

    [Fact]
    public void PaginationPrevious_UsesProvidedLabels()
    {
        var cut = RenderComponent<PaginationPrevious>(parameters => parameters
            .Add(p => p.AriaLabel, "Go back")
            .Add(p => p.Label, "Prev"));

        var link = cut.Find("a");
        Assert.Equal("Go back", link.GetAttribute("aria-label"));
        Assert.Contains("Prev", link.TextContent);
    }

    [Fact]
    public void PaginationEllipsis_RendersScreenReaderText()
    {
        var cut = RenderComponent<PaginationEllipsis>(parameters => parameters
            .Add(p => p.ScreenReaderText, "Hidden pages"));

        Assert.Contains("Hidden pages", cut.Markup);
        var container = cut.Find("span");
        Assert.Equal("true", container.GetAttribute("aria-hidden"));
    }
}
