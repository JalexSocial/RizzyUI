
using Bunit;
using Microsoft.Extensions.DependencyInjection;

namespace RizzyUI.Tests.Components.Display;

public class RzIndicatorTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzIndicatorTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_ShowsCorrectStructure()
    {
        // Arrange
        var expectedId = "default-indicator";

        // Act
        var cut = Render<RzIndicator>(parameters => parameters
            .Add(p => p.Id, expectedId)
        );

        // Assert
        var indicator = cut.Find($"div#{expectedId}");
        Assert.NotNull(indicator);
        Assert.Equal("rzIndicator", indicator.GetAttribute("x-data"));
        Assert.Contains("absolute", indicator.ClassList); // Base class
        Assert.Contains("top-0", indicator.ClassList); // Default Position TopEnd
        Assert.Contains("right-0", indicator.ClassList);
    }

    [Theory]
    [InlineData(IndicatorPosition.TopStart, "top-0 left-0")]
    [InlineData(IndicatorPosition.BottomEnd, "bottom-0 right-0")]
    [InlineData(IndicatorPosition.Center, "top-1/2 left-1/2")]
    public void PositionParameter_AppliesCorrectClasses(IndicatorPosition position, string expectedClass)
    {
        // Act
        var cut = Render<RzIndicator>(parameters => parameters
            .Add(p => p.Position, position)
        );

        // Assert
        var indicator = cut.Find("[data-slot='indicator']");
        var classes = expectedClass.Split(' ');
        foreach (var cls in classes)
        {
            Assert.Contains(cls, indicator.ClassList);
        }
    }

    [Theory]
    [InlineData(Size.ExtraSmall, "size-2")]
    [InlineData(Size.Medium, "size-3")]
    [InlineData(Size.ExtraLarge, "size-4")]
    public void SizeParameter_AppliesCorrectClasses(Size size, string expectedClass)
    {
        // Act
        var cut = Render<RzIndicator>(parameters => parameters
            .Add(p => p.Size, size)
        );

        // Assert
        var indicator = cut.Find("[data-slot='indicator']");
        Assert.Contains(expectedClass, indicator.ClassList);
    }

    [Fact]
    public void VisibleParameter_TogglesAttributes()
    {
        // Act
        var cut = Render<RzIndicator>(parameters => parameters
            .Add(p => p.Visible, false)
        );

        // Assert
        var indicator = cut.Find("[data-slot='indicator']");
        Assert.Equal("false", indicator.GetAttribute("data-visible"));
    }

    [Fact]
    public void ColorParameter_AppliesCustomColor()
    {
        // Arrange
        var customColor = Colors.Green.L500;

        // Act
        var cut = Render<RzIndicator>(parameters => parameters
            .Add(p => p.Color, customColor)
        );

        // Assert
        var indicator = cut.Find("[data-slot='indicator']");
        Assert.NotNull(indicator);
    }
}