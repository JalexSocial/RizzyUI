
using Bunit;
using Blazicons;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Display;

public class RzBadgeTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzBadgeTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_ShowsCorrectStructure()
    {
        // Arrange
        var expectedId = "default-badge";

        // Act
        var cut = Render<RzBadge>(parameters => parameters
            .Add(p => p.Id, expectedId)
            .Add(p => p.Label, "Badge Text")
        );

        // Assert
        var badge = cut.Find($"span#{expectedId}");
        Assert.NotNull(badge);
        Assert.Contains("Badge Text", badge.TextContent);
        // Default variant
        Assert.Contains("bg-input", badge.ClassList);
        Assert.Contains("text-foreground", badge.ClassList);
    }

    [Theory]
    [InlineData(ThemeVariant.Primary, "bg-primary")]
    [InlineData(ThemeVariant.Secondary, "bg-secondary")]
    [InlineData(ThemeVariant.Destructive, "bg-destructive")]
    [InlineData(ThemeVariant.Success, "bg-success")]
    public void VariantParameter_AppliesCorrectClasses(ThemeVariant variant, string expectedClass)
    {
        // Act
        var cut = Render<RzBadge>(parameters => parameters
            .Add(p => p.Variant, variant)
        );

        // Assert
        var badge = cut.Find("[data-slot='badge']");
        Assert.Contains(expectedClass, badge.ClassList);
    }

    [Fact]
    public void SoftParameter_AppliesSoftClasses()
    {
        // Act
        var cut = Render<RzBadge>(parameters => parameters
            .Add(p => p.Variant, ThemeVariant.Primary)
            .Add(p => p.Soft, true)
        );

        // Assert
        var badge = cut.Find("[data-slot='badge']");
        // Soft primary usually implies lighter bg and text
        Assert.Contains("bg-primary/10", badge.ClassList);
        Assert.Contains("text-primary", badge.ClassList);
    }

    [Fact]
    public void IconParameter_RendersIcon()
    {
        // Act
        var cut = Render<RzBadge>(parameters => parameters
            .Add(p => p.Icon, MdiIcon.Check)
        );

        // Assert
        var svg = cut.Find("svg");
        Assert.NotNull(svg);
    }
}