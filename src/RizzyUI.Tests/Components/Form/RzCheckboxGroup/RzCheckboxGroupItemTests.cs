using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;

namespace RizzyUI.Tests.Components.Form.RzCheckboxGroup;

public class RzCheckboxGroupItemTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzCheckboxGroupItemTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersInputSlotsAndCheckedStateFromParentGroup()
    {
        var model = new CheckboxModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzCheckboxGroup<string>>(gp => gp
                .Add(p => p.For, () => model.Selected)
                .AddChildContent<global::RizzyUI.RzCheckboxGroupItem<string>>(ip => ip
                    .Add(p => p.Value, "red")
                    .AddChildContent("Red"))));

        var item = cut.Find("label[data-slot='checkbox-group-item']");
        Assert.Null(item.GetAttribute("aria-disabled"));

        var input = cut.Find("input[data-slot='input']");
        Assert.Equal("checkbox", input.GetAttribute("type"));
        Assert.Equal("red", input.GetAttribute("value"));
        Assert.NotNull(input.GetAttribute("checked"));
    }

    [Fact]
    public void DisabledItemHasDisabledMarkupAndClass()
    {
        var model = new CheckboxModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzCheckboxGroup<string>>(gp => gp
                .Add(p => p.For, () => model.Selected)
                .AddChildContent<global::RizzyUI.RzCheckboxGroupItem<string>>(ip => ip
                    .Add(p => p.Value, "blue")
                    .Add(p => p.Disabled, true))));

        var item = cut.Find("label[data-slot='checkbox-group-item']");
        Assert.NotNull(item.GetAttribute("aria-disabled"));
        Assert.Contains("cursor-not-allowed", item.ClassList);

        var input = cut.Find("input[data-slot='input']");
        Assert.NotNull(input.GetAttribute("disabled"));
    }

    [Fact]
    public void ThrowsWhenRenderedWithoutCheckboxGroup()
    {
        Assert.Throws<InvalidOperationException>(() => Render<global::RizzyUI.RzCheckboxGroupItem<string>>());
    }

    private sealed class CheckboxModel
    {
        public IList<string> Selected { get; set; } = ["red"];
    }
}
