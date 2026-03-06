using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;

namespace RizzyUI.Tests.Components.Form.RzInputTextArea;

public class RzInputTextAreaTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzInputTextAreaTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersTextareaSlotAndPlaceholder()
    {
        var model = new TextAreaModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzInputTextArea>(tp => tp
                .Add(p => p.For, () => model.Value)
                .Add(p => p.Placeholder, "Type here")));

        var textarea = cut.Find("textarea[data-slot='textarea']");
        Assert.Equal("Type here", textarea.GetAttribute("placeholder"));
        Assert.Contains("resize-none", textarea.ClassList);
    }

    [Fact]
    public void SupportsCustomClassMerging()
    {
        var model = new TextAreaModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzInputTextArea>(tp => tp
                .Add(p => p.For, () => model.Value)
                .AddUnmatched("class", "custom-textarea")));

        Assert.Contains("custom-textarea", cut.Find("textarea[data-slot='textarea']").ClassList);
    }

    [Fact]
    public void ThrowsOutsideEditForm()
    {
        var model = new TextAreaModel();
        Assert.Throws<InvalidOperationException>(() =>
            Render<global::RizzyUI.RzInputTextArea>(p => p.Add(x => x.For, () => model.Value)));
    }

    private sealed class TextAreaModel
    {
        public string Value { get; set; } = string.Empty;
    }
}
