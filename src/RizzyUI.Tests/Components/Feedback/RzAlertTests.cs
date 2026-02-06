
using Bunit;
using Blazicons;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Feedback;

public class RzAlertTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzAlertTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_ShowsCorrectStructureWithAlpine()
    {
        // Arrange
        var id = "alert-test";

        // Act
        var cut = RenderComponent<RzAlert>(parameters => parameters
            .Add(p => p.Id, id)
            .AddChildContent("Alert Content")
        );

        // Assert
        var root = cut.Find("[data-slot='alert']");
        var alpineDiv = root.FirstElementChild;
        Assert.Equal("rzAlert", alpineDiv.GetAttribute("x-data"));
        Assert.Equal(id, alpineDiv.GetAttribute("data-alpine-root"));
        Assert.Contains("Alert Content", alpineDiv.InnerHtml);
    }

    [Theory]
    [InlineData(ThemeVariant.Information, "border-info")]
    [InlineData(ThemeVariant.Destructive, "border-destructive")]
    [InlineData(ThemeVariant.Success, "border-success")]
    public void VariantParameter_AppliesCorrectClasses(ThemeVariant variant, string expectedClass)
    {
        // Act
        var cut = RenderComponent<RzAlert>(parameters => parameters
            .Add(p => p.Variant, variant)
        );

        // Assert
        var root = cut.Find("[data-slot='alert']");
        Assert.Contains(expectedClass, root.ClassList);
    }

    [Fact]
    public void Dismissable_RendersCloseButton()
    {
        // Act
        var cut = RenderComponent<RzAlert>(parameters => parameters
            .Add(p => p.Dismissable, true)
        );

        // Assert
        Assert.NotNull(cut.Find("button[data-slot='alert-close-button']"));
    }

    [Fact]
    public void Pulse_RendersPulseElement()
    {
        // Act
        var cut = RenderComponent<RzAlert>(parameters => parameters
            .Add(p => p.Icon, MdiIcon.Home)
            .Add(p => p.Pulse, true)
        );

        // Assert
        Assert.NotNull(cut.Find("[data-slot='alert-icon-pulse']"));
    }
}