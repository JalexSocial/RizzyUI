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
        // RZUI-032: CSP-safe bindings; x-model would compile to a property assignment.
        Assert.False(input.HasAttribute("x-model"));
        Assert.Equal("colorPicker.value", input.GetAttribute("x-bind:value"));
        Assert.Equal("setValueFromInput", input.GetAttribute("x-on:input"));
        Assert.Equal("Pick a color", input.GetAttribute("placeholder"));

        // The input passes its thumbnail slot name to the swatch it renders (data-slot is caller-overridable).
        var swatchHost = cut.Find("[data-slot='thumbnail'] [x-data='rzColorSwatch']");
        Assert.Equal("setValue(colorPicker.value)", swatchHost.GetAttribute("x-effect"));
        Assert.Empty(cut.FindAll("[x-model]"));
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
