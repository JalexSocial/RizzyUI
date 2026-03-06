using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Linq.Expressions;

namespace RizzyUI.Tests.Components.Form;

public class RzComboboxTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzComboboxTests(WebAppFixture fixture) : base(fixture) { }

    private sealed class ComboboxModel
    {
        public string Value { get; set; } = string.Empty;
        public IEnumerable<string> Values { get; set; } = [];
    }

    [Fact]
    public void RzCombobox_RendersSlotsAndAlpineBootstrap()
    {
        var model = new ComboboxModel();
        var editContext = new EditContext(model);

        var cut = Render(builder =>
        {
            builder.OpenComponent<CascadingValue<EditContext>>(0);
            builder.AddAttribute(1, "Value", editContext);
            builder.AddAttribute(2, "IsFixed", true);
            builder.AddAttribute(3, "ChildContent", (RenderFragment)(child =>
            {
                child.OpenComponent<RzCombobox<SelectListItem, string>>(0);
                child.AddAttribute(1, "For", (Expression<Func<string>>)(() => model.Value));
                child.CloseComponent();
            }));
            builder.CloseComponent();
        });

        Assert.NotNull(cut.Find("[data-slot='combobox']"));
        var alpine = cut.Find("[x-data='rzCombobox']");
        Assert.Equal(alpine.Id, alpine.GetAttribute("data-alpine-root"));
        Assert.Equal($"{alpine.Id}-config", alpine.GetAttribute("data-config-id"));
        Assert.Equal($"{alpine.Id}-select", cut.Find("select[data-slot='select']").Id);
    }

    [Fact]
    public void RzCombobox_RendersPlaceholderAndMultipleMarkup()
    {
        var items = new[] { new SelectListItem { Text = "Alpha", Value = "a" } };
        var model = new ComboboxModel();
        var editContext = new EditContext(model);

        var cut = Render(builder =>
        {
            builder.OpenComponent<CascadingValue<EditContext>>(0);
            builder.AddAttribute(1, "Value", editContext);
            builder.AddAttribute(2, "IsFixed", true);
            builder.AddAttribute(3, "ChildContent", (RenderFragment)(child =>
            {
                child.OpenComponent<RzCombobox<SelectListItem, IEnumerable<string>>>(0);
                child.AddAttribute(1, "For", (Expression<Func<IEnumerable<string>>>)(() => model.Values));
                child.AddAttribute(2, "Items", items);
                child.AddAttribute(3, "Multiple", true);
                child.AddAttribute(4, "Placeholder", "Choose values");
                child.CloseComponent();
            }));
            builder.CloseComponent();
        });

        var select = cut.Find("select[data-slot='select']");
        Assert.Equal("multiple", select.GetAttribute("multiple"));
        Assert.DoesNotContain("<option value=\"\">Choose values</option>", cut.Markup);
    }

    [Fact]
    public void RzCombobox_MergesClassesAndHandlesDisabledItems()
    {
        var items = new[]
        {
            new SelectListItem { Text = "Enabled", Value = "1" },
            new SelectListItem { Text = "Disabled", Value = "2", Disabled = true }
        };
        var model = new ComboboxModel();
        var editContext = new EditContext(model);

        var cut = Render(builder =>
        {
            builder.OpenComponent<CascadingValue<EditContext>>(0);
            builder.AddAttribute(1, "Value", editContext);
            builder.AddAttribute(2, "IsFixed", true);
            builder.AddAttribute(3, "ChildContent", (RenderFragment)(child =>
            {
                child.OpenComponent<RzCombobox<SelectListItem, string>>(0);
                child.AddAttribute(1, "For", (Expression<Func<string>>)(() => model.Value));
                child.AddAttribute(2, "Items", items);
                child.AddAttribute(3, "Disabled", true);
                child.AddAttribute(4, "class", "custom-combobox");
                child.CloseComponent();
            }));
            builder.CloseComponent();
        });

        var root = cut.Find("[data-slot='combobox']");
        Assert.Contains("custom-combobox", root.ClassList);
        Assert.True(cut.Find("select[data-slot='select']").HasAttribute("disabled"));
    }
}
