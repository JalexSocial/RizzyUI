using Bunit;

namespace RizzyUI.Tests.Components.Form.RzColorPickerProvider;

public class RzColorPickerProviderTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzColorPickerProviderTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersProviderSlotAlpineRootAndSerializedConfig()
    {
        var cut = Render<global::RizzyUI.RzColorPickerProvider>(p => p
            .Add(x => x.Id, "picker-provider")
            .Add(x => x.Value, "#ff0000")
            .Add(x => x.Format, ColorFormat.Hsl)
            .Add(x => x.Alpha, true)
            .Add(x => x.SwatchesOnly, true)
            .Add(x => x.Swatches, new[] { "#ff0000", "#00ff00" }));

        var provider = cut.Find("[data-slot='color-picker-provider']");
        Assert.NotNull(provider);

        var alpineRoot = cut.Find("[data-alpine-root='picker-provider']");
        Assert.Equal("rzColorPickerProvider", alpineRoot.GetAttribute("x-data"));
        Assert.Contains("\"format\":\"hsl\"", alpineRoot.GetAttribute("data-config"));
        Assert.Equal("#ff0000", alpineRoot.GetAttribute("data-initial-value"));
    }

    [Fact]
    public void RendersHiddenInputForKeyboardAndPostingSupport()
    {
        var cut = Render<global::RizzyUI.RzColorPickerProvider>(p => p.Add(x => x.Id, "picker-provider"));

        var hiddenInput = cut.Find("input[id='picker-provider-picker-input']");
        Assert.Equal("-1", hiddenInput.GetAttribute("tabindex"));
        Assert.Equal("true", hiddenInput.GetAttribute("aria-hidden"));
        Assert.Equal("input", hiddenInput.GetAttribute("x-ref"));
    }
}
