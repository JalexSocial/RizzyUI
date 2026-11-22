using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;

namespace RizzyUI.Tests.Components.Form;

/// <summary>Summit SF-028 (RzGetForm), SF-033 (caller ids on input-group controls), SF-045 (RzFocusFirstInvalid).</summary>
public class FormHelpersTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public FormHelpersTests(WebAppFixture fixture) : base(fixture)
    {
    }

    private sealed class FilterModel
    {
        public string Q { get; set; } = "";
        public bool Mine { get; set; }
    }

    [Fact]
    public void RzGetForm_renders_a_get_form_and_cascades_an_edit_context()
    {
        var model = new FilterModel();
        var cut = Render<RzGetForm>(p => p
            .Add(x => x.Model, model)
            .Add(x => x.Action, "/speakers")
            .AddUnmatched("hx-get", "/speakers/results")
            .AddChildContent<RizzyUI.RzInputText>(i => i.Add(x => x.For, () => model.Q)));

        var form = cut.Find("form");
        Assert.Equal("get", form.GetAttribute("method"));
        Assert.Equal("/speakers", form.GetAttribute("action"));
        Assert.Equal("/speakers/results", form.GetAttribute("hx-get"));
        Assert.Empty(cut.FindAll("input[name='__RequestVerificationToken'], input[name='_handler']"));
        Assert.NotNull(cut.Find("input[name='model.Q']"));
    }

    [Fact]
    public void A_caller_id_on_an_input_group_control_is_kept()
    {
        var model = new FilterModel();
        var cut = Render<CascadingValue<EditContext>>(p => p
            .Add(x => x.Value, new EditContext(model))
            .AddChildContent<InputGroupInput>(i => i.Add(x => x.For, () => model.Q).Add(x => x.Id, "speaker-query")));

        Assert.NotNull(cut.Find("input#speaker-query"));
    }

    [Fact]
    public void RzFocusFirstInvalid_renders_a_hidden_marker_with_its_runtime()
    {
        var cut = Render<RzFocusFirstInvalid>();
        var marker = cut.Find("[data-slot='focus-first-invalid']");
        Assert.True(marker.HasAttribute("hidden"));
        Assert.Equal("rzFocusFirstInvalid", marker.GetAttribute("x-data"));
    }
}
