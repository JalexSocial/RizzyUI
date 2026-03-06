using Bunit;
using Microsoft.AspNetCore.Components;
using Provider = global::RizzyUI.RzColorPickerProvider;
using Trigger = global::RizzyUI.RzColorPickerTrigger;

namespace RizzyUI.Tests.Components.Form.RzColorPickerProvider;

public class RzColorPickerProviderTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzColorPickerProviderTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void DefaultRender_EmitsProviderSlotsAndAlpineContract()
    {
        var cut = Render<Provider>();
        var root = cut.Find("[data-slot='color-picker-provider']");
        var alpineRoot = cut.Find("[data-alpine-root]");

        Assert.Equal("contents", root.GetAttribute("class"));
        Assert.Equal(root.Id, alpineRoot.GetAttribute("data-alpine-root"));
        Assert.Equal("rzColorPickerProvider", alpineRoot.GetAttribute("x-data"));
        Assert.Equal("[]", alpineRoot.GetAttribute("data-assets"));
        Assert.Contains("\"format\":\"hex\"", alpineRoot.GetAttribute("data-config")!);

        var hiddenInput = cut.Find("input[type='text']");
        Assert.Equal("input", hiddenInput.GetAttribute("x-ref"));
        Assert.Equal("-1", hiddenInput.GetAttribute("tabindex"));
        Assert.Equal("true", hiddenInput.GetAttribute("aria-hidden"));
    }

    [Fact]
    public void ParameterCombinations_SerializeConfigAndAssets()
    {
        var cut = Render<Provider>(p => p
            .Add(x => x.Value, "#112233")
            .Add(x => x.Format, ColorFormat.Hsl)
            .Add(x => x.Alpha, true)
            .Add(x => x.SwatchesOnly, true)
            .Add(x => x.CloseButton, true)
            .Add(x => x.ClearButton, true)
            .Add(x => x.Swatches, new[] { "#fff", "#000" })
            .Add(x => x.ComponentAssetKeys, new[] { "Coloris", "MissingAssetKey" }));

        var alpineRoot = cut.Find("[data-alpine-root]");
        var config = alpineRoot.GetAttribute("data-config")!;

        Assert.Equal("#112233", alpineRoot.GetAttribute("data-initial-value"));
        Assert.Contains("\"format\":\"hsl\"", config);
        Assert.Contains("\"alpha\":true", config);
        Assert.Contains("\"swatchesOnly\":true", config);
        Assert.Contains("\"closeButton\":true", config);
        Assert.Contains("\"clearButton\":true", config);
        Assert.Contains("\"swatches\":[\"#fff\",\"#000\"]", config);
        Assert.Equal("[]", alpineRoot.GetAttribute("data-assets"));
    }

    [Fact]
    public void MissingChildContent_IsSafeAndRendersSsrMarkupOnly()
    {
        var cut = Render<Provider>();
        Assert.Empty(cut.FindAll("script"));
        Assert.Empty(cut.FindAll("button"));
        Assert.NotNull(cut.Find("[data-slot='color-picker-provider']"));
    }

    [Fact]
    public void AccessibilityAndKeyboardMarkup_NotOwnedByProviderContract()
    {
        var cut = Render<Provider>();
        var root = cut.Find("[data-slot='color-picker-provider']");

        Assert.Null(root.GetAttribute("role"));
        Assert.Null(root.GetAttribute("aria-label"));
    }

    [Fact]
    public void TriggerChildContent_RendersInsideCascadingScope()
    {
        var cut = Render<Provider>(p => p.AddChildContent<Trigger>(t => t.AddChildContent("Pick")));

        var trigger = cut.Find("[data-slot='color-picker-trigger']");
        Assert.Equal("button", trigger.GetAttribute("role"));
        Assert.Equal("colorPicker.open", trigger.GetAttribute("x-on:click"));
        Assert.Equal("0", trigger.GetAttribute("tabindex"));
    }
}
