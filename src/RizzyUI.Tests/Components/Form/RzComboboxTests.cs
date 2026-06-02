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
    public void RzCombobox_RendersFallbackSelectAccessibilityAndConfigScript()
    {
        var items = new[]
        {
            new SelectListItem { Text = "Enabled", Value = "1", Selected = true },
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
                child.AddAttribute(3, "Placeholder", "Choose one");
                child.AddAttribute(4, "AdditionalAttributes", new Dictionary<string, object?>
                {
                    ["aria-labelledby"] = "combo-label",
                    ["aria-describedby"] = "combo-help combo-error"
                });
                child.CloseComponent();
            }));
            builder.CloseComponent();
        });

        var alpine = cut.Find("[x-data='rzCombobox']");
        var select = cut.Find("select[data-slot='select']");
        Assert.Equal(select.Id, alpine.GetAttribute("data-select-id"));
        Assert.Equal("combo-label", select.GetAttribute("aria-labelledby"));
        Assert.Equal("combo-help combo-error", select.GetAttribute("aria-describedby"));

        var placeholder = cut.Find("option[value='']");
        Assert.Equal("Choose one", placeholder.TextContent.Trim());

        var options = cut.FindAll("select option");
        Assert.Equal(3, options.Count);
        Assert.True(options[1].HasAttribute("selected"));
        Assert.True(options[2].HasAttribute("disabled"));

        var configScript = cut.Find($"script#{alpine.GetAttribute("data-config-id")}");
        Assert.Equal("application/json", configScript.GetAttribute("type"));
        Assert.False(string.IsNullOrWhiteSpace(configScript.TextContent));
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

    [Fact]
    public void RzCombobox_RendersOptGroupsFromSelectListItem()
    {
        var groupA = new SelectListGroup { Name = "Group A" };
        var groupB = new SelectListGroup { Name = "Group B", Disabled = true };
        var items = new[]
        {
            new SelectListItem { Text = "One", Value = "1", Group = groupA },
            new SelectListItem { Text = "Two", Value = "2", Group = groupB }
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
                child.CloseComponent();
            }));
            builder.CloseComponent();
        });

        var optgroups = cut.FindAll("optgroup");
        Assert.Equal(2, optgroups.Count);
        Assert.Equal("Group A", optgroups[0].GetAttribute("label"));
        Assert.Equal("Group B", optgroups[1].GetAttribute("label"));
        Assert.True(optgroups[1].HasAttribute("disabled"));
    }
}
