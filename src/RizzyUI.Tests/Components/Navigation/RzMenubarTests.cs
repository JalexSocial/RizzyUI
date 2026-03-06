using Bunit;

namespace RizzyUI.Tests.Components.Navigation;

public class RzMenubarTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzMenubarTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void RzMenubar_RendersRoleSlotAndAlpineHooks()
    {
        var cut = Render<RzMenubar>(p => p.AddChildContent("Menu"));

        var root = cut.Find("[data-slot='menubar']");
        Assert.Equal("menubar", root.GetAttribute("role"));
        Assert.Equal("rzMenubar", root.GetAttribute("x-data"));
        Assert.Equal(cut.Instance.Id, root.GetAttribute("data-alpine-root"));
    }

    [Fact]
    public void RzMenubar_MergesUserClassWithDefaultClasses()
    {
        var cut = Render<RzMenubar>(p => p
            .AddUnmatched("class", "custom-menubar")
            .AddChildContent("Menu"));

        var root = cut.Find("[data-slot='menubar']");
        Assert.Contains("custom-menubar", root.ClassList);
        Assert.Contains("flex", root.ClassList);
    }

    [Fact]
    public void RzMenubarContent_RendersPopupKeyboardMarkup()
    {
        var cut = Render<RzMenubar>(p => p
            .AddChildContent<MenubarMenu>(menu => menu
                .AddChildContent<MenubarTrigger>(t => t.AddChildContent("File"))
                .AddChildContent<MenubarContent>(c => c.AddChildContent("Item"))));

        Assert.Contains("data-slot=\"menubar-content\"", cut.Markup);
        Assert.Contains("role=\"menu\"", cut.Markup);
        Assert.Contains("tabindex=\"-1\"", cut.Markup);
        Assert.Contains("x-on:keydown=\"handleContentKeydown\"", cut.Markup);
    }
}
