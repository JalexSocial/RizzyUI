using System.Linq.Expressions;
using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Http;

namespace RizzyUI.Tests.Components.Form.Field;

/// <summary>
/// A <see cref="FieldLabel{TValue}"/> placed before its input points at the input's id.
/// </summary>
public class FieldLabelOrderTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public FieldLabelOrderTests(WebAppFixture fixture) : base(fixture)
    {
    }

    private sealed class OrderModel
    {
        public string? Name { get; set; }
        public int Age { get; set; }
        public string? Bio { get; set; }
        public DateTime? Date { get; set; }
        public string? Search { get; set; }
        public string Color { get; set; } = "red";
        public bool Enabled { get; set; }
        public bool Accept { get; set; }
    }

    private IRenderedComponent<CascadingValue<HttpContext>> RenderForm(OrderModel model, RenderFragment content) =>
        Render<CascadingValue<HttpContext>>(parameters => parameters
            .Add(p => p.Value, new DefaultHttpContext())
            .AddChildContent<CascadingValue<EditContext>>(edit => edit
                .Add(p => p.Value, new EditContext(model))
                .Add(p => p.ChildContent, content)));

    private static RenderFragment Label<TValue>(Expression<Func<TValue>> field) => builder =>
    {
        builder.OpenComponent<FieldLabel<TValue>>(0);
        builder.AddComponentParameter(1, nameof(FieldLabel<TValue>.For), field);
        builder.CloseComponent();
    };

    private static RenderFragment Input<TComponent>(params (string Name, object? Value)[] parameters)
        where TComponent : IComponent => builder =>
    {
        builder.OpenComponent<TComponent>(0);
        var sequence = 1;
        foreach (var (name, value) in parameters)
            builder.AddComponentParameter(sequence++, name, value);
        builder.CloseComponent();
    };

    private static RenderFragment Both(RenderFragment first, RenderFragment second) => builder =>
    {
        builder.AddContent(0, first);
        builder.AddContent(1, second);
    };

    private static void AssertLabelPointsAt(IRenderedComponent<CascadingValue<HttpContext>> cut, string inputSelector)
    {
        var label = cut.Find("label");
        var input = cut.Find(inputSelector);
        Assert.False(string.IsNullOrEmpty(input.Id));
        Assert.Equal(input.Id, label.GetAttribute("for"));
        Assert.Single(cut.FindAll($"[id='{input.Id}']"));
    }

    [Fact]
    public void BeforeRzInputText()
    {
        var model = new OrderModel();
        var cut = RenderForm(model, Both(Label(() => model.Name),
            Input<RizzyUI.RzInputText>((nameof(RizzyUI.RzInputText.For), (Expression<Func<string?>>)(() => model.Name)))));

        AssertLabelPointsAt(cut, "input");
    }

    [Fact]
    public void AfterRzInputText()
    {
        var model = new OrderModel();
        var cut = RenderForm(model, Both(
            Input<RizzyUI.RzInputText>((nameof(RizzyUI.RzInputText.For), (Expression<Func<string?>>)(() => model.Name))),
            Label(() => model.Name)));

        AssertLabelPointsAt(cut, "input");
    }

    [Fact]
    public void BeforeRzInputNumber()
    {
        var model = new OrderModel();
        var cut = RenderForm(model, Both(Label(() => model.Age),
            Input<RizzyUI.RzInputNumber<int>>((nameof(RizzyUI.RzInputNumber<int>.For), (Expression<Func<int>>)(() => model.Age)))));

        AssertLabelPointsAt(cut, "input");
    }

    [Fact]
    public void BeforeRzInputTextArea()
    {
        var model = new OrderModel();
        var cut = RenderForm(model, Both(Label(() => model.Bio),
            Input<RizzyUI.RzInputTextArea>((nameof(RizzyUI.RzInputTextArea.For), (Expression<Func<string?>>)(() => model.Bio)))));

        AssertLabelPointsAt(cut, "textarea");
    }

    [Fact]
    public void BeforeRzDateEdit()
    {
        var model = new OrderModel();
        var cut = RenderForm(model, Both(Label(() => model.Date),
            Input<RizzyUI.RzDateEdit>((nameof(RizzyUI.RzDateEdit.For), (Expression<Func<DateTime?>>)(() => model.Date)))));

        AssertLabelPointsAt(cut, "input[data-input]");
    }

    [Fact]
    public void BeforeInputGroupInput()
    {
        var model = new OrderModel();
        var cut = RenderForm(model, Both(Label(() => model.Search),
            Input<RizzyUI.InputGroupInput>((nameof(RizzyUI.InputGroupInput.For), (Expression<Func<string?>>)(() => model.Search)))));

        AssertLabelPointsAt(cut, "input");
    }

    [Fact]
    public void BeforeRzNativeSelect()
    {
        var model = new OrderModel();
        var cut = RenderForm(model, Both(Label(() => model.Color),
            Input<RizzyUI.RzNativeSelect<string>>((nameof(RizzyUI.RzNativeSelect<string>.For), (Expression<Func<string>>)(() => model.Color)))));

        AssertLabelPointsAt(cut, "select");
    }

    [Fact]
    public void BeforeRzSwitch()
    {
        var model = new OrderModel();
        var cut = RenderForm(model, Both(Label(() => model.Enabled),
            Input<RizzyUI.RzSwitch>((nameof(RizzyUI.RzSwitch.For), (Expression<Func<bool>>)(() => model.Enabled)))));

        AssertLabelPointsAt(cut, "input[role='switch']");
    }

    [Fact]
    public void BeforeRzInputCheckbox()
    {
        var model = new OrderModel();
        var cut = RenderForm(model, Both(Label(() => model.Accept),
            Input<RizzyUI.RzInputCheckbox>((nameof(RizzyUI.RzInputCheckbox.For), (Expression<Func<bool>>)(() => model.Accept)))));

        AssertLabelPointsAt(cut, "input[type='checkbox']");
    }

    [Fact]
    public void ExplicitId_LabelAfterTheInputPointsAtIt()
    {
        var model = new OrderModel();
        var cut = RenderForm(model, Both(
            Input<RizzyUI.RzInputText>(
                (nameof(RizzyUI.RzInputText.For), (Expression<Func<string?>>)(() => model.Name)),
                (nameof(RizzyUI.RzInputText.Id), "my-name")),
            Label(() => model.Name)));

        Assert.Equal("my-name", cut.Find("input").Id);
        AssertLabelPointsAt(cut, "input");
    }
}
