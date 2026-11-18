using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Http;

namespace RizzyUI.Tests.Components.Form;

/// <summary>
/// Accessibility contract of <see cref="RzInputCheckbox"/>: a native checkbox (so keyboard and
/// screen-reader behavior come from the browser), named by its FieldLabel, with its checked state and
/// validation state in the markup.
/// </summary>
public class RzInputCheckboxTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzInputCheckboxTests(WebAppFixture fixture) : base(fixture)
    {
    }

    private sealed class TermsModel
    {
        public bool Accept { get; set; }
    }

    [Fact]
    public void RendersANativeCheckboxNamedByItsLabel()
    {
        var model = new TermsModel { Accept = true };

        // FieldLabel and the input agree on the field id through the request (Rizzy's field id map).
        var cut = Render<CascadingValue<HttpContext>>(http => http
            .Add(p => p.Value, new DefaultHttpContext())
            .AddChildContent<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, new EditContext(model))
            .AddChildContent(b =>
            {
                b.OpenComponent<FieldLabel<bool>>(0);
                b.AddComponentParameter(1, nameof(FieldLabel<bool>.For), (System.Linq.Expressions.Expression<Func<bool>>)(() => model.Accept));
                b.AddComponentParameter(2, nameof(FieldLabel<bool>.ChildContent), (RenderFragment)(c => c.AddContent(0, "Accept the terms")));
                b.CloseComponent();
                b.OpenComponent<RzInputCheckbox>(3);
                b.AddComponentParameter(4, nameof(RzInputCheckbox.For), (System.Linq.Expressions.Expression<Func<bool>>)(() => model.Accept));
                b.CloseComponent();
            })));

        var checkbox = cut.Find("input[type='checkbox']");
        Assert.True(checkbox.HasAttribute("checked"));
        Assert.Equal("Accept", checkbox.GetAttribute("name")?.Split('.').Last());
        Assert.Null(checkbox.GetAttribute("role"));

        var label = cut.Find("label");
        Assert.Equal(checkbox.GetAttribute("id"), label.GetAttribute("for"));
        Assert.Contains("Accept the terms", label.TextContent);
    }

    [Fact]
    public void MarksAnInvalidFieldWithAriaInvalid()
    {
        var model = new TermsModel();
        var editContext = new EditContext(model);
        var messages = new ValidationMessageStore(editContext);
        messages.Add(editContext.Field(nameof(TermsModel.Accept)), "You must accept the terms.");

        var cut = Render<CascadingValue<EditContext>>(ps => ps
            .Add(p => p.Value, editContext)
            .AddChildContent<RzInputCheckbox>(p => p.Add(x => x.For, () => model.Accept)));

        Assert.Equal("true", cut.Find("input[type='checkbox']").GetAttribute("aria-invalid"));
    }
}
