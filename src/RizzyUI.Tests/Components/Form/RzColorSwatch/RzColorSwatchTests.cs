using Bunit;

namespace RizzyUI.Tests.Components.Form.RzColorSwatch;

public class RzColorSwatchTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzColorSwatchTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersSwatchDataSlotsAriaAndAlpineBindings()
    {
        var cut = Render<global::RizzyUI.RzColorSwatch>(p => p
            .Add(x => x.Id, "swatch-1")
            .Add(x => x.Value, "#ffffff")
            .Add(x => x.WithoutTransparency, true));

        var root = cut.Find("[data-slot='color-swatch']");
        Assert.Equal("img", root.GetAttribute("role"));
        Assert.False(string.IsNullOrWhiteSpace(root.GetAttribute("aria-label")));

        var alpine = cut.Find("[data-alpine-root='swatch-1']");
        Assert.Equal("rzColorSwatch", alpine.GetAttribute("x-data"));
        Assert.Equal("value", alpine.GetAttribute("x-modelable"));
        Assert.Equal("true", alpine.GetAttribute("data-without-transparency"));

        Assert.NotNull(cut.Find("[data-slot='swatch']"));
    }

    [Fact]
    public void DisabledAndModelBindingAttributesRenderSafely()
    {
        var cut = Render<global::RizzyUI.RzColorSwatch>(p => p
            .Add(x => x.Disabled, true)
            .AddUnmatched("x-model", "colorPicker.value"));

        var root = cut.Find("[data-slot='color-swatch']");
        Assert.Equal("true", root.GetAttribute("aria-disabled"));

        var alpine = cut.Find("[x-data='rzColorSwatch']");
        Assert.Equal("true", alpine.GetAttribute("data-disabled"));
        Assert.Equal("colorPicker.value", alpine.GetAttribute("x-model"));
    }
}
