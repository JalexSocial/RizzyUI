using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Http;
using Rizzy.Htmx;

namespace RizzyUI.Tests.Components.Form.Field;

public class FieldLabelTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public FieldLabelTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void ForId_RendersForAttributeOutsideEditForm()
    {
        var cut = Render<FieldLabel<string>>(parameters => parameters
            .Add(p => p.ForId, "email-address")
            .AddChildContent("Email address"));

        var labels = cut.FindAll("label");
        Assert.Single(labels);
        Assert.Equal("email-address", labels[0].GetAttribute("for"));
        Assert.Contains("Email address", labels[0].TextContent);
    }

    [Fact]
    public void ForId_WithExpression_UsesExplicitForValueAndKeepsDisplayInference()
    {
        var model = new LabelModel();
        var editContext = new EditContext(model);

        var cut = RenderWithContexts(model, editContext, new DefaultHttpContext(), parameters => parameters
            .Add(p => p.For, () => model.Email)
            .Add(p => p.ForId, "email-address"));

        var label = cut.Find("label");
        Assert.Equal("email-address", label.GetAttribute("for"));
        Assert.Equal("Email address", label.TextContent.Trim());
    }

    [Fact]
    public void ForId_TakesPrecedenceOverMappedId()
    {
        var model = new LabelModel();
        var editContext = new EditContext(model);
        var httpContext = CreateHttpContextWithMapping(editContext, () => model.Email, "mapped-email-id");

        var cut = RenderWithContexts(model, editContext, httpContext, parameters => parameters
            .Add(p => p.For, () => model.Email)
            .Add(p => p.ForId, "explicit-email-id")
            .AddChildContent("Email"));

        Assert.Equal("explicit-email-id", cut.Find("label").GetAttribute("for"));
    }

    [Fact]
    public void NullForId_FallsBackToMappedId()
    {
        var model = new LabelModel();
        var editContext = new EditContext(model);
        var httpContext = CreateHttpContextWithMapping(editContext, () => model.Email, "mapped-email-id");

        var cut = RenderWithContexts(model, editContext, httpContext, parameters => parameters
            .Add(p => p.For, () => model.Email)
            .Add(p => p.ForId, (string?)null)
            .AddChildContent("Email"));

        Assert.Equal("mapped-email-id", cut.Find("label").GetAttribute("for"));
    }

    [Fact]
    public void EmptyForId_FallsBackToMappedIdWhenAvailable()
    {
        var model = new LabelModel();
        var editContext = new EditContext(model);
        var httpContext = CreateHttpContextWithMapping(editContext, () => model.Email, "mapped-email-id");

        var cut = RenderWithContexts(model, editContext, httpContext, parameters => parameters
            .Add(p => p.For, () => model.Email)
            .Add(p => p.ForId, string.Empty)
            .AddChildContent("Email"));

        Assert.Equal("mapped-email-id", cut.Find("label").GetAttribute("for"));
    }

    [Fact]
    public void WhitespaceForId_DoesNotRenderWhitespaceAndFallsBackToOmittingForWhenUnresolved()
    {
        var cut = Render<FieldLabel<string>>(parameters => parameters
            .Add(p => p.ForId, "   ")
            .AddChildContent("Search"));

        var label = cut.Find("label");
        Assert.False(label.HasAttribute("for"));
        Assert.DoesNotContain("for=\"\"", cut.Markup);
        Assert.DoesNotContain("for=\"   \"", cut.Markup);
    }

    [Fact]
    public void UnresolvedTarget_OmitsForAttribute()
    {
        var cut = Render<FieldLabel<string>>(parameters => parameters
            .AddChildContent("Unassociated label"));

        var label = cut.Find("label");
        Assert.False(label.HasAttribute("for"));
        Assert.DoesNotContain("for=\"\"", cut.Markup);
        Assert.DoesNotContain("for=\"null\"", cut.Markup);
    }

    [Fact]
    public void IdIdentifiesLabelElementAndForIdIdentifiesTargetControl()
    {
        var cut = Render<FieldLabel<string>>(parameters => parameters
            .Add(p => p.Id, "email-label")
            .Add(p => p.ForId, "email-input")
            .AddChildContent("Email"));

        var label = cut.Find("label");
        Assert.Equal("email-label", label.Id);
        Assert.Equal("email-input", label.GetAttribute("for"));
    }

    [Fact]
    public void ChildContentRemainsIntactWhenForIdIsSupplied()
    {
        var cut = Render<FieldLabel<string>>(parameters => parameters
            .Add(p => p.ForId, "search-box")
            .AddChildContent(builder => builder.AddMarkupContent(0, "<span>Custom label</span>")));

        var label = cut.Find("label");
        Assert.Equal("search-box", label.GetAttribute("for"));
        Assert.NotNull(label.QuerySelector("span"));
        Assert.Equal("Custom label", label.TextContent.Trim());
    }

    [Fact]
    public void DisplayNameRemainsIntactWhenForIdIsSupplied()
    {
        var cut = Render<FieldLabel<string>>(parameters => parameters
            .Add(p => p.ForId, "email-input")
            .Add(p => p.DisplayName, "Account email"));

        var label = cut.Find("label");
        Assert.Equal("email-input", label.GetAttribute("for"));
        Assert.Equal("Account email", label.TextContent.Trim());
    }

    [Fact]
    public void DisplayMetadataRemainsIntactWhenForIdIsSupplied()
    {
        var model = new LabelModel();
        var editContext = new EditContext(model);

        var cut = RenderWithContexts(model, editContext, new DefaultHttpContext(), parameters => parameters
            .Add(p => p.For, () => model.Email)
            .Add(p => p.ForId, "email-input"));

        var label = cut.Find("label");
        Assert.Equal("email-input", label.GetAttribute("for"));
        Assert.Equal("Email address", label.TextContent.Trim());
    }

    [Fact]
    public void AdditionalAttributesRemainIntact()
    {
        var cut = Render<FieldLabel<string>>(parameters => parameters
            .Add(p => p.ForId, "email-input")
            .AddChildContent("Email")
            .AddUnmatched("aria-describedby", "email-help")
            .AddUnmatched("data-test-id", "email-label")
            .AddUnmatched("class", "custom-label"));

        var label = cut.Find("label");
        Assert.Equal("email-input", label.GetAttribute("for"));
        Assert.Equal("email-help", label.GetAttribute("aria-describedby"));
        Assert.Equal("email-label", label.GetAttribute("data-test-id"));
        Assert.Contains("custom-label", label.ClassList);
        Assert.Equal(1, label.Attributes.Count(attribute => attribute.Name == "for"));
    }

    [Fact]
    public void ParameterUpdatesRefreshAndClearEffectiveForId()
    {
        var cut = Render<FieldLabel<string>>(parameters => parameters
            .Add(p => p.ForId, "first-id")
            .AddChildContent("Search"));

        Assert.Equal("first-id", cut.Find("label").GetAttribute("for"));

        cut.Render(parameters => parameters
            .Add(p => p.ForId, "second-id")
            .AddChildContent("Search"));

        Assert.Equal("second-id", cut.Find("label").GetAttribute("for"));

        cut.Render(parameters => parameters
            .Add(p => p.ForId, " ")
            .AddChildContent("Search"));

        var label = cut.Find("label");
        Assert.False(label.HasAttribute("for"));
        Assert.DoesNotContain("first-id", cut.Markup);
        Assert.DoesNotContain("second-id", cut.Markup);
        Assert.DoesNotContain("for=\"\"", cut.Markup);
    }

    [Fact]
    public void ForOutsideEditFormStillThrowsButForIdAloneDoesNot()
    {
        var model = new LabelModel();

        Assert.Throws<InvalidOperationException>(() =>
            Render<FieldLabel<string>>(parameters => parameters
                .Add(p => p.For, () => model.Email)
                .Add(p => p.ForId, "email-input")));

        var cut = Render<FieldLabel<string>>(parameters => parameters
            .Add(p => p.ForId, "email-input")
            .AddChildContent("Email"));

        Assert.Equal("email-input", cut.Find("label").GetAttribute("for"));
    }

    private IRenderedComponent<CascadingValue<HttpContext>> RenderWithContexts(
        LabelModel model,
        EditContext editContext,
        HttpContext httpContext,
        Action<ComponentParameterCollectionBuilder<FieldLabel<string>>> configureLabel)
    {
        _ = model;

        return Render<CascadingValue<HttpContext>>(parameters => parameters
            .Add(p => p.Value, httpContext)
            .AddChildContent<CascadingValue<EditContext>>(editParameters => editParameters
                .Add(p => p.Value, editContext)
                .AddChildContent<FieldLabel<string>>(configureLabel)));
    }

    private static HttpContext CreateHttpContextWithMapping<TValue>(EditContext editContext, Expression<Func<TValue>> expression, string id)
    {
        var httpContext = new DefaultHttpContext();
        var fieldMap = httpContext.GetOrAddFieldMapping(editContext);
        var field = FieldIdentifier.Create(expression);
        fieldMap[field] = new RzFormFieldMap
        {
            Id = id,
            FieldName = field.FieldName
        };

        return httpContext;
    }

    private sealed class LabelModel
    {
        [Display(Name = "Email address")]
        public string Email { get; set; } = string.Empty;
    }
}
