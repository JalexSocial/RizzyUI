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
        Assert.Equal("handleKeydown", root.GetAttribute("x-on:keydown"));
        Assert.Equal("closeMenu($event)", root.GetAttribute("x-on:keydown.escape.window"));
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

    [Fact]
    public void RzNavigationMenu_UsesDisclosureSemantics_NotMenuRoles()
    {
        var cut = Render<RzNavigationMenu>(p => p
            .AddChildContent<NavigationMenuList>(list => list
                .AddChildContent<NavigationMenuItem>(item => item
                    .AddChildContent<NavigationMenuTrigger>(t => t.AddChildContent("Products"))
                    .AddChildContent<NavigationMenuContent>(c => c.AddChildContent("Panel")))));

        var nav = cut.Find("[data-slot='navigation-menu']");
        Assert.Equal("nav", nav.TagName.ToLowerInvariant());
        Assert.Empty(cut.FindAll("[role='menu']"));
        Assert.Empty(cut.FindAll("[role='menuitem']"));
    }

    [Fact]
    public void RzNavigationMenu_TriggerAndContentIds_AreStableAndLinked()
    {
        var cut = Render<RzNavigationMenu>(p => p
            .AddChildContent<NavigationMenuList>(list => list
                .AddChildContent<NavigationMenuItem>(item => item
                    .AddChildContent<NavigationMenuTrigger>(t => t.AddChildContent("Products"))
                    .AddChildContent<NavigationMenuContent>(c => c.AddChildContent("Panel")))));

        var trigger = cut.Find("[data-slot='navigation-menu-trigger']");
        var content = cut.Find("[data-slot='navigation-menu-content']");

        Assert.EndsWith("-trigger", trigger.Id);
        Assert.EndsWith("-content", content.Id);
        Assert.Equal(content.Id, trigger.GetAttribute("aria-controls"));
        Assert.Equal("false", trigger.GetAttribute("aria-expanded"));
    }

    [Fact]
    public void RzNavigationMenu_TriggerUsesButtonKeyboardActivationContract()
    {
        var cut = Render<RzNavigationMenu>(p => p
            .AddChildContent<NavigationMenuList>(list => list
                .AddChildContent<NavigationMenuItem>(item => item
                    .AddChildContent<NavigationMenuTrigger>(t => t.AddChildContent("Products"))
                    .AddChildContent<NavigationMenuContent>(c => c.AddChildContent("Panel")))));

        var trigger = cut.Find("[data-slot='navigation-menu-trigger']");
        Assert.Equal("button", trigger.TagName.ToLowerInvariant());
        Assert.Equal("button", trigger.GetAttribute("type"));
        Assert.Equal("toggleActive", trigger.GetAttribute("x-on:click.prevent"));
        Assert.Equal("handleTriggerEnter", trigger.GetAttribute("x-on:focus"));
    }

    [Fact]
    public void RzNavigationMenu_PreservesPredictableTabOrderForTriggers()
    {
        var cut = Render<RzNavigationMenu>(p => p
            .AddChildContent<NavigationMenuList>(list => list
                .AddChildContent<NavigationMenuItem>(item => item
                    .AddChildContent<NavigationMenuTrigger>(t => t.AddChildContent("Products"))
                    .AddChildContent<NavigationMenuContent>(c => c.AddChildContent("Panel")))
                .AddChildContent<NavigationMenuItem>(item => item
                    .AddChildContent<NavigationMenuTrigger>(t => t.AddChildContent("Guides"))
                    .AddChildContent<NavigationMenuContent>(c => c.AddChildContent("Panel 2")))));

        var triggers = cut.FindAll("[data-slot='navigation-menu-trigger']");
        Assert.Equal(2, triggers.Count);
        Assert.All(triggers, trigger => Assert.False(trigger.HasAttribute("tabindex")));
    }


    [Fact]
    public void NavigationMenuLink_RendersTopLevelKeyboardDataSlotAndHref()
    {
        var cut = Render<NavigationMenuLink>(p => p
            .Add(x => x.Href, "/docs")
            .AddChildContent("Docs"));

        var link = cut.Find("[data-slot='navigation-menu-link']");
        Assert.Equal("/docs", link.GetAttribute("href"));
        Assert.False(link.HasAttribute("tabindex"));
    }

    [Fact]
    public void RzNavigationMenu_CspAndBundleHooksArePresentInMarkup()
    {
        var cut = Render<RzNavigationMenu>(p => p.AddChildContent("Items"));
        var root = cut.Find("[data-slot='navigation-menu']");

        Assert.Equal("rzNavigationMenu", root.GetAttribute("x-data"));
        Assert.NotNull(root.GetAttribute("x-load"));
        Assert.Equal(root.Id, root.GetAttribute("data-alpine-root"));
    }

}
