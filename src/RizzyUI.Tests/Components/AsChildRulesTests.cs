using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components;

/// <summary>Decisions D-25 (AsChild follows D-24) and D-26 (AsChild children keep their ids).</summary>
public class AsChildRulesTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public AsChildRulesTests(WebAppFixture fixture) : base(fixture)
    {
    }

    private IRenderedComponent<RzPopover> RenderPopover(string triggerChildMarkup) =>
        Render<RzPopover>(p => p
            .Add(x => x.Id, "share-popover")
            .AddChildContent<PopoverTrigger>(t => t.Add(x => x.AsChild, true).AddChildContent(triggerChildMarkup))
            .AddChildContent<PopoverContent>(c => c.AddChildContent("Content")));

    private static Exception Inner(Exception e) => e.InnerException ?? e;

    [Theory]
    [InlineData("<button x-data=\"{ n: 0 }\">Share</button>")]
    [InlineData("<button x-init=\"track()\">Share</button>")]
    public void A_markup_child_that_declares_its_own_scope_throws(string child)
    {
        var ex = Inner(Assert.ThrowsAny<Exception>(() => RenderPopover(child)));
        Assert.Contains("PopoverTrigger AsChild", ex.Message);
        Assert.Contains("ancestor", ex.Message);
    }

    [Fact]
    public void An_element_child_that_declares_its_own_scope_throws()
    {
        RenderFragment child = b =>
        {
            b.OpenElement(0, "button");
            b.AddAttribute(1, "x-data", "{ n: 0 }");
            b.AddContent(2, "Share");
            b.CloseElement();
        };
        var ex = Inner(Assert.ThrowsAny<Exception>(() => Render<RzPopover>(p => p
            .AddChildContent<PopoverTrigger>(t => t.Add(x => x.AsChild, true).Add(x => x.ChildContent, child)))));
        Assert.Contains("x-data", ex.Message);
    }

    [Fact]
    public void The_childs_handler_runs_alongside_the_triggers()
    {
        // The trigger's own handler goes on in @click form; the child's x-on:click stays.
        var cut = RenderPopover("<button x-on:click=\"track()\">Share</button>");
        var button = cut.Find("button");
        Assert.Equal("track()", button.GetAttribute("x-on:click"));
        Assert.NotNull(button.GetAttribute("@click"));
    }

    [Fact]
    public void A_binding_the_trigger_computes_wins_over_the_childs()
    {
        RenderFragment child = b =>
        {
            b.OpenElement(0, "button");
            b.AddAttribute(1, "x-bind:aria-expanded", "'false'");
            b.AddContent(2, "Share");
            b.CloseElement();
        };
        var cut = Render<RzPopover>(p => p
            .AddChildContent<PopoverTrigger>(t => t.Add(x => x.AsChild, true).Add(x => x.ChildContent, child)));

        Assert.Equal("ariaExpanded", cut.Find("button").GetAttribute("x-bind:aria-expanded"));
    }

    [Fact]
    public void A_child_id_is_kept_and_the_content_references_it()
    {
        // D-26: aria-labelledby pointed at "{popover}-trigger" although the trigger was "share".
        var cut = RenderPopover("<button id=\"share\">Share</button>");
        Assert.Equal("share", cut.Find("button").GetAttribute("id"));
        // The content sits in the teleport <template>, which selectors do not search: check the markup.
        Assert.Contains("aria-labelledby=\"share\"", cut.Markup);
    }

    [Fact]
    public void Without_a_child_id_the_generated_trigger_id_is_used()
    {
        var cut = RenderPopover("<button>Share</button>");
        Assert.Equal("share-popover-trigger", cut.Find("button").GetAttribute("id"));
        Assert.Contains("aria-labelledby=\"share-popover-trigger\"", cut.Markup);
    }

    [Fact]
    public void A_tabs_trigger_child_id_is_referenced_by_its_panel()
    {
        var cut = Render<RzTabs>(p => p
            .Add(x => x.DefaultValue, "one")
            .AddChildContent<TabsList>(l => l.AddChildContent<TabsTrigger>(t => t
                .Add(x => x.Value, "one").Add(x => x.AsChild, true).AddChildContent("<button id=\"first-tab\">One</button>")))
            .AddChildContent<TabsContent>(c => c.Add(x => x.Value, "one").AddChildContent("Panel")));

        Assert.Equal("first-tab", cut.Find("[data-slot='tabs-content']").GetAttribute("aria-labelledby"));
    }
}
