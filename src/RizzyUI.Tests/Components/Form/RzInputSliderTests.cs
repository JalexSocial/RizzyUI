using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;

namespace RizzyUI.Tests.Components.Form;

/// <summary>Summit SF-070 (RzInputSlider), SF-064 and SF-013 (RzInputOTP).</summary>
public class RzInputSliderTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzInputSliderTests(WebAppFixture fixture) : base(fixture)
    {
    }

    private sealed class SessionModel
    {
        public int LengthMinutes { get; set; } = 45;
        public string Code { get; set; } = "";
    }

    [Fact]
    public void Posts_one_value_under_the_model_path()
    {
        var model = new SessionModel();
        var context = new EditContext(model);
        var cut = Render<CascadingValue<EditContext>>(p => p
            .Add(x => x.Value, context)
            .AddChildContent<RzInputSlider<int>>(s => s
                .Add(x => x.For, () => model.LengthMinutes)
                .Add(x => x.Min, 15).Add(x => x.Max, 240).Add(x => x.Step, 15)));

        var inputs = cut.FindAll("input[type='hidden'][data-slider-input]");
        var input = Assert.Single(inputs);
        Assert.Equal("model.LengthMinutes", input.GetAttribute("name"));
        Assert.Equal("45", input.GetAttribute("value"));
        Assert.False(cut.Find("[data-slot='input-slider']").HasAttribute("data-invalid"));
    }

    [Fact]
    public void Marks_itself_invalid_while_the_field_has_errors()
    {
        var model = new SessionModel();
        var context = new EditContext(model);
        var messages = new ValidationMessageStore(context);
        messages.Add(() => model.LengthMinutes, "Too long");
        var cut = Render<CascadingValue<EditContext>>(p => p
            .Add(x => x.Value, context)
            .AddChildContent<RzInputSlider<int>>(s => s.Add(x => x.For, () => model.LengthMinutes)));

        Assert.Equal("true", cut.Find("[data-slot='input-slider']").GetAttribute("data-invalid"));
    }

    [Fact]
    public void RzInputOTP_takes_input_attributes_and_has_no_inline_style()
    {
        var cut = Render<RzInputOTP>(p => p
            .Add(x => x.Length, 6)
            .Add(x => x.InputAttributes, new Dictionary<string, object> { ["autofocus"] = true, ["enterkeyhint"] = "done" }));

        var input = cut.Find("input[data-otp-input='true']");
        Assert.True(input.HasAttribute("autofocus"));
        Assert.Equal("done", input.GetAttribute("enterkeyhint"));
        Assert.False(input.HasAttribute("style"));
        Assert.Contains("opacity-0", input.ClassList);
    }
}
