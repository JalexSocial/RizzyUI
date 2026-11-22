using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components;

/// <summary>Decisions D-24, D-25 and D-27: Alpine directives a caller passes to a component.</summary>
public class DirectiveRulesTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public DirectiveRulesTests(WebAppFixture fixture) : base(fixture)
    {
    }

    private static Exception Inner(Exception e) => e.InnerException ?? e;

    [Theory]
    [InlineData("x-data")]
    [InlineData("X-Data")]
    [InlineData("x-init")]
    [InlineData("x-load")]
    [InlineData("x-load-src")]
    public void Reserved_scope_directives_throw_with_guidance(string directive)
    {
        var ex = Inner(Assert.ThrowsAny<Exception>(() => Render<RzDropdownMenu>(p => p.AddUnmatched(directive, "x"))));
        Assert.IsType<InvalidOperationException>(ex);
        Assert.Contains("RzDropdownMenu", ex.Message);
        Assert.Contains("ancestor", ex.Message);
        Assert.Contains("Parent property synchronization", ex.Message);
    }

    [Fact]
    public void Caller_x_on_renders_as_the_shorthand_so_it_runs_alongside_the_components_handler()
    {
        // SF-030: RzToggle's own x-on:click replaced the caller's.
        var cut = Render<RzToggle>(p => p.AddUnmatched("x-on:click", "applyLevels()").AddChildContent("Bold"));
        var button = cut.Find("[data-slot='toggle']");
        Assert.Equal("applyLevels()", button.GetAttribute("@click"));
        Assert.NotNull(button.GetAttribute("x-on:click")); // the component's own handler
    }

    [Fact]
    public void x_model_is_allowed_on_value_components_only()
    {
        // RzColorSwatch turns x-model into a one-way x-effect (RZUI-032).
        var swatch = Render<RzColorSwatch>(p => p.AddUnmatched("x-model", "colorPicker.value"));
        Assert.Equal("setValue(colorPicker.value)", swatch.Find("[x-effect]").GetAttribute("x-effect"));

        var ex = Inner(Assert.ThrowsAny<Exception>(() => Render<RzBadge>(p => p.AddUnmatched("x-model", "value").AddChildContent("New"))));
        Assert.Contains("no model value", ex.Message);
    }

    [Fact]
    public void Visibility_directives_throw_on_components_that_manage_their_visibility()
    {
        var ex = Inner(Assert.ThrowsAny<Exception>(() => Render<CollapsibleContent>(p => p.AddUnmatched("x-show", "open"))));
        Assert.Contains("manages its own visibility", ex.Message);

        // Elsewhere they are allowed.
        var badge = Render<RzBadge>(p => p.AddUnmatched("x-show", "visible").AddChildContent("New"));
        Assert.Equal("visible", badge.Find("[x-show]").GetAttribute("x-show"));
    }

    [Fact]
    public void A_reserved_x_ref_name_throws_and_others_are_kept()
    {
        var ex = Inner(Assert.ThrowsAny<Exception>(() => Render<RzChart>(p => p
            .Add(x => x.Configure, c => c.Data(d => d.Labels("A").Datasets(ds => ds.Bar().Data(1))))
            .AddUnmatched("x-ref", "canvas"))));
        Assert.Contains("x-ref=\"canvas\"", ex.Message);

        var cut = Render<RzChart>(p => p
            .Add(x => x.Configure, c => c.Data(d => d.Labels("A").Datasets(ds => ds.Bar().Data(1))))
            .AddUnmatched("x-ref", "salesChart"));
        Assert.Equal("salesChart", cut.Find("[data-slot='chart']").GetAttribute("x-ref"));
    }

    [Fact]
    public void A_binding_of_a_computed_attribute_is_dropped_and_others_are_kept()
    {
        var cut = Render<RzToggle>(p => p
            .AddUnmatched("x-bind:aria-pressed", "true")
            .AddUnmatched(":data-state", "'on'")
            .AddUnmatched("x-bind:title", "hint")
            .AddChildContent("Bold"));
        var button = cut.Find("[data-slot='toggle']");
        Assert.NotEqual("true", button.GetAttribute("x-bind:aria-pressed"));
        Assert.Null(button.GetAttribute(":data-state"));
        Assert.Equal("hint", button.GetAttribute("x-bind:title"));
    }

    [Fact]
    public void AsChild_forwards_its_own_x_data_to_a_component_child()
    {
        // D-25: RzClipboard's x-data on an RzButton child is the library's, not the caller's.
        RenderFragment child = b =>
        {
            b.OpenComponent<RzButton>(0);
            b.AddComponentParameter(1, "ChildContent", (RenderFragment)(c => c.AddContent(0, "Copy")));
            b.CloseComponent();
        };
        var cut = Render<RzClipboard>(p => p.Add(x => x.AsChild, true).Add(x => x.Value, "hello").Add(x => x.ChildContent, child));

        var button = cut.Find("button");
        Assert.Equal("rzClipboard", button.GetAttribute("x-data"));
        Assert.False(button.HasAttribute(RzDirectiveRules.ForwardedAttribute));
    }
}
