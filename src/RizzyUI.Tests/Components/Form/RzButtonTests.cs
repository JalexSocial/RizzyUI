
using Bunit;

namespace RizzyUI.Tests.Components.Form;

public class RzButtonTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzButtonTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_ShowsButton()
    {
        // Act
        var cut = RenderComponent<RzButton>(parameters => parameters
            .Add(p => p.Label, "Click Me")
        );

        // Assert
        var btn = cut.Find("button[data-slot='button']");
        Assert.Contains("Click Me", btn.TextContent);
        // Default variant
        Assert.Contains("bg-input", btn.ClassList); // Default variant style
    }

    [Theory]
    [InlineData(ThemeVariant.Primary, "bg-primary")]
    [InlineData(ThemeVariant.Destructive, "bg-destructive")]
    public void VariantParameter_AppliesCorrectClasses(ThemeVariant variant, string expectedClass)
    {
        // Act
        var cut = RenderComponent<RzButton>(parameters => parameters
            .Add(p => p.Variant, variant)
        );

        // Assert
        var btn = cut.Find("button");
        Assert.Contains(expectedClass, btn.ClassList);
    }

    [Theory]
    [InlineData(Size.Small, "h-8")]
    [InlineData(Size.Large, "h-10")]
    public void SizeParameter_AppliesCorrectClasses(Size size, string expectedClass)
    {
        // Act
        var cut = RenderComponent<RzButton>(parameters => parameters
            .Add(p => p.Size, size)
        );

        // Assert
        var btn = cut.Find("button");
        Assert.Contains(expectedClass, btn.ClassList);
    }

    [Fact]
    public void OutlineParameter_AppliesOutlineClasses()
    {
        // Act
        var cut = RenderComponent<RzButton>(parameters => parameters
            .Add(p => p.Variant, ThemeVariant.Primary)
            .Add(p => p.Outline, true)
        );

        // Assert
        var btn = cut.Find("button");
        Assert.Contains("border-primary", btn.ClassList);
        Assert.Contains("bg-transparent", btn.ClassList);
    }
}