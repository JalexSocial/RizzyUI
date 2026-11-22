using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace RizzyUI.Tests.Components.Form;

/// <summary>
/// Decision D-28 (Summit SF-009): every input posts the model path, as Blazor's own inputs do. Five
/// components posted the bare property name (Country instead of Model.Country).
/// </summary>
public class ModelPathNameTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public ModelPathNameTests(WebAppFixture fixture) : base(fixture)
    {
    }

    public sealed class FormModel
    {
        public string Title { get; set; } = "";
        public IList<string> Tags { get; set; } = [];
        public string Level { get; set; } = "";
        public string Country { get; set; } = "";
        public string Code { get; set; } = "";
        public object? Attachment { get; set; }
    }

    /// <summary>Hosts the inputs the way a page does: bound to its Model property.</summary>
    private sealed class Host : ComponentBase
    {
        [Parameter] public FormModel Model { get; set; } = new();

        protected override void BuildRenderTree(RenderTreeBuilder b)
        {
            b.OpenComponent<CascadingValue<EditContext>>(0);
            b.AddComponentParameter(1, "Value", new EditContext(Model));
            b.AddComponentParameter(2, "ChildContent", (RenderFragment)(c =>
            {
                c.OpenComponent<InputText>(0);
                c.AddComponentParameter(1, "ValueExpression", (System.Linq.Expressions.Expression<Func<string>>)(() => Model.Title));
                c.AddComponentParameter(2, "Value", Model.Title);
                c.CloseComponent();

                c.OpenComponent<RzCheckboxGroup<string>>(3);
                c.AddComponentParameter(4, "For", (System.Linq.Expressions.Expression<Func<IList<string>>>)(() => Model.Tags));
                c.AddComponentParameter(5, "ChildContent", (RenderFragment)(g =>
                {
                    g.OpenComponent<RzCheckboxGroupItem<string>>(0);
                    g.AddComponentParameter(1, "Value", "a");
                    g.CloseComponent();
                }));
                c.CloseComponent();

                c.OpenComponent<RzRadioGroup<string>>(6);
                c.AddComponentParameter(7, "For", (System.Linq.Expressions.Expression<Func<string>>)(() => Model.Level));
                c.AddComponentParameter(8, "ChildContent", (RenderFragment)(g =>
                {
                    g.OpenComponent<RadioGroupItem<string>>(0);
                    g.AddComponentParameter(1, "Value", "basic");
                    g.CloseComponent();
                }));
                c.CloseComponent();

                c.OpenComponent<RzCombobox<SelectListItem, string>>(9);
                c.AddComponentParameter(10, "For", (System.Linq.Expressions.Expression<Func<string>>)(() => Model.Country));
                c.CloseComponent();

                c.OpenComponent<RzInputOTP>(11);
                c.AddComponentParameter(12, "For", (System.Linq.Expressions.Expression<Func<string>>)(() => Model.Code));
                c.CloseComponent();

                c.OpenComponent<RzFileInput>(13);
                c.AddComponentParameter(14, "For", (System.Linq.Expressions.Expression<Func<object?>>)(() => Model.Attachment));
                c.CloseComponent();
            }));
            b.CloseComponent();
        }
    }

    [Fact]
    public void Every_input_posts_the_model_path_like_Blazors_own_inputs()
    {
        var cut = Render<Host>();

        Assert.Equal("Model.Title", cut.Find("input[name='Model.Title']").GetAttribute("name")); // Blazor's InputText
        Assert.NotEmpty(cut.FindAll("input[type='checkbox'][name='Model.Tags']"));
        Assert.NotEmpty(cut.FindAll("input[type='radio'][name='Model.Level']"));
        Assert.NotEmpty(cut.FindAll("select[name='Model.Country']"));
        Assert.NotEmpty(cut.FindAll("[name='Model.Code']"));
        Assert.NotEmpty(cut.FindAll("input[type='file'][name='Model.Attachment']"));
        Assert.Empty(cut.FindAll("[name='Tags'], [name='Level'], [name='Country'], [name='Code'], [name='Attachment']"));
    }
}
