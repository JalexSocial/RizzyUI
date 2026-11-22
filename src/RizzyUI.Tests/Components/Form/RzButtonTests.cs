
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
        var cut = Render<RzButton>(parameters => parameters
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
        var cut = Render<RzButton>(parameters => parameters
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
        var cut = Render<RzButton>(parameters => parameters
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
        var cut = Render<RzButton>(parameters => parameters
            .Add(p => p.Variant, ThemeVariant.Primary)
            .Add(p => p.Outline, true)
        );

        // Assert
        var btn = cut.Find("button");
        Assert.Contains("border-primary", btn.ClassList);
        Assert.Contains("bg-transparent", btn.ClassList);
    }

    [Fact]
    public void ButtonWithVisibleText_HasNoGenericAriaLabel()
    {
        // A generic default aria-label ("Action Button") replaced the visible text as the
        // accessible name (WCAG 2.5.3 Label in Name). The visible text must name the button.
        var cut = Render<RzButton>(parameters => parameters.Add(p => p.Label, "Save changes"));

        var btn = cut.Find("button");
        Assert.Null(btn.GetAttribute("aria-label"));
        Assert.Equal("Save changes", btn.TextContent.Trim());
    }

    [Fact]
    public void AssistiveLabel_IsRenderedAsAriaLabel()
    {
        var cut = Render<RzButton>(parameters => parameters.Add(p => p.AssistiveLabel, "Close panel"));

        Assert.Equal("Close panel", cut.Find("button").GetAttribute("aria-label"));
    }

    [Fact]
    public void AriaLabelAttribute_IsNotOverwritten()
    {
        var cut = Render<RzButton>(parameters => parameters
            .AddUnmatched("aria-label", "Delete item")
            .Add(p => p.Label, "×"));

        Assert.Equal("Delete item", cut.Find("button").GetAttribute("aria-label"));
    }

    [Fact]
    public void AssistiveLabel_TakesPrecedenceOverAriaLabelAttribute()
    {
        var cut = Render<RzButton>(parameters => parameters
            .AddUnmatched("aria-label", "From attribute")
            .Add(p => p.AssistiveLabel, "From parameter"));

        Assert.Equal("From parameter", cut.Find("button").GetAttribute("aria-label"));
    }
    [Fact]
    public void AsChild_RendersTheChildWithTheButtonStyling()
    {
        // Summit SF-018: <RzButton AsChild><a href> rendered a link inside a button.
        var cut = Render<RzButton>(p => p
            .Add(x => x.AsChild, true)
            .Add(x => x.Variant, ThemeVariant.Primary)
            .AddUnmatched("hx-boost", "true")
            .AddChildContent("<a href=\"/home\" class=\"px-8\">Home</a>"));

        Assert.Empty(cut.FindAll("button"));
        var link = cut.Find("a");
        Assert.Equal("/home", link.GetAttribute("href"));
        Assert.Equal("button", link.GetAttribute("data-slot"));
        Assert.Equal("true", link.GetAttribute("hx-boost"));
        Assert.Contains("bg-primary", link.ClassList);
        Assert.Contains("px-8", link.ClassList); // the child's class wins the padding conflict
        Assert.DoesNotContain("px-4", link.ClassList);
        Assert.False(link.HasAttribute("aschild"));
    }

    [Fact]
    public void AsChild_WithoutChildContentThrows()
    {
        Assert.ThrowsAny<Exception>(() => Render<RzButton>(p => p.Add(x => x.AsChild, true)));
    }
}
