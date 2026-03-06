using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;

namespace RizzyUI.Tests.Components.Form.RzCheckboxGroup;

public class RzInputCheckboxTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzInputCheckboxTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersCheckboxSlotAndDefaultClasses()
    {
        var model = new CheckboxModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzInputCheckbox>(cp => cp
                .Add(p => p.For, () => model.Accepted)
                .Add(p => p.Value, true)));

        var input = cut.Find("input[type='checkbox'][data-slot='checkbox']");
        Assert.Equal("True", input.GetAttribute("value"));
        Assert.Contains("border-input", input.ClassList);
    }

    [Fact]
    public void MergesUserSuppliedClass()
    {
        var model = new CheckboxModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzInputCheckbox>(cp => cp
                .Add(p => p.For, () => model.Accepted)
                .AddUnmatched("class", "custom-checkbox")));

        var input = cut.Find("input[data-slot='checkbox']");
        Assert.Contains("custom-checkbox", input.ClassList);
    }

    [Fact]
    public void ThrowsOutsideEditForm()
    {
        var model = new CheckboxModel();
        Assert.Throws<InvalidOperationException>(() =>
            Render<global::RizzyUI.RzInputCheckbox>(cp => cp.Add(p => p.For, () => model.Accepted)));
    }

    private sealed class CheckboxModel
    {
        public bool Accepted { get; set; }
    }
}
