
using Bunit;
using System.Globalization;

namespace RizzyUI.Tests.Components.Layout;

public class RzAspectRatioTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzAspectRatioTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_ShouldHaveSquareAspectRatioAndAlpineAttributes()
    {
        // Arrange
        var expectedId = "aspect-ratio-default";
        var childContent = "<div>Test Content</div>";

        // Act
        var cut = RenderComponent<RzAspectRatio>(parameters => parameters
            .Add(p => p.Id, expectedId)
            .AddChildContent(childContent)
        );

        // Assert
        var wrapper = cut.Find($"div#{expectedId}");
        Assert.NotNull(wrapper);
        Assert.Contains("relative", wrapper.ClassList);
        Assert.Contains("w-full", wrapper.ClassList);
        
        // Verify Alpine attributes for CSP compliance
        Assert.Equal("rzAspectRatio", wrapper.GetAttribute("x-data"));
        Assert.Equal(expectedId, wrapper.GetAttribute("data-alpine-root"));
        Assert.Equal("1", wrapper.GetAttribute("data-ratio"));

        var inner = cut.Find($"div#{expectedId} > div");
        Assert.NotNull(inner);
        Assert.Contains("absolute", inner.ClassList);
        Assert.Contains("inset-0", inner.ClassList);
        Assert.Equal(childContent, inner.InnerHtml);
    }

    [Theory]
    [InlineData(16.0 / 9.0)]
    [InlineData(4.0 / 3.0)]
    [InlineData(1.0 / 1.0)]
    [InlineData(2.0 / 1.0)]
    public void CustomRatio_ShouldPassCorrectDataRatioAttribute(double ratio)
    {
        // Arrange
        var expectedId = "aspect-ratio-custom";

        // Act
        var cut = RenderComponent<RzAspectRatio>(parameters => parameters
            .Add(p => p.Id, expectedId)
            .Add(p => p.Ratio, ratio)
        );

        // Assert
        var wrapper = cut.Find($"div#{expectedId}");
        Assert.Equal(ratio.ToString(CultureInfo.InvariantCulture), wrapper.GetAttribute("data-ratio"));
    }

    [Fact]
    public void AdditionalAttributes_ShouldBeAppliedToWrapper()
    {
        // Arrange
        var expectedId = "aspect-ratio-attrs";
        var customClass = "my-custom-class";
        var dataTestId = "test-aspect-ratio";

        // Act
        var cut = RenderComponent<RzAspectRatio>(parameters => parameters
            .Add(p => p.Id, expectedId)
            .AddUnmatched("class", customClass)
            .AddUnmatched("data-testid", dataTestId)
        );

        // Assert
        var wrapper = cut.Find($"div#{expectedId}");
        Assert.Contains(customClass, wrapper.ClassList);
        Assert.Equal(dataTestId, wrapper.GetAttribute("data-testid"));
    }
}