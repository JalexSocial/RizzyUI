using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace RizzyUI.Tests.Components.Form;

/// <summary>
/// Inputs built on <see cref="InputBase{TValue, TSlots}"/> render the current value of the field
/// named by <c>For</c> unless the caller passes <c>Value</c>. Without this, a form re-rendered after
/// a failed post shows empty controls instead of what the user entered.
/// </summary>
public class InputBaseValueTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public InputBaseValueTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void InputText_renders_the_For_value_when_Value_is_not_set()
    {
        var model = new ProfileModel { Name = "Grace Hopper" };

        var cut = RenderInForm<global::RizzyUI.RzInputText>(model, p => p.Add(x => x.For, () => model.Name));

        Assert.Equal("Grace Hopper", cut.Find("input[data-slot='input']").GetAttribute("value"));
    }

    [Fact]
    public void InputText_explicit_Value_wins_over_For()
    {
        var model = new ProfileModel { Name = "Grace Hopper" };

        var cut = RenderInForm<global::RizzyUI.RzInputText>(model, p => p
            .Add(x => x.For, () => model.Name)
            .Add(x => x.Value, "Ada Lovelace"));

        Assert.Equal("Ada Lovelace", cut.Find("input[data-slot='input']").GetAttribute("value"));
    }

    [Fact]
    public void InputText_explicit_null_Value_is_respected()
    {
        var model = new ProfileModel { Name = "Grace Hopper" };

        var cut = RenderInForm<global::RizzyUI.RzInputText>(model, p => p
            .Add(x => x.For, () => model.Name)
            .Add(x => x.Value, (string?)null));

        Assert.True(string.IsNullOrEmpty(cut.Find("input[data-slot='input']").GetAttribute("value")));
    }

    [Fact]
    public void InputText_reads_a_nested_member()
    {
        var model = new ProfileModel { Address = new AddressModel { City = "Arlington" } };

        var cut = RenderInForm<global::RizzyUI.RzInputText>(model, p => p.Add(x => x.For, () => model.Address.City));

        Assert.Equal("Arlington", cut.Find("input[data-slot='input']").GetAttribute("value"));
    }

    [Fact]
    public void InputText_follows_the_model_when_rendered_again()
    {
        var model = new ProfileModel { Name = "Grace Hopper" };
        var editContext = new EditContext(model);
        void Parameters(ComponentParameterCollectionBuilder<CascadingValue<EditContext>> ps) => ps
            .Add(p => p.Value, editContext)
            .AddChildContent<global::RizzyUI.RzInputText>(p => p.Add(x => x.For, () => model.Name));
        var cut = Render<CascadingValue<EditContext>>(Parameters);

        model.Name = "Radia Perlman";
        cut.Render(Parameters);

        Assert.Equal("Radia Perlman", cut.Find("input[data-slot='input']").GetAttribute("value"));
    }

    [Fact]
    public void InputTextArea_renders_the_For_value()
    {
        var model = new ProfileModel { Bio = "Rear admiral and compiler pioneer." };

        var cut = RenderInForm<global::RizzyUI.RzInputTextArea>(model, p => p.Add(x => x.For, () => model.Bio));

        // bUnit shows a textarea's value as an attribute; the static HTML renderer writes it as content.
        Assert.Equal("Rear admiral and compiler pioneer.", cut.Find("textarea").GetAttribute("value"));
    }

    [Fact]
    public void InputNumber_renders_the_For_value()
    {
        var model = new ProfileModel { Age = 42 };

        var cut = RenderInForm<global::RizzyUI.RzInputNumber<int>>(model, p => p.Add(x => x.For, () => model.Age));

        Assert.Equal("42", cut.Find("input").GetAttribute("value"));
    }

    [Fact]
    public void Switch_is_checked_when_the_For_value_is_true()
    {
        var model = new ProfileModel { Subscribed = true };

        var cut = RenderInForm<global::RizzyUI.RzSwitch>(model, p => p.Add(x => x.For, () => model.Subscribed));

        Assert.True(cut.Find("input[type='checkbox']").HasAttribute("checked"));
    }

    [Fact]
    public void InputCheckbox_is_checked_when_the_For_value_is_true()
    {
        var model = new ProfileModel { Subscribed = true };

        var cut = RenderInForm<global::RizzyUI.RzInputCheckbox>(model, p => p.Add(x => x.For, () => model.Subscribed));

        Assert.True(cut.Find("input[type='checkbox']").HasAttribute("checked"));
    }

    [Fact]
    public void Switch_explicit_Value_wins_over_For()
    {
        var model = new ProfileModel { Subscribed = true };

        var cut = RenderInForm<global::RizzyUI.RzSwitch>(model, p => p
            .Add(x => x.For, () => model.Subscribed)
            .Add(x => x.Value, false));

        Assert.False(cut.Find("input[type='checkbox']").HasAttribute("checked"));
    }

    [Fact]
    public void NativeSelect_selects_the_For_value()
    {
        var model = new ProfileModel { Plan = "pro" };

        var cut = RenderInForm<global::RizzyUI.RzNativeSelect<string>>(model, p => p
            .Add(x => x.For, () => model.Plan)
            .AddChildContent("<option value=\"free\">Free</option><option value=\"pro\">Pro</option>"));

        Assert.Equal("pro", cut.Find("select").GetAttribute("value"));
    }

    [Fact]
    public void Combobox_selects_the_For_value_over_SelectListItem_Selected()
    {
        var model = new ProfileModel { Plan = "pro" };

        var cut = RenderInForm<global::RizzyUI.RzCombobox<SelectListItem, string>>(model, p => p
            .Add(x => x.For, () => model.Plan!)
            .Add(x => x.Items, PlanItems()));

        Assert.Equal(["pro"], SelectedOptionValues(cut));
    }

    [Fact]
    public void Combobox_falls_back_to_SelectListItem_Selected_when_the_For_value_is_empty()
    {
        var model = new ProfileModel { Plan = string.Empty };

        var cut = RenderInForm<global::RizzyUI.RzCombobox<SelectListItem, string>>(model, p => p
            .Add(x => x.For, () => model.Plan!)
            .Add(x => x.Items, PlanItems()));

        Assert.Equal(["free"], SelectedOptionValues(cut));
    }

    [Fact]
    public void Combobox_explicit_empty_Value_selects_nothing()
    {
        var model = new ProfileModel { Plan = "pro" };

        var cut = RenderInForm<global::RizzyUI.RzCombobox<SelectListItem, string>>(model, p => p
            .Add(x => x.For, () => model.Plan!)
            .Add(x => x.Value, string.Empty)
            .Add(x => x.Items, PlanItems()));

        Assert.Empty(SelectedOptionValues(cut));
    }

    private static SelectListItem[] PlanItems() =>
    [
        new SelectListItem { Text = "Free", Value = "free", Selected = true },
        new SelectListItem { Text = "Pro", Value = "pro" }
    ];

    private static string[] SelectedOptionValues(IRenderedComponent<CascadingValue<EditContext>> cut) =>
        cut.FindAll("select option[selected]").Select(o => o.GetAttribute("value") ?? string.Empty).ToArray();

    private IRenderedComponent<CascadingValue<EditContext>> RenderInForm<TComponent>(
        ProfileModel model,
        Action<ComponentParameterCollectionBuilder<TComponent>> parameters)
        where TComponent : IComponent =>
        Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent(parameters));

    private sealed class ProfileModel
    {
        public string? Name { get; set; }
        public string? Bio { get; set; }
        public int Age { get; set; }
        public bool Subscribed { get; set; }
        public string? Plan { get; set; }
        public AddressModel Address { get; set; } = new();
    }

    private sealed class AddressModel
    {
        public string? City { get; set; }
    }
}
