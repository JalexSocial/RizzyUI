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

    [Theory]
    [InlineData(null, false, "false")]
    [InlineData(null, true, "true")]
    [InlineData(true, false, "true")]
    [InlineData(false, true, "false")]
    public void RendersAriaPressedOnTheServer(bool? pressed, bool defaultPressed, string expected)
    {
        // The toggle is a button with a pressed state (APG toggle button). The state is in the
        // server-rendered markup, not only after Alpine starts.
        var cut = Render<global::RizzyUI.RzToggle>(p => p
            .Add(x => x.Pressed, pressed)
            .Add(x => x.DefaultPressed, defaultPressed)
            .AddChildContent("Bold"));

        var toggle = cut.Find("button[data-slot='toggle']");
        Assert.Equal("button", toggle.GetAttribute("type"));
        Assert.Equal(expected, toggle.GetAttribute("aria-pressed"));
        Assert.Equal("ariaPressed", toggle.GetAttribute("x-bind:aria-pressed"));
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
