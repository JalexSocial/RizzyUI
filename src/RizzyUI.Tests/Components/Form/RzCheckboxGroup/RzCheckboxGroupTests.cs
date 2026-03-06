using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;

namespace RizzyUI.Tests.Components.Form.RzCheckboxGroup;

public class RzCheckboxGroupTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzCheckboxGroupTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RendersFieldsetWithLegendAndGroupSemantics()
    {
        var model = new CheckboxModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzCheckboxGroup<string>>(cp => cp
                .Add(p => p.For, () => model.Selected)
                .Add(p => p.DisplayName, "Favorite colors")
                .AddChildContent("items")));

        var group = cut.Find("fieldset[data-slot='checkbox-group']");
        Assert.Equal("group", group.GetAttribute("role"));
        Assert.Contains("grid", group.ClassList);

        var legend = cut.Find("legend.sr-only");
        Assert.Equal("Favorite colors", legend.TextContent.Trim());
        Assert.Equal(legend.Id, group.GetAttribute("aria-labelledby"));
    }

    [Fact]
    public void HorizontalOrientationAndUserClassAreMerged()
    {
        var model = new CheckboxModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzCheckboxGroup<string>>(cp => cp
                .Add(p => p.For, () => model.Selected)
                .Add(p => p.Orientation, Orientation.Horizontal)
                .AddUnmatched("class", "extra-group-class")));

        var group = cut.Find("fieldset[data-slot='checkbox-group']");
        Assert.Contains("flex", group.ClassList);
        Assert.Contains("extra-group-class", group.ClassList);
    }

    [Fact]
    public void ThrowsOutsideEditForm()
    {
        var model = new CheckboxModel();

        Assert.Throws<InvalidOperationException>(() =>
            Render<global::RizzyUI.RzCheckboxGroup<string>>(cp => cp.Add(p => p.For, () => model.Selected)));
    }

    private sealed class CheckboxModel
    {
        public IList<string> Selected { get; set; } = ["red"];
    }
}
