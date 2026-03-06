using Bunit;

namespace RizzyUI.Tests.Components.Layout.RzItem;

public class RzItemSeparatorTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzItemSeparatorTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersSeparatorContractWithSlotAndOrientation()
    {
        var cut = Render<global::RizzyUI.RzItemSeparator>();

        var separator = cut.Find("[data-slot='item-separator']");
        Assert.Equal("separator", separator.GetAttribute("role"));
        Assert.Contains("my-0", separator.ClassList);
    }

    [Fact]
    public void SupportsCustomClasses()
    {
        var cut = Render<global::RizzyUI.RzItemSeparator>(p => p.AddUnmatched("class", "my-separator"));

        Assert.Contains("my-separator", cut.Find("[data-slot='item-separator']").ClassList);
    }
}
