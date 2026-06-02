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
    public void SelectForwardsAccessibleAttributesAndMergesAriaDescribedBy()
    {
        var model = new SelectModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzNativeSelect<string>>(sp => sp
                .Add(p => p.For, () => model.Value)
                .Add(p => p.Id, "fruit-select")
                .Add(p => p.AriaDescribedBy, "field-hint field-error")
                .AddUnmatched("aria-label", "Fruit")
                .AddUnmatched("aria-labelledby", "fruit-label")
                .AddUnmatched("aria-describedby", "external-description")
                .AddChildContent<global::RizzyUI.RzNativeSelectOption>(op => op
                    .Add(o => o.Value, "one")
                    .AddChildContent("One"))));

        var select = cut.Find("select[data-slot='native-select']");
        Assert.Equal("fruit-select", select.Id);
        Assert.Equal("Fruit", select.GetAttribute("aria-label"));
        Assert.Equal("fruit-label", select.GetAttribute("aria-labelledby"));
        Assert.Equal("external-description field-hint field-error", select.GetAttribute("aria-describedby"));
    }

    [Fact]
    public void SelectPreservesDisabledAndSupportsOptGroupRendering()
    {
        var model = new SelectModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzNativeSelect<string>>(sp => sp
                .Add(p => p.For, () => model.Value)
                .AddUnmatched("disabled", "disabled")
                .AddChildContent<global::RizzyUI.RzNativeSelectOptGroup>(group => group
                    .Add(g => g.Label, "Popular")
                    .AddChildContent<global::RizzyUI.RzNativeSelectOption>(option => option
                        .Add(o => o.Value, "one")
                        .AddChildContent("One")))));

        var select = cut.Find("select[data-slot='native-select']");
        Assert.Equal("disabled", select.GetAttribute("disabled"));
        Assert.NotNull(cut.Find("optgroup[data-slot='native-select-optgroup'][label='Popular']"));
        Assert.NotNull(cut.Find("option[data-slot='native-select-option'][value='one']"));
    }


    [Fact]
    public void SelectDoesNotRenderAlpineRuntimeOrCustomPopupMarkup()
    {
        var model = new SelectModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzNativeSelect<string>>(sp => sp
                .Add(p => p.For, () => model.Value)
                .AddChildContent<global::RizzyUI.RzNativeSelectOption>(op => op
                    .Add(o => o.Value, "one")
                    .AddChildContent("One"))));

        Assert.Empty(cut.FindAll("[data-alpine-root]"));
        Assert.Empty(cut.FindAll("[x-data]"));
        Assert.Empty(cut.FindAll("[role='listbox']"));
        Assert.Empty(cut.FindAll("[aria-activedescendant]"));
    }

    [Fact]
    public void SelectUsesStableWrapperAndSelectIds()
    {
        var model = new SelectModel();

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent<global::RizzyUI.RzNativeSelect<string>>(sp => sp
                .Add(p => p.For, () => model.Value)
                .Add(p => p.Id, "vehicle-select")
                .AddChildContent<global::RizzyUI.RzNativeSelectOption>(op => op
                    .Add(o => o.Value, "one")
                    .AddChildContent("One"))));

        var wrapper = cut.Find("div[id='vehicle-select-wrapper']");
        var select = cut.Find("select[data-slot='native-select']");
        Assert.NotNull(wrapper);
        Assert.Equal("vehicle-select", select.Id);
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
