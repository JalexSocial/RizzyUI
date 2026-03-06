using Bunit;

namespace RizzyUI.Tests.Components.Layout.RzItem;

public class RzItemGroupTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzItemGroupTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersListRoleAndRootSlot()
    {
        var cut = Render<global::RizzyUI.RzItemGroup>(p => p.AddChildContent("Items"));

        var group = cut.Find("[data-slot='item-group']");
        Assert.Equal("list", group.GetAttribute("role"));
        Assert.Contains("group/item-group", group.ClassList);
    }

    [Fact]
    public void MergesAdditionalClassesWithDefaults()
    {
        var cut = Render<global::RizzyUI.RzItemGroup>(p => p.AddUnmatched("class", "my-group"));

        var group = cut.Find("[data-slot='item-group']");
        Assert.Contains("my-group", group.ClassList);
        Assert.Contains("flex-col", group.ClassList);
    }
}
