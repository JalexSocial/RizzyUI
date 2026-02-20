
using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Layout;

public class RzCollapsibleTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzCollapsibleTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RzCollapsible_RendersWithAlpineAttributes()
    {
        // Arrange
        var id = "collapsible-test";

        // Act
        var cut = Render<RzCollapsible>(parameters => parameters
            .Add(p => p.Id, id)
            .AddChildContent<CollapsibleTrigger>(t => t.AddChildContent("Toggle"))
            .AddChildContent<CollapsibleContent>(c => c.AddChildContent("Content"))
        );

        // Assert
        var root = cut.Find("[data-slot='collapsible']");
        Assert.Equal("rzCollapsible", root.GetAttribute("x-data"));
        Assert.Equal(id, root.GetAttribute("data-alpine-root"));
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public void DefaultOpenParameter_SetsDataAttribute(bool defaultOpen)
    {
        // Act
        var cut = Render<RzCollapsible>(parameters => parameters
            .Add(p => p.DefaultOpen, defaultOpen)
            .AddChildContent<CollapsibleTrigger>(t => t.AddChildContent("Toggle"))
            .AddChildContent<CollapsibleContent>(c => c.AddChildContent("Content"))
        );

        // Assert
        var root = cut.Find("[data-slot='collapsible']");
        Assert.Equal(defaultOpen.ToString().ToLowerInvariant(), root.GetAttribute("data-default-open"));
    }

    [Fact]
    public void CollapsibleTrigger_RendersButtonWithToggle()
    {
        // Act
        var cut = Render<RzCollapsible>(parameters => parameters
            .AddChildContent<CollapsibleTrigger>(t => t.AddChildContent("Toggle"))
            .AddChildContent<CollapsibleContent>(c => c.AddChildContent("Content"))
        );

        // Assert
        var btn = cut.Find("[data-slot='collapsible-trigger']");
        Assert.Equal("toggle", btn.GetAttribute("x-on:click"));
        Assert.Equal("isOpen", btn.GetAttribute("x-bind:aria-expanded"));
    }

    [Fact]
    public void CollapsibleContent_RendersWithCollapseDirective()
    {
        // Act
        var cut = Render<RzCollapsible>(parameters => parameters
            .AddChildContent<CollapsibleTrigger>(t => t.AddChildContent("Toggle"))
            .AddChildContent<CollapsibleContent>(c => c.AddChildContent("Content"))
        );

        // Assert
        var content = cut.Find("[data-slot='collapsible-content']");
        Assert.True(content.HasAttribute("x-collapse"));
        Assert.Equal("isOpen", content.GetAttribute("x-show"));
    }
}