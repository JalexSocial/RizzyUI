
using Bunit;
using System.Globalization;

namespace RizzyUI.Tests.Components.Layout;

public class RzAspectRatioTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzAspectRatioTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_ShowsCorrectStructureWithAlpine()
    {
        // Arrange
        var id = "aspect-test";

        // Act
        var cut = Render<RzAspectRatio>(parameters => parameters
            .Add(p => p.Id, id)
            .Add(p => p.Ratio, 16.0 / 9.0)
            .AddChildContent("Content")
        );

        // Assert
        var root = cut.Find($"[data-slot='aspect-ratio-wrapper']");
        Assert.Equal("rzAspectRatio", root.GetAttribute("x-data"));
        Assert.Equal(id, root.GetAttribute("data-alpine-root"));

        // Check ratio formatting
        var expectedRatio = (16.0 / 9.0).ToString(CultureInfo.InvariantCulture);
        Assert.Equal(expectedRatio, root.GetAttribute("data-ratio"));

        Assert.Contains("Content", cut.Find("[data-slot='aspect-ratio-inner']").InnerHtml);
    }
}