
using AngleSharp;
using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Navigation;

public class RzDropdownMenuTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzDropdownMenuTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RzDropdownMenu_RendersRootWithAlpineData()
    {
        // Arrange
        var id = "dropdown-test";

        // Act
        var cut = RenderComponent<RzDropdownMenu>(parameters => parameters
            .Add(p => p.Id, id)
            .AddChildContent<DropdownMenuTrigger>(t => t.AddChildContent("Open"))
            .AddChildContent<DropdownMenuContent>(c => c.AddChildContent("Items"))
        );

        // Assert
        var root = cut.Find($"div#{id}");
        Assert.Equal("rzDropdownMenu", root.GetAttribute("x-data"));
        Assert.Equal(id, root.GetAttribute("data-alpine-root"));
        Assert.Equal("bottom", root.GetAttribute("data-anchor")); // Default
    }

    [Fact]
    public void DropdownMenuTrigger_RendersCorrectly()
    {
        // Act
        var cut = RenderComponent<RzDropdownMenu>(parameters => parameters
            .AddChildContent<DropdownMenuTrigger>(t => t.AddChildContent("Trigger"))
            .AddChildContent<DropdownMenuContent>(c => c.AddChildContent("Items"))
        );

        // Assert
        var trigger = cut.Find("[data-slot='dropdown-menu-trigger']");
        Assert.Equal("toggle", trigger.GetAttribute("x-on:click"));
        Assert.Equal("menu", trigger.GetAttribute("aria-haspopup"));
    }

    [Fact]
    public void DropdownMenuContent_RendersTeleportTemplate()
    {
        // Act
        var cut = RenderComponent<RzDropdownMenu>(parameters => parameters
            .AddChildContent<DropdownMenuTrigger>(t => t.AddChildContent("Trigger"))
            .AddChildContent<DropdownMenuContent>(c => c.AddChildContent("Item Content"))
        );

        // Assert
        var template = cut.Find("template");
        var html = template.ToHtml();
        Assert.Equal("body", template.GetAttribute("x-teleport"));
        Assert.Contains("Item Content", html);
        Assert.Contains("data-slot=\"dropdown-menu-content\"", html);
    }

    [Fact]
    public void IsModalParameter_SetsDataAttribute()
    {
        // Act
        var cut = RenderComponent<RzDropdownMenu>(parameters => parameters
            .Add(p => p.IsModal, true)
            .AddChildContent<DropdownMenuTrigger>(t => t.AddChildContent("Trigger"))
            .AddChildContent<DropdownMenuContent>(c => c.AddChildContent("Items"))
        );

        // Assert
        var root = cut.Find("[data-slot='dropdown-menu']");
        Assert.Equal("true", root.GetAttribute("data-modal"));
    }
}