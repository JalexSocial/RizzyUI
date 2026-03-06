using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;

namespace RizzyUI.Tests.Components.Form.RzInputNumber;

public class RzInputNumberTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzInputNumberTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersNumberInputWithSlotAndPlaceholder()
    {
        var model = new NumberModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzInputNumber<int>>(np => np
                .Add(p => p.For, () => model.Quantity)
                .Add(p => p.Placeholder, "0")));

        var input = cut.Find("input[type='number'][data-slot='input']");
        Assert.Equal("0", input.GetAttribute("placeholder"));
        Assert.Contains("border-input", input.ClassList);
    }

    [Fact]
    public void MergesCustomClass()
    {
        var model = new NumberModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzInputNumber<int>>(np => np
                .Add(p => p.For, () => model.Quantity)
                .AddUnmatched("class", "custom-number")));

        Assert.Contains("custom-number", cut.Find("input[data-slot='input']").ClassList);
    }

    [Fact]
    public void ThrowsOutsideEditForm()
    {
        var model = new NumberModel();
        Assert.Throws<InvalidOperationException>(() =>
            Render<global::RizzyUI.RzInputNumber<int>>(p => p.Add(x => x.For, () => model.Quantity)));
    }

    private sealed class NumberModel
    {
        public int Quantity { get; set; }
    }
}
