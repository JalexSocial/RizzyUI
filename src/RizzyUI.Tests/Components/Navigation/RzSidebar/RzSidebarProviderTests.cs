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
            .Add(x => x.AdditionalAttributes, new Dictionary<string, object> { ["class"] = "custom-wrapper" })
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

    [Fact]
    public void SidebarTrigger_ExposesAccessibleStateAndControlsProvider()
    {
        var cut = Render<SidebarProviderComponent>(p => p
            .Add(x => x.Id, "sidebar-provider-test")
            .AddChildContent<SidebarTrigger>());

        var trigger = cut.Find("[data-slot='sidebar-trigger']");

        Assert.Equal("button", trigger.GetAttribute("type"));
        Assert.Equal("toggle", trigger.GetAttribute("x-on:click"));
        Assert.Equal("sidebar-provider-test", trigger.GetAttribute("aria-controls"));
        Assert.Equal("triggerExpanded", trigger.GetAttribute("x-bind:aria-expanded"));
        Assert.False(string.IsNullOrWhiteSpace(trigger.GetAttribute("aria-label")));
    }

    [Fact]
    public void SidebarMobileSheet_PreservesModalFocusAndDismissMarkup()
    {
        var cut = Render<SidebarProviderComponent>(p => p
            .AddChildContent<Sidebar>(sidebar => sidebar.AddChildContent("Mobile navigation")));

        var template = cut.Find("template").OuterHtml;

        Assert.Contains("x-syncprop=\"openMobile -> open\"", cut.Markup);
        Assert.Contains("x-bind:open=\"openMobile\"", cut.Markup);
        Assert.Contains("x-on:close=\"close\"", cut.Markup);
        Assert.Contains("data-sidebar=\"sidebar\"", template);
        Assert.Contains("data-mobile=\"true\"", template);
        Assert.Contains("x-bind:role=\"modal ? 'dialog' : 'complementary'\"", template);
        Assert.Contains("x-bind:aria-modal=\"modal ? 'true' : null\"", template);
        Assert.Contains("tabindex=\"-1\"", template);
    }

    [Fact]
    public void SidebarDesktopMarkup_PreservesStateAndCollapsibleStylingHooks()
    {
        var cut = Render<SidebarProviderComponent>(p => p
            .AddChildContent<Sidebar>(sidebar => sidebar.AddChildContent("Desktop navigation")));

        var root = cut.Find("[data-slot='sidebar']");

        Assert.Equal("state", root.GetAttribute("x-bind:data-state"));
        Assert.Equal("getCollapsibleAttribute", root.GetAttribute("x-bind:data-collapsible"));
        Assert.NotNull(cut.Find("[data-slot='sidebar-gap']"));
        Assert.NotNull(cut.Find("[data-slot='sidebar-container']"));
        Assert.NotNull(cut.Find("[data-slot='sidebar-inner']"));
    }

    [Fact]
    public void SidebarMenuButton_ActiveNavigationItemAddsAriaCurrentWhenNotProvided()
    {
        var cut = Render<SidebarMenuButton>(p => p
            .Add(x => x.IsActive, true)
            .AddChildContent("Current page"));

        var button = cut.Find("[data-slot='sidebar-menu-button']");

        Assert.Equal("true", button.GetAttribute("data-active"));
        Assert.Equal("page", button.GetAttribute("aria-current"));
    }

    [Fact]
    public void SidebarMenuButton_PreservesConsumerAriaCurrentValue()
    {
        var cut = Render<SidebarMenuButton>(p => p
            .Add(x => x.IsActive, true)
            .Add(x => x.AdditionalAttributes, new Dictionary<string, object> { ["aria-current"] = "step" })
            .AddChildContent("Current step"));

        Assert.Equal("step", cut.Find("[data-slot='sidebar-menu-button']").GetAttribute("aria-current"));
    }

    [Fact]
    public void SidebarDocumentation_CoversAccessibilityKeyboardFocusAndRuntimeContracts()
    {
        var docsPath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "../../../../RizzyUI.Docs/Components/Pages/Components/SidebarInfo.razor"));
        var docs = File.ReadAllText(docsPath);

        Assert.Contains("Accessibility", docs);
        Assert.Contains("Ctrl</kbd>/<kbd>Cmd</kbd> +", docs);
        Assert.Contains("aria-expanded", docs);
        Assert.Contains("aria-controls", docs);
        Assert.Contains("focus", docs, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("Escape", docs);
        Assert.Contains("SSR", docs);
        Assert.Contains("CSP", docs);
        Assert.Contains("rz:sidebar:state-change", docs);
    }

}
