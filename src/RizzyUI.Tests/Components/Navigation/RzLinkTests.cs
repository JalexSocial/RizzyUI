
using Bunit;

namespace RizzyUI.Tests.Components.Navigation;

public class RzLinkTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzLinkTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_ShowsAnchor()
    {
        // Act
        var cut = Render<RzLink>(parameters => parameters
            .Add(p => p.Href, "/somewhere")
            .AddChildContent("Go")
        );

        // Assert
        var a = cut.Find("a");
        Assert.Equal("/somewhere", a.GetAttribute("href"));
        Assert.Contains("Go", a.TextContent);
        Assert.Contains("text-primary", a.ClassList); // Default color
    }

    [Theory]
    [InlineData(SemanticColor.Secondary, "text-secondary")]
    [InlineData(SemanticColor.Destructive, "text-destructive")]
    public void ColorParameter_AppliesCorrectClasses(SemanticColor color, string expectedClass)
    {
        // Act
        var cut = Render<RzLink>(parameters => parameters
            .Add(p => p.Color, color)
        );

        // Assert
        var a = cut.Find("a");
        Assert.Contains(expectedClass, a.ClassList);
    }

    [Fact]
    public void UnderlineParameter_TogglesClass()
    {
        // Act
        var cut = Render<RzLink>(parameters => parameters
            .Add(p => p.Underline, true)
        );

        // Assert
        var a = cut.Find("a");
        Assert.Contains("hover:underline", a.ClassList);
    }
}