using Bunit;

namespace RizzyUI.Tests.Components.Typography.RzKbd;

public class RzKbdGroupTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzKbdGroupTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersKbdGroupSlotAndNestedKeys()
    {
        var cut = Render<global::RizzyUI.RzKbdGroup>(p => p
            .AddChildContent<global::RizzyUI.RzKbd>(kbd => kbd.AddChildContent("⌘"))
            .AddChildContent<global::RizzyUI.RzKbd>(kbd => kbd.AddChildContent("K")));

        var group = cut.Find("kbd[data-slot='kbd-group']");
        Assert.Contains("inline-flex", group.ClassList);
        Assert.Equal(2, cut.FindAll("[data-slot='kbd']").Count);
    }

    [Fact]
    public void MergesClassesAndAllowsEmptyContent()
    {
        var cut = Render<global::RizzyUI.RzKbdGroup>(p => p.AddUnmatched("class", "kbd-group-custom"));

        var group = cut.Find("[data-slot='kbd-group']");
        Assert.Contains("kbd-group-custom", group.ClassList);
        Assert.Equal(string.Empty, group.TextContent.Trim());
    }
}
