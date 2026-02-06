
using Bunit;

namespace RizzyUI.Tests.Components.Feedback;

public class RzSpinnerTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzSpinnerTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_ShowsSVG()
    {
        // Act
        var cut = RenderComponent<RzSpinner>();

        // Assert
        var svg = cut.Find("svg");
        Assert.NotNull(svg);
        Assert.Contains("motion-safe:animate-spin", svg.ClassList);
        Assert.Equal("status", svg.GetAttribute("role"));
    }

    [Theory]
    [InlineData(Size.Small, "size-5")]
    [InlineData(Size.Large, "size-7")]
    public void SizeParameter_AppliesCorrectClasses(Size size, string expectedClass)
    {
        // Act
        var cut = RenderComponent<RzSpinner>(parameters => parameters
            .Add(p => p.Size, size)
        );

        // Assert
        var svg = cut.Find("svg");
        Assert.Contains(expectedClass, svg.ClassList);
    }

    [Theory]
    [InlineData(SemanticColor.Primary, "fill-primary")]
    [InlineData(SemanticColor.Destructive, "fill-destructive")]
    public void ColorParameter_AppliesCorrectClasses(SemanticColor color, string expectedClass)
    {
        // Act
        var cut = RenderComponent<RzSpinner>(parameters => parameters
            .Add(p => p.Color, color)
        );

        // Assert
        var svg = cut.Find("svg");
        Assert.Contains(expectedClass, svg.ClassList);
    }
}