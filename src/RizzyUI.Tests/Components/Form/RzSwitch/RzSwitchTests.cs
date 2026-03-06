using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;

namespace RizzyUI.Tests.Components.Form.RzSwitch;

public class RzSwitchTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzSwitchTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersSwitchRoleInputTrackAndThumbSlots()
    {
        var model = new SwitchModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzSwitch>(sp => sp
                .Add(p => p.For, () => model.Enabled)
                .Add(p => p.Value, true)));

        var wrapper = cut.Find("div[id$='-wrapper']");
        Assert.Contains("inline-flex", wrapper.ClassList);

        var input = cut.Find("input[type='checkbox']");
        Assert.Equal("switch", input.GetAttribute("role"));
        Assert.False(string.IsNullOrWhiteSpace(input.GetAttribute("aria-label")));

        Assert.NotNull(cut.Find("label"));
        Assert.NotNull(cut.Find("label > span"));
    }

    [Fact]
    public void MergesUserClassOnWrapper()
    {
        var model = new SwitchModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzSwitch>(sp => sp
                .Add(p => p.For, () => model.Enabled)
                .AddUnmatched("class", "custom-switch")));

        Assert.Contains("custom-switch", cut.Find("div[id$='-wrapper']").ClassList);
    }

    [Fact]
    public void ThrowsOutsideEditForm()
    {
        var model = new SwitchModel();
        Assert.Throws<InvalidOperationException>(() =>
            Render<global::RizzyUI.RzSwitch>(p => p.Add(x => x.For, () => model.Enabled)));
    }

    private sealed class SwitchModel
    {
        public bool Enabled { get; set; }
    }
}
