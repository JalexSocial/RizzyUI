using Bunit;

using Microsoft.AspNetCore.Components;
using Provider = global::RizzyUI.RzColorPickerProvider;
using Trigger = global::RizzyUI.RzColorPickerTrigger;

namespace RizzyUI.Tests.Components.Form.RzColorPickerProvider;

public class RzColorPickerTriggerTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzColorPickerTriggerTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void DefaultRender_UsesTriggerSlotAndKeyboardOpeningContract()
    {
        var cut = Render<Provider>(p => p.AddChildContent<Trigger>(t => t.AddChildContent("Pick")));
        var trigger = cut.Find("[data-slot='color-picker-trigger']");

        Assert.Equal("div", trigger.TagName.ToLowerInvariant());
        Assert.Equal("button", trigger.GetAttribute("role"));
        Assert.Equal("0", trigger.GetAttribute("tabindex"));
        Assert.Equal("colorPicker.open", trigger.GetAttribute("x-on:click"));
        Assert.Equal("colorPicker.open", trigger.GetAttribute("x-on:keydown.enter.prevent"));
        Assert.Equal("colorPicker.open", trigger.GetAttribute("x-on:keydown.space.prevent"));
    }

    [Fact]
    public void DisabledTrigger_RemovesOpenHandlersAndSetsAriaDisabled()
    {
        var cut = Render<Provider>(p => p.AddChildContent<Trigger>(t => t
            .Add(x => x.Disabled, true)
            .AddChildContent("Disabled")));

        var trigger = cut.Find("[data-slot='color-picker-trigger']");
        Assert.Equal("-1", trigger.GetAttribute("tabindex"));
        Assert.Equal("true", trigger.GetAttribute("aria-disabled"));
        Assert.Null(trigger.GetAttribute("x-on:click"));
        Assert.Null(trigger.GetAttribute("x-on:keydown.enter.prevent"));
        Assert.Null(trigger.GetAttribute("x-on:keydown.space.prevent"));
    }

    [Fact]
    public void AsChild_MergesAttributesOntoChildElement()
    {
        var cut = Render<Provider>(p => p.AddChildContent<Trigger>(t => t
            .Add(x => x.AsChild, true)
            .Add(x => x.ChildContent, (RenderFragment)(b =>
            {
                b.OpenElement(0, "button");
                b.AddAttribute(1, "id", "child-btn");
                b.AddContent(2, "Pick child");
                b.CloseElement();
            }))));

        var child = cut.Find("#child-btn");
        Assert.Equal("button", child.GetAttribute("role"));
        Assert.Equal("color-picker-trigger", child.GetAttribute("data-slot"));
        Assert.Equal("colorPicker.open", child.GetAttribute("x-on:click"));
    }

    [Fact]
    public void TriggerOutsideProvider_ThrowsInvalidOperationException()
    {
        var ex = Assert.ThrowsAny<Exception>(() =>
            Render<Trigger>(p => p.AddChildContent("No provider")));

        Assert.Contains(nameof(Provider), ex.InnerException?.Message ?? ex.Message);
    }
}
