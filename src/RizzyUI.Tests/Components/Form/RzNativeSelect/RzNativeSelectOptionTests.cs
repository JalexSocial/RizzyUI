using Bunit;

namespace RizzyUI.Tests.Components.Form.RzNativeSelect;

public class RzNativeSelectOptionTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzNativeSelectOptionTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersOptionDataSlotAndValue()
    {
        var cut = Render<global::RizzyUI.RzNativeSelectOption>(p => p
            .Add(x => x.Value, "alpha")
            .AddChildContent("Alpha"));

        var option = cut.Find("option[data-slot='native-select-option']");
        Assert.Equal("alpha", option.GetAttribute("value"));
        Assert.Equal("Alpha", option.TextContent.Trim());
    }

    [Fact]
    public void RendersSafelyWithoutValue()
    {
        var cut = Render<global::RizzyUI.RzNativeSelectOption>(p => p.AddChildContent("No value"));
        Assert.Null(cut.Find("option[data-slot='native-select-option']").GetAttribute("value"));
    }
}
