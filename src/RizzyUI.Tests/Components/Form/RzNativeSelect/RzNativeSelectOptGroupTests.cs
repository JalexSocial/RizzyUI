using Bunit;

namespace RizzyUI.Tests.Components.Form.RzNativeSelect;

public class RzNativeSelectOptGroupTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzNativeSelectOptGroupTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersOptGroupDataSlotAndLabel()
    {
        var cut = Render<global::RizzyUI.RzNativeSelectOptGroup>(p => p
            .Add(x => x.Label, "Popular")
            .AddChildContent("content"));

        var group = cut.Find("optgroup[data-slot='native-select-optgroup']");
        Assert.Equal("Popular", group.GetAttribute("label"));
    }

    [Fact]
    public void RendersSafelyWithoutLabel()
    {
        var cut = Render<global::RizzyUI.RzNativeSelectOptGroup>();
        var group = cut.Find("optgroup[data-slot='native-select-optgroup']");
        Assert.Null(group.GetAttribute("label"));
    }
}
