using Bunit;

using SidebarProviderComponent = global::RizzyUI.RzSidebarProvider;

namespace RizzyUI.Tests.Components.Navigation.RzSidebar;

public class RzSidebarProviderTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzSidebarProviderTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void DefaultRender_EmitsSidebarProviderSlotsAndAlpineHooks()
    {
        var cut = Render<SidebarProviderComponent>(p => p.AddChildContent("Sidebar content"));
        var root = cut.Find("[data-slot='sidebar-wrapper']");

        Assert.Equal("rzSidebar", root.GetAttribute("x-data"));
        Assert.Equal("isMobile", root.GetAttribute("x-mobile"));
        Assert.Equal(root.Id, root.GetAttribute("data-alpine-root"));
        Assert.Equal("true", root.GetAttribute("data-default-open"));
        Assert.Equal("offcanvas", root.GetAttribute("data-collapsible"));
        Assert.Equal("b", root.GetAttribute("data-shortcut"));
        Assert.Equal("sidebar_state", root.GetAttribute("data-cookie-name"));
        Assert.Contains("group/sidebar-wrapper", root.GetAttribute("class"));
    }

    [Fact]
    public void ParameterCombinations_RenderStyleVariablesAndDataAttributes()
    {
        var cut = Render<SidebarProviderComponent>(p => p
            .Add(x => x.DefaultOpen, false)
            .Add(x => x.Collapsible, SidebarCollapsible.Icon)
            .Add(x => x.KeyboardShortcut, "k")
            .Add(x => x.PersistenceCookieName, string.Empty)
            .Add(x => x.Width, "20rem")
            .Add(x => x.MobileWidth, "22rem")
            .Add(x => x.IconWidth, "4rem")
            .AddChildContent("Sidebar"));

        var root = cut.Find("[data-slot='sidebar-wrapper']");
        var style = cut.Find("style");

        Assert.Equal("false", root.GetAttribute("data-default-open"));
        Assert.Equal("icon", root.GetAttribute("data-collapsible"));
        Assert.Equal("k", root.GetAttribute("data-shortcut"));
        Assert.Equal(string.Empty, root.GetAttribute("data-cookie-name"));
        Assert.Contains("--sidebar-width: 20rem", style.TextContent);
        Assert.Contains("--sidebar-mobile-width: 22rem", style.TextContent);
        Assert.Contains("--sidebar-width-icon: 4rem", style.TextContent);
    }

    [Fact]
    public void AdditionalClass_MergesWithDefaults()
    {
        var cut = Render<SidebarProviderComponent>(p => p
            .Add(x => x.AdditionalAttributes, new Dictionary<string, object?> { ["class"] = "custom-wrapper" })
            .AddChildContent("Content"));

        var classes = cut.Find("[data-slot='sidebar-wrapper']").GetAttribute("class");
        Assert.Contains("group/sidebar-wrapper", classes);
        Assert.Contains("custom-wrapper", classes);
    }

    [Fact]
    public void AccessibilityAndKeyboardMarkup_NotDirectlyOwnedByProvider()
    {
        var cut = Render<SidebarProviderComponent>(p => p.AddChildContent("Sidebar"));
        var root = cut.Find("[data-slot='sidebar-wrapper']");

        Assert.Null(root.GetAttribute("role"));
        Assert.Null(root.GetAttribute("aria-label"));
    }

    [Fact]
    public void MissingChildContent_RendersProviderShellWithoutBodyContent()
    {
        var cut = Render<SidebarProviderComponent>();
        Assert.NotNull(cut.Find("[data-slot='sidebar-wrapper']"));
    }
}
