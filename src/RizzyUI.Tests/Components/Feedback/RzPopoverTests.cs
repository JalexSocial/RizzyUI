
using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Feedback;

public class RzPopoverTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzPopoverTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RzPopover_RendersRootWithAlpineData()
    {
        // Arrange
        var id = "popover-test";

        // Act
        var cut = RenderComponent<RzPopover>(parameters => parameters
            .Add(p => p.Id, id)
            .AddChildContent<PopoverTrigger>(t => t.AddChildContent("Open"))
            .AddChildContent<PopoverContent>(c => c.AddChildContent("Content"))
        );

        // Assert
        var root = cut.Find($"div#{id}");
        Assert.Equal("rzPopover", root.GetAttribute("x-data"));
        Assert.Equal(id, root.GetAttribute("data-alpine-root"));
    }

    [Theory]
    [InlineData(AnchorPoint.Top, "top")]
    [InlineData(AnchorPoint.BottomEnd, "bottom-end")]
    [InlineData(AnchorPoint.LeftStart, "left-start")]
    public void AnchorParameter_SetsDataAttribute(AnchorPoint anchor, string expectedValue)
    {
        // Act
        var cut = RenderComponent<RzPopover>(parameters => parameters
            .Add(p => p.Anchor, anchor)
            .AddChildContent<PopoverTrigger>(t => t.AddChildContent("Open"))
            .AddChildContent<PopoverContent>(c => c.AddChildContent("Content"))
        );

        // Assert
        var root = cut.Find("[data-slot='popover']");
        Assert.Equal(expectedValue, root.GetAttribute("data-anchor"));
    }

    [Fact]
    public void OffsetParameter_SetsDataAttribute()
    {
        // Act
        var cut = RenderComponent<RzPopover>(parameters => parameters
            .Add(p => p.Offset, 10)
            .AddChildContent<PopoverTrigger>(t => t.AddChildContent("Open"))
            .AddChildContent<PopoverContent>(c => c.AddChildContent("Content"))
        );

        // Assert
        var root = cut.Find("[data-slot='popover']");
        Assert.Equal("10", root.GetAttribute("data-offset"));
    }

    [Fact]
    public void PopoverTrigger_RendersButtonWithEvents()
    {
        // Act
        var cut = RenderComponent<RzPopover>(parameters => parameters
            .AddChildContent<PopoverTrigger>(t => t.AddChildContent("Trigger"))
            .AddChildContent<PopoverContent>(c => c.AddChildContent("Content"))
        );

        // Assert
        var btn = cut.Find("button[data-slot='popover-trigger']");
        Assert.Equal("toggle", btn.GetAttribute("x-on:click"));
        Assert.Equal("dialog", btn.GetAttribute("aria-haspopup"));
    }

    [Fact]
    public void PopoverContent_RendersWithAlpineDirectives()
    {
        // Act
        var cut = RenderComponent<RzPopover>(parameters => parameters
            .AddChildContent<PopoverTrigger>(t => t.AddChildContent("Trigger"))
            .AddChildContent<PopoverContent>(c => c.AddChildContent("Popup Content"))
        );

        // Assert
        var content = cut.Find("[data-slot='popover-content']");
        Assert.NotNull(content);
        Assert.Equal("open", content.GetAttribute("x-show"));
        Assert.Contains("Popup Content", content.InnerHtml);
    }
}