using Bunit;

namespace RizzyUI.Tests.Components.Navigation;

public class RzSidebarProviderTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzSidebarProviderTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void RzSidebarProvider_RendersSlotAndAlpineProviderAttributes()
    {
        var cut = Render<RzSidebarProvider>(p => p.AddChildContent("Body"));

        var root = cut.Find("[data-slot='sidebar-wrapper']");
        Assert.Equal("rzSidebar", root.GetAttribute("x-data"));
        Assert.Equal(cut.Instance.Id, root.GetAttribute("data-alpine-root"));
        Assert.Equal("offcanvas", root.GetAttribute("data-collapsible"));
        Assert.Equal("768", root.GetAttribute("data-mobile-breakpoint"));
    }

    [Fact]
    public void RzSidebarProvider_RendersConfigurableStateAndKeyboardSettings()
    {
        var cut = Render<RzSidebarProvider>(p => p
            .Add(x => x.DefaultOpen, false)
            .Add(x => x.KeyboardShortcut, "k")
            .Add(x => x.PersistenceCookieName, "my_sidebar")
            .Add(x => x.Collapsible, SidebarCollapsible.Icon)
            .AddChildContent("Body"));

        var root = cut.Find("[data-slot='sidebar-wrapper']");
        Assert.Equal("false", root.GetAttribute("data-default-open"));
        Assert.Equal("k", root.GetAttribute("data-shortcut"));
        Assert.Equal("my_sidebar", root.GetAttribute("data-cookie-name"));
        Assert.Equal("icon", root.GetAttribute("data-collapsible"));
    }

    [Theory]
    [InlineData("false", true, "false")]
    [InlineData("true", false, "true")]
    [InlineData("not-a-bool", false, "false")]
    public void RzSidebarProvider_RendersThePersistedStateFromTheRequestCookie(string cookie, bool defaultOpen, string expected)
    {
        // Summit SF-010: the server renders the state the browser persisted, so a collapsed sidebar does not flash open.
        var context = new Microsoft.AspNetCore.Http.DefaultHttpContext();
        context.Request.Headers.Cookie = $"sidebar_state={cookie}";
        var cut = Render<Microsoft.AspNetCore.Components.CascadingValue<Microsoft.AspNetCore.Http.HttpContext>>(p => p
            .Add(x => x.Value, context)
            .AddChildContent<RzSidebarProvider>(s => s.Add(x => x.DefaultOpen, defaultOpen).AddChildContent("Body")));

        Assert.Equal(expected, cut.Find("[data-slot='sidebar-wrapper']").GetAttribute("data-default-open"));
    }

    [Fact]
    public void RzSidebarProvider_InlineCssVariablesReflectWidths()
    {
        var cut = Render<RzSidebarProvider>(p => p
            .Add(x => x.Width, "20rem")
            .Add(x => x.MobileWidth, "22rem")
            .Add(x => x.IconWidth, "4rem")
            .AddChildContent("Body"));

        var style = cut.Find("style").TextContent;
        Assert.Contains("--sidebar-width: 20rem", style);
        Assert.Contains("--sidebar-mobile-width: 22rem", style);
        Assert.Contains("--sidebar-width-icon: 4rem", style);
    }

    [Fact]
    public void RzSidebarProvider_AccessibilityRoleNotApplicable_DocumentingContract()
    {
        var cut = Render<RzSidebarProvider>(p => p.AddChildContent("Body"));
        Assert.Null(cut.Find("[data-slot='sidebar-wrapper']").GetAttribute("role")); // Provider wrapper defers semantics to child layout regions.
    }
}
