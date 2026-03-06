using Bunit;

namespace RizzyUI.Tests.Components.Navigation;

public class RzNavigationMenuTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzNavigationMenuTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void RzNavigationMenu_RendersSemanticNavWithAlpineContract()
    {
        var cut = Render<RzNavigationMenu>(p => p
            .Add(x => x.Orientation, Orientation.Vertical)
            .AddChildContent("Items"));

        var root = cut.Find("[data-slot='navigation-menu']");
        Assert.Equal("nav", root.TagName.ToLowerInvariant());
        Assert.Equal("vertical", root.GetAttribute("data-orientation"));
        Assert.Equal("rzNavigationMenu", root.GetAttribute("x-data"));
        Assert.Equal("closeMenu", root.GetAttribute("x-on:keydown.escape.window"));
        Assert.NotNull(root.GetAttribute("aria-label"));
    }

    [Fact]
    public void RzNavigationMenu_RendersTriggerAndContentRelationship()
    {
        var cut = Render<RzNavigationMenu>(p => p
            .AddChildContent<NavigationMenuList>(list => list
                .AddChildContent<NavigationMenuItem>(item => item
                    .AddChildContent<NavigationMenuTrigger>(t => t.AddChildContent("Products"))
                    .AddChildContent<NavigationMenuContent>(c => c.AddChildContent("Panel")))));

        var trigger = cut.Find("[data-slot='navigation-menu-trigger']");
        var content = cut.Find("[data-slot='navigation-menu-content']");

        Assert.Equal("true", trigger.GetAttribute("aria-haspopup"));
        Assert.Equal("false", trigger.GetAttribute("aria-expanded"));
        Assert.Equal(content.Id, trigger.GetAttribute("aria-controls"));
        Assert.Equal("true", content.HasAttribute("x-cloak").ToString().ToLowerInvariant());
    }

    [Fact]
    public void RzNavigationMenu_PartialConfigurationStillRenders()
    {
        var cut = Render<RzNavigationMenu>(p => p
            .Add(x => x.AriaLabel, "Main site navigation")
            .AddUnmatched("class", "my-nav")
            .AddChildContent("Links"));

        var root = cut.Find("[data-slot='navigation-menu']");
        Assert.Equal("Main site navigation", root.GetAttribute("aria-label"));
        Assert.Contains("my-nav", root.ClassList);
    }
}
