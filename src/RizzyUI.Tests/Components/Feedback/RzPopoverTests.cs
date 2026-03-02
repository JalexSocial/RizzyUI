using Bunit;

namespace RizzyUI.Tests.Components.Feedback;

public class RzPopoverTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzPopoverTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RzPopover_RendersRootWithAlpineData()
    {
        var id = "popover-test";

        var cut = Render<RzPopover>(parameters => parameters
            .Add(p => p.Id, id)
            .AddChildContent<PopoverTrigger>(t => t.AddChildContent("Open"))
            .AddChildContent<PopoverContent>(c => c.AddChildContent("Content"))
        );

        var root = cut.Find($"div#{id}");
        Assert.Equal("rzPopover", root.GetAttribute("x-data"));
        Assert.Equal(id, root.GetAttribute("data-alpine-root"));
        Assert.Equal($"{id}-content", root.GetAttribute("data-content-id"));
    }

    [Theory]
    [InlineData(AnchorPoint.Top, "top")]
    [InlineData(AnchorPoint.BottomEnd, "bottom-end")]
    [InlineData(AnchorPoint.LeftStart, "left-start")]
    public void AnchorParameter_SetsDataAttribute(AnchorPoint anchor, string expectedValue)
    {
        var cut = Render<RzPopover>(parameters => parameters
            .Add(p => p.Anchor, anchor)
            .AddChildContent<PopoverTrigger>(t => t.AddChildContent("Open"))
            .AddChildContent<PopoverContent>(c => c.AddChildContent("Content"))
        );

        var root = cut.Find("[data-slot='popover']");
        Assert.Equal(expectedValue, root.GetAttribute("data-anchor"));
    }

    [Fact]
    public void OffsetParameter_SetsDataAttribute()
    {
        var cut = Render<RzPopover>(parameters => parameters
            .Add(p => p.Offset, 10)
            .AddChildContent<PopoverTrigger>(t => t.AddChildContent("Open"))
            .AddChildContent<PopoverContent>(c => c.AddChildContent("Content"))
        );

        var root = cut.Find("[data-slot='popover']");
        Assert.Equal("10", root.GetAttribute("data-offset"));
    }

    [Fact]
    public void PopoverTrigger_RendersButtonWithEvents()
    {
        var cut = Render<RzPopover>(parameters => parameters
            .AddChildContent<PopoverTrigger>(t => t.AddChildContent("Trigger"))
            .AddChildContent<PopoverContent>(c => c.AddChildContent("Content"))
        );

        var btn = cut.Find("button[data-slot='popover-trigger']");
        Assert.Equal("toggle", btn.GetAttribute("x-on:click"));
        Assert.Equal("dialog", btn.GetAttribute("aria-haspopup"));
        Assert.Equal("true", btn.GetAttribute("data-trigger"));
    }

    [Fact]
    public void PopoverContent_RendersInsideTeleportTemplate()
    {
        var cut = Render<RzPopover>(parameters => parameters
            .AddChildContent<PopoverTrigger>(t => t.AddChildContent("Trigger"))
            .AddChildContent<PopoverContent>(c => c.AddChildContent("Popup Content"))
        );

        var template = cut.Find("template[x-teleport='body']");
        Assert.Equal("contentTemplate", template.GetAttribute("x-ref"));

        Assert.Contains("x-show=\"open\"", cut.Markup);
        Assert.Contains("x-bind:data-state=\"dataState\"", cut.Markup);
        Assert.DoesNotContain("open ? 'open' : 'closed'", cut.Markup);
        Assert.DoesNotContain("x-ref=\"content\"", cut.Markup);
        Assert.DoesNotContain("aria-modal", cut.Markup);
        Assert.Contains("Popup Content", cut.Markup);
    }
}
