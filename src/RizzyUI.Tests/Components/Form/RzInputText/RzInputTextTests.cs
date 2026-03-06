using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;

namespace RizzyUI.Tests.Components.Form.RzInputText;

public class RzInputTextTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzInputTextTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersInputWithSlotTypeAndPlaceholder()
    {
        var model = new TextModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzInputText>(ip => ip
                .Add(p => p.For, () => model.Value)
                .Add(p => p.Role, TextRole.Email)
                .Add(p => p.Placeholder, "name@example.com")));

        var input = cut.Find("input[data-slot='input']");
        Assert.Equal("email", input.GetAttribute("type"));
        Assert.Equal("name@example.com", input.GetAttribute("placeholder"));
        Assert.Contains("border-input", input.ClassList);
    }

    [Fact]
    public void MergesCustomClass()
    {
        var model = new TextModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzInputText>(ip => ip
                .Add(p => p.For, () => model.Value)
                .AddUnmatched("class", "custom-input")));

        Assert.Contains("custom-input", cut.Find("input[data-slot='input']").ClassList);
    }

    [Fact]
    public void ThrowsOutsideEditForm()
    {
        var model = new TextModel();
        Assert.Throws<InvalidOperationException>(() =>
            Render<global::RizzyUI.RzInputText>(p => p.Add(x => x.For, () => model.Value)));
    }

    private sealed class TextModel
    {
        public string Value { get; set; } = string.Empty;
    }
}
