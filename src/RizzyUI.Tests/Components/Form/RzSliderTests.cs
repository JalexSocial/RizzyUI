using Bunit;

namespace RizzyUI.Tests.Components.Form;

public class RzSliderTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzSliderTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void RzSlider_RendersRequiredSlotsAndAlpineContract()
    {
        var cut = Render<RzSlider>(p => p.Add(x => x.Name, "price"));

        var root = cut.Find("[data-slot='slider']");
        Assert.Equal("horizontal", root.GetAttribute("data-orientation"));

        var alpine = cut.Find("[x-data='rzSlider']");
        Assert.Equal(cut.Instance.Id, alpine.GetAttribute("data-alpine-root"));
        Assert.Equal("handlePointerMove", alpine.GetAttribute("x-on:pointermove.window"));

        Assert.NotNull(cut.Find("[data-slot='slider-track']"));
        Assert.NotNull(cut.Find("[data-slot='slider-range']"));
        Assert.NotNull(cut.Find("[data-slot='slider-thumb']"));
        Assert.NotNull(cut.Find("[data-slot='slider-input']"));
    }

    [Fact]
    public void RzSlider_RendersKeyboardAndAriaMarkup()
    {
        var cut = Render<RzSlider>(p => p
            .Add(x => x.Min, 10)
            .Add(x => x.Max, 50)
            .Add(x => x.Value, new[] { 20d })
            .Add(x => x.TabIndex, 3)
            .Add(x => x.AriaLabelledBy, "price-label")
            .Add(x => x.AriaDescribedBy, "price-help"));

        var thumb = cut.Find("[data-slot='slider-thumb']");
        Assert.Equal("slider", thumb.GetAttribute("role"));
        Assert.Equal("3", thumb.GetAttribute("tabindex"));
        Assert.Equal("10", thumb.GetAttribute("aria-valuemin"));
        Assert.Equal("50", thumb.GetAttribute("aria-valuemax"));
        Assert.Equal("20", thumb.GetAttribute("aria-valuenow"));
        Assert.Equal("price-label", thumb.GetAttribute("aria-labelledby"));
        Assert.Equal("price-help", thumb.GetAttribute("aria-describedby"));
    }

    [Fact]
    public void RzSlider_DisabledAndIndexedNameStates_RenderSafely()
    {
        var cut = Render<RzSlider>(p => p
            .Add(x => x.Disabled, true)
            .Add(x => x.Value, new[] { 25d, 60d })
            .Add(x => x.MinStepsBetweenThumbs, 10)
            .Add(x => x.Name, "volume")
            .Add(x => x.UseIndexedNames, false)
            .AddUnmatched("class", "custom-class"));

        var root = cut.Find("[data-slot='slider']");
        Assert.Contains("custom-class", root.ClassList);

        var thumbs = cut.FindAll("[data-slot='slider-thumb']");
        Assert.All(thumbs, t =>
        {
            Assert.Equal("-1", t.GetAttribute("tabindex"));
            Assert.Equal("true", t.GetAttribute("aria-disabled"));
        });

        var inputs = cut.FindAll("input[data-slider-input='true']");
        Assert.All(inputs, i => Assert.Equal("volume", i.GetAttribute("name")));
    }
}
