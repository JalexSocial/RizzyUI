using Bunit;

namespace RizzyUI.Tests.Components.Form.RzToggle;

public class RzToggleTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzToggleTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersButtonWithAlpineHooksAndSlot()
    {
        var cut = Render<global::RizzyUI.RzToggle>(p => p
            .Add(x => x.Id, "toggle-1")
            .AddChildContent("Toggle"));

        var toggle = cut.Find("button[data-slot='toggle']");
        Assert.Equal("rzToggle", toggle.GetAttribute("x-data"));
        Assert.Equal("toggle", toggle.GetAttribute("x-on:click"));
        Assert.Equal("toggle-1", toggle.GetAttribute("data-alpine-root"));
        Assert.Equal("false", toggle.GetAttribute("data-default-pressed"));
    }

    [Fact]
    public void ControlledPressedDisabledAndClassMergingRenderAsExpected()
    {
        var cut = Render<global::RizzyUI.RzToggle>(p => p
            .Add(x => x.Pressed, true)
            .Add(x => x.DefaultPressed, true)
            .Add(x => x.Disabled, true)
            .AddUnmatched("class", "custom-toggle"));

        var toggle = cut.Find("button[data-slot='toggle']");
        Assert.Equal("true", toggle.GetAttribute("data-pressed"));
        Assert.Equal("true", toggle.GetAttribute("data-disabled"));
        Assert.NotNull(toggle.GetAttribute("disabled"));
        Assert.Contains("custom-toggle", toggle.ClassList);
    }

    [Fact]
    public void SsROnlyContract_HasNoBlazorEventAttributes()
    {
        var cut = Render<global::RizzyUI.RzToggle>();
        var toggle = cut.Find("button[data-slot='toggle']");
        Assert.Null(toggle.GetAttribute("@onclick"));
        Assert.Null(toggle.GetAttribute("blazor:on*"));
    }
}
