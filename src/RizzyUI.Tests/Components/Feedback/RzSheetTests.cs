
using Bunit;
using Microsoft.AspNetCore.Components;
using AngleSharp;

namespace RizzyUI.Tests.Components.Feedback;

public class RzSheetTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzSheetTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RzSheet_RendersRootWithAlpineData()
    {
        // Arrange
        var id = "sheet-test";

        // Act
        var cut = RenderComponent<RzSheet>(parameters => parameters
            .Add(p => p.Id, id)
            .AddChildContent<SheetTrigger>(t => t.AddChildContent("Open"))
            .AddChildContent<SheetContent>(c => c.AddChildContent("Content"))
        );

        // Assert
        var root = cut.Find($"div#{id}");
        Assert.Equal("rzSheet", root.GetAttribute("x-data"));
        Assert.Equal(id, root.GetAttribute("data-alpine-root"));
    }

    [Fact]
    public void DefaultOpenParameter_SetsDataAttribute()
    {
        // Act
        var cut = RenderComponent<RzSheet>(parameters => parameters
            .Add(p => p.DefaultOpen, true)
            .AddChildContent<SheetTrigger>(t => t.AddChildContent("Open"))
            .AddChildContent<SheetContent>(c => c.AddChildContent("Content"))
        );

        // Assert
        var root = cut.Find("[data-slot='sheet']");
        Assert.Equal("true", root.GetAttribute("data-default-open"));
    }

    [Theory]
    [InlineData(SheetSide.Left, "slide-in-from-left")]
    [InlineData(SheetSide.Right, "slide-in-from-right")]
    [InlineData(SheetSide.Top, "slide-in-from-top")]
    [InlineData(SheetSide.Bottom, "slide-in-from-bottom")]
    public void SheetContent_SideParameter_AppliesCorrectAnimationClasses(SheetSide side, string expectedClassSegment)
    {
        // Act
        var cut = RenderComponent<RzSheet>(parameters => parameters
            .AddChildContent<SheetTrigger>(t => t.AddChildContent("Open"))
            .AddChildContent<SheetContent>(c => c
                .Add(p => p.Side, side)
                .AddChildContent("Content")
            )
        );

        // Assert
        // SheetContent renders via <template>, so we check the inner HTML
        var template = cut.Find("template");
        Assert.Contains(expectedClassSegment, template?.ToHtml() ?? "");
    }

    [Fact]
    public void SheetTrigger_RendersButtonWithEvents()
    {
        // Act
        var cut = RenderComponent<RzSheet>(parameters => parameters
            .AddChildContent<SheetTrigger>(t => t.AddChildContent("Trigger"))
            .AddChildContent<SheetContent>(c => c.AddChildContent("Content"))
        );

        // Assert
        var btn = cut.Find("button[data-slot='sheet-trigger']");
        Assert.Equal("show", btn.GetAttribute("x-on:click"));
    }

    [Fact]
    public void SheetClose_RendersButtonWithCloseEvent()
    {
        // Act
        var cut = RenderComponent<RzSheet>(parameters => parameters
            .AddChildContent<SheetTrigger>(t => t.AddChildContent("Trigger"))
            .AddChildContent<SheetContent>(c => c
                .AddChildContent<SheetClose>(close => close.AddChildContent("Close"))
            )
        );

        // Assert
        var template = cut.Find("template").ToHtml() ?? "";
        // We verify the raw markup inside the template for the close button
        Assert.Contains("x-on:click=\"close\"", template);
        Assert.Contains("data-slot=\"sheet-close\"", template);
    }
}