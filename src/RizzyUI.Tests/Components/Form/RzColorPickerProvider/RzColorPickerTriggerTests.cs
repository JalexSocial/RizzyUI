using Bunit;

namespace RizzyUI.Tests.Components.Form.RzColorPickerProvider;

public class RzColorPickerTriggerTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzColorPickerTriggerTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersButtonLikeSemanticsAndKeyboardHooksInsideProvider()
    {
        var cut = Render<global::RizzyUI.RzColorPickerProvider>(p => p
            .AddChildContent<global::RizzyUI.RzColorPickerTrigger>(tp => tp.AddChildContent("Pick")));

        var trigger = cut.Find("[data-slot='color-picker-trigger']");
        Assert.Equal("button", trigger.GetAttribute("role"));
        Assert.Equal("0", trigger.GetAttribute("tabindex"));
        Assert.Equal("colorPicker.open", trigger.GetAttribute("x-on:click"));
        Assert.Equal("colorPicker.open", trigger.GetAttribute("x-on:keydown.enter.prevent"));
    }

    [Fact]
    public void DisabledTriggerRemovesOpenHooks()
    {
        var cut = Render<global::RizzyUI.RzColorPickerProvider>(p => p
            .AddChildContent<global::RizzyUI.RzColorPickerTrigger>(tp => tp
                .Add(x => x.Disabled, true)
                .AddChildContent("Pick")));

        var trigger = cut.Find("[data-slot='color-picker-trigger']");
        Assert.Equal("-1", trigger.GetAttribute("tabindex"));
        Assert.Equal("true", trigger.GetAttribute("aria-disabled"));
        Assert.Null(trigger.GetAttribute("x-on:click"));
    }

    [Fact]
    public void ThrowsWhenRenderedWithoutProvider()
    {
        Assert.Throws<InvalidOperationException>(() =>
            Render<global::RizzyUI.RzColorPickerTrigger>(p => p.AddChildContent("Pick")));
    }
}
