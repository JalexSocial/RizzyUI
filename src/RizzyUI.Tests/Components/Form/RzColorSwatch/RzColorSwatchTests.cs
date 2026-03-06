using Bunit;
using SwatchComponent = global::RizzyUI.RzColorSwatch;

namespace RizzyUI.Tests.Components.Form.RzColorSwatch;

public class RzColorSwatchTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzColorSwatchTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void DefaultRender_EmitsSlotsAriaAndAlpineBindings()
    {
        var cut = Render<SwatchComponent>();
        var root = cut.Find("[data-slot='color-swatch']");
        var alpineRoot = cut.Find("[data-alpine-root]");
        var swatch = cut.Find("[data-slot='swatch']");

        Assert.Equal("img", root.GetAttribute("role"));
        Assert.False(string.IsNullOrWhiteSpace(root.GetAttribute("aria-label")));
        Assert.Equal(root.Id, alpineRoot.GetAttribute("data-alpine-root"));
        Assert.Equal("rzColorSwatch", alpineRoot.GetAttribute("x-data"));
        Assert.Equal("value", alpineRoot.GetAttribute("x-modelable"));
        Assert.Equal("[]", alpineRoot.GetAttribute("data-assets"));
        Assert.Equal("swatchStyle", swatch.GetAttribute("x-bind:style"));
    }

    [Fact]
    public void ParameterCombinations_UpdateClassesAndDataAttributes()
    {
        var cut = Render<SwatchComponent>(p => p
            .Add(x => x.Value, "#336699")
            .Add(x => x.Size, ColorSwatchSize.Large)
            .Add(x => x.WithoutTransparency, true)
            .Add(x => x.Disabled, true)
            .Add(x => x.AriaLabel, "Current color"));

        var root = cut.Find("[data-slot='color-swatch']");
        var alpineRoot = cut.Find("[data-alpine-root]");
        var swatch = cut.Find("[data-slot='swatch']");

        Assert.Equal("Current color", root.GetAttribute("aria-label"));
        Assert.Equal("true", root.GetAttribute("aria-disabled"));
        Assert.Equal("#336699", alpineRoot.GetAttribute("data-value"));
        Assert.Equal("true", alpineRoot.GetAttribute("data-without-transparency"));
        Assert.Equal("true", alpineRoot.GetAttribute("data-disabled"));
        Assert.Contains("size-12", swatch.GetAttribute("class"));
        Assert.Contains("opacity-50", swatch.GetAttribute("class"));
    }

    [Fact]
    public void AdditionalAttributes_SplitsRootAttributesFromXModel()
    {
        var cut = Render<SwatchComponent>(p => p.Add(x => x.AdditionalAttributes, new Dictionary<string, object?>
        {
            ["x-model"] = "form.color",
            ["data-test-id"] = "swatch-1"
        }));

        var root = cut.Find("[data-slot='color-swatch']");
        var alpineRoot = cut.Find("[data-alpine-root]");

        Assert.Equal("swatch-1", root.GetAttribute("data-test-id"));
        Assert.Null(root.GetAttribute("x-model"));
        Assert.Equal("form.color", alpineRoot.GetAttribute("x-model"));
    }

    [Fact]
    public void SsrOnlyContract_DoesNotRequireBlazorEventHandlers()
    {
        var cut = Render<SwatchComponent>();
        var html = cut.Markup;

        Assert.DoesNotContain("@on", html, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("blazor", html, StringComparison.OrdinalIgnoreCase);
    }
}
