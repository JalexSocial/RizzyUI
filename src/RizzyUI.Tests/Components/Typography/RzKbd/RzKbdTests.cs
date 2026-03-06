using Bunit;

namespace RizzyUI.Tests.Components.Typography.RzKbd;

public class RzKbdTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzKbdTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersAsKbdWithSlotAndDefaultClasses()
    {
        var cut = Render<global::RizzyUI.RzKbd>(p => p.AddChildContent("Ctrl"));

        var kbd = cut.Find("kbd[data-slot='kbd']");
        Assert.Contains("pointer-events-none", kbd.ClassList);
        Assert.Contains("Ctrl", kbd.TextContent);
    }

    [Fact]
    public void SupportsCustomElementAndClassMerging()
    {
        var cut = Render<global::RizzyUI.RzKbd>(p => p
            .Add(x => x.Element, "span")
            .AddUnmatched("class", "kbd-custom"));

        var kbd = cut.Find("span[data-slot='kbd']");
        Assert.Contains("kbd-custom", kbd.ClassList);
    }
}
