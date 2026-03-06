using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;

namespace RizzyUI.Tests.Components.Form.RzRadioGroup;

public class RzRadioGroupTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzRadioGroupTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersRadiogroupWithLegendAndRadioItems()
    {
        var model = new RadioModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzRadioGroup<string>>(gp => gp
                .Add(p => p.For, () => model.Value)
                .Add(p => p.DisplayName, "Plan")
                .AddChildContent<global::RizzyUI.RadioGroupItem<string>>(ip => ip
                    .Add(p => p.Value, "pro")
                    .AddChildContent("Pro"))));

        var group = cut.Find("fieldset[data-slot='radio-group']");
        Assert.Equal("radiogroup", group.GetAttribute("role"));
        Assert.Contains("grid", group.ClassList);

        var item = cut.Find("label[data-slot='radio-group-item']");
        Assert.Null(item.GetAttribute("aria-disabled"));
        Assert.NotNull(cut.Find("input[type='radio'][data-slot='input']"));
    }

    [Fact]
    public void HorizontalOrientationAndDisabledItemMarkupRenderCorrectly()
    {
        var model = new RadioModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzRadioGroup<string>>(gp => gp
                .Add(p => p.For, () => model.Value)
                .Add(p => p.Orientation, Orientation.Horizontal)
                .AddChildContent<global::RizzyUI.RadioGroupItem<string>>(ip => ip
                    .Add(p => p.Value, "pro")
                    .Add(p => p.Disabled, true))));

        var group = cut.Find("fieldset[data-slot='radio-group']");
        Assert.Contains("flex", group.ClassList);

        var item = cut.Find("label[data-slot='radio-group-item']");
        Assert.NotNull(item.GetAttribute("aria-disabled"));
    }

    [Fact]
    public void ThrowsOutsideEditForm()
    {
        var model = new RadioModel();
        Assert.Throws<InvalidOperationException>(() =>
            Render<global::RizzyUI.RzRadioGroup<string>>(p => p.Add(x => x.For, () => model.Value)));
    }

    private sealed class RadioModel
    {
        public string Value { get; set; } = "pro";
    }
}
