
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
        var cut = Render<RzSpinner>();

        // Assert
        var svg = cut.Find("svg");
        Assert.NotNull(svg);
        Assert.Contains("motion-safe:animate-spin", svg.ClassList);
    }

    [Fact]
    public void StatusRoleAndNameAreExposedOnTheWrapper()
    {
        // RZUI-047: role="status" and aria-label were on an aria-hidden svg, so the status was
        // never announced.
        var cut = Render<RzSpinner>(p => p.Add(x => x.AriaLabel, "Saving"));

        var status = cut.Find("[data-slot='spinner']");
        Assert.Equal("status", status.GetAttribute("role"));
        Assert.Equal("Saving", status.GetAttribute("aria-label"));

        var svg = cut.Find("svg");
        Assert.Equal("true", svg.GetAttribute("aria-hidden"));
        Assert.Null(svg.GetAttribute("role"));
        Assert.Null(svg.GetAttribute("aria-label"));
    }

    [Fact]
    public void CallerCanOverrideTheRole()
    {
        var cut = Render<RzSpinner>(p => p.AddUnmatched("role", "img"));

        Assert.Equal("img", cut.Find("[data-slot='spinner']").GetAttribute("role"));
    }

    [Theory]
    [InlineData(Size.Small, "size-5")]
    [InlineData(Size.Large, "size-7")]
    public void SizeParameter_AppliesCorrectClasses(Size size, string expectedClass)
    {
        // Act
        var cut = Render<RzSpinner>(parameters => parameters
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
        var cut = Render<RzSpinner>(parameters => parameters
            .Add(p => p.Color, color)
        );

        // Assert
        var svg = cut.Find("svg");
        Assert.Contains(expectedClass, svg.ClassList);
    }
}