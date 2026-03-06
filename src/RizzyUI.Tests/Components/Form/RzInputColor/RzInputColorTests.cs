using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;

namespace RizzyUI.Tests.Components.Form.RzInputColor;

public class RzInputColorTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzInputColorTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersCompositeColorInputSlotsAndAlpineBindings()
    {
        var model = new ColorModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzInputColor>(cp => cp
                .Add(p => p.For, () => model.Color)
                .Add(p => p.Value, "#112233")
                .Add(p => p.Placeholder, "Pick a color")));

        Assert.NotNull(cut.Find("[data-slot='input-color']"));
        Assert.NotNull(cut.Find("[data-slot='input-group']"));

        var input = cut.Find("input[data-slot='input']");
        Assert.Equal("colorPicker.value", input.GetAttribute("x-model"));
        Assert.Equal("Pick a color", input.GetAttribute("placeholder"));

        var swatchModelHost = cut.Find("[data-slot='color-swatch'] [x-model='colorPicker.value']");
        Assert.NotNull(swatchModelHost);
    }

    [Fact]
    public void SupportsThumbnailPositionAndProviderDataAttributes()
    {
        var model = new ColorModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzInputColor>(cp => cp
                .Add(p => p.For, () => model.Color)
                .Add(p => p.ThumbnailPosition, ColorThumbnailPosition.End)
                .Add(p => p.Format, ColorFormat.Rgb)
                .Add(p => p.Alpha, true)));

        var provider = cut.Find("[data-slot='color-picker-provider'] [x-data='rzColorPickerProvider']");
        Assert.Contains("\"format\":\"rgb\"", provider.GetAttribute("data-config"));
    }

    [Fact]
    public void ThrowsOutsideEditForm()
    {
        var model = new ColorModel();
        Assert.Throws<InvalidOperationException>(() =>
            Render<global::RizzyUI.RzInputColor>(p => p.Add(x => x.For, () => model.Color)));
    }

    private sealed class ColorModel
    {
        public string Color { get; set; } = "#000000";
    }
}
