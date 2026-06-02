using Bunit;

namespace RizzyUI.Tests.Components.Feedback;

public class RzTooltipTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzTooltipTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void RzTooltip_RendersRootSlotAndAlpineAttributes()
    {
        var cut = Render<RzTooltip>(p => p
            .Add(x => x.Anchor, AnchorPoint.BottomEnd)
            .Add(x => x.Open, true)
            .AddChildContent<TooltipTrigger>(t => t.AddChildContent("Info"))
            .AddChildContent<TooltipContent>(c => c.AddChildContent("Help text")));

        var root = cut.Find("[data-slot='tooltip']");
        Assert.Equal("rzTooltip", root.GetAttribute("x-data"));
        Assert.Equal("bottom-end", root.GetAttribute("data-anchor"));
        Assert.Equal("true", root.GetAttribute("data-open"));
        Assert.Equal("true", root.GetAttribute("data-open-controlled"));
    }

    [Fact]
    public void RzTooltip_TriggerAndContentExposeAccessibilityMarkup()
    {
        var cut = Render<RzTooltip>(p => p
            .AddChildContent<TooltipTrigger>(t => t.AddChildContent("Trigger"))
            .AddChildContent<TooltipContent>(c => c.AddChildContent("Tooltip content")));

        var trigger = cut.Find("[data-slot='tooltip-trigger']");
        var content = cut.Find("[data-slot='tooltip-content']");

        Assert.Equal("button", trigger.TagName.ToLowerInvariant());
        Assert.Equal("tooltip", content.GetAttribute("role"));
        Assert.Equal("closed", content.GetAttribute("data-state"));
        Assert.Equal("true", content.GetAttribute("aria-hidden"));
        Assert.Equal("ariaHidden", content.GetAttribute("x-bind:aria-hidden"));
        Assert.Equal(content.Id, trigger.GetAttribute("aria-describedby"));
        Assert.Equal(content.Id, trigger.GetAttribute("aria-controls"));
        Assert.Equal(trigger.Id, content.GetAttribute("aria-labelledby"));
        Assert.Null(content.GetAttribute("tabindex"));
    }

    [Fact]
    public void RzTooltip_RendersHoverFocusAndKeyboardRuntimeHooks()
    {
        var cut = Render<RzTooltip>(p => p
            .AddChildContent<TooltipTrigger>(t => t.AddChildContent("Trigger"))
            .AddChildContent<TooltipContent>(c => c.AddChildContent("Tooltip content")));

        var trigger = cut.Find("[data-slot='tooltip-trigger']");
        var content = cut.Find("[data-slot='tooltip-content']");

        Assert.Equal("trigger", trigger.GetAttribute("x-ref"));
        Assert.Equal("content", content.GetAttribute("x-ref"));
        Assert.Equal("state", trigger.GetAttribute("x-bind:data-state"));
        Assert.Equal("state", content.GetAttribute("x-bind:data-state"));
    }

    [Fact]
    public void RzTooltip_DisableHoverableContentConfigurationRendersForRuntime()
    {
        var cut = Render<RzTooltip>(p => p
            .Add(x => x.DisableHoverableContent, true)
            .AddChildContent<TooltipTrigger>(t => t.AddChildContent("Trigger"))
            .AddChildContent<TooltipContent>(c => c.AddChildContent("Tooltip content")));

        var root = cut.Find("[data-slot='tooltip']");

        Assert.Equal("true", root.GetAttribute("data-disable-hoverable-content"));
    }

    [Fact]
    public void RzTooltip_PreservesRootAriaLabel()
    {
        var cut = Render<RzTooltip>(p => p
            .Add(x => x.AriaLabel, "Tooltip help")
            .AddChildContent<TooltipTrigger>(t => t.AddChildContent("Trigger"))
            .AddChildContent<TooltipContent>(c => c.AddChildContent("Tooltip content")));

        var root = cut.Find("[data-slot='tooltip']");

        Assert.Equal("Tooltip help", root.GetAttribute("aria-label"));
    }

    [Fact]
    public void RzTooltip_DefaultOpenUncontrolledStateRenders()
    {
        var cut = Render<RzTooltip>(p => p
            .Add(x => x.DefaultOpen, true)
            .AddChildContent<TooltipTrigger>(t => t.AddChildContent("A"))
            .AddChildContent<TooltipContent>(c => c.AddChildContent("B")));

        var root = cut.Find("[data-slot='tooltip']");
        Assert.Equal("true", root.GetAttribute("data-default-open"));
        Assert.Equal("true", root.GetAttribute("data-open"));
        Assert.Equal("false", root.GetAttribute("data-open-controlled"));
    }
}
