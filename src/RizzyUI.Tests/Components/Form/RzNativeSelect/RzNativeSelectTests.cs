using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;

namespace RizzyUI.Tests.Components.Form.RzNativeSelect;

public class RzNativeSelectTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzNativeSelectTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersSelectWrapperSlotsAndChevronIcon()
    {
        var model = new SelectModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzNativeSelect<string>>(sp => sp
                .Add(p => p.For, () => model.Value)
                .AddChildContent<global::RizzyUI.RzNativeSelectOption>(op => op
                    .Add(o => o.Value, "one")
                    .AddChildContent("One"))));

        var wrapper = cut.Find("div[id$='-wrapper']");
        Assert.Contains("group/native-select", wrapper.ClassList);

        Assert.NotNull(cut.Find("select[data-slot='native-select']"));
        Assert.NotNull(cut.Find("svg[data-slot='native-select-icon']"));
    }

    [Fact]
    public void SelectMergesClassAndRendersWithoutOptions()
    {
        var model = new SelectModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzNativeSelect<string>>(sp => sp
                .Add(p => p.For, () => model.Value)
                .AddUnmatched("class", "custom-select")));

        var wrapper = cut.Find("div[id$='-wrapper']");
        Assert.Contains("custom-select", wrapper.ClassList);
        Assert.NotNull(cut.Find("select[data-slot='native-select']"));
    }

    [Fact]
    public void ThrowsOutsideEditForm()
    {
        var model = new SelectModel();
        Assert.Throws<InvalidOperationException>(() =>
            Render<global::RizzyUI.RzNativeSelect<string>>(p => p.Add(x => x.For, () => model.Value)));
    }

    private sealed class SelectModel
    {
        public string Value { get; set; } = "one";
    }
}
