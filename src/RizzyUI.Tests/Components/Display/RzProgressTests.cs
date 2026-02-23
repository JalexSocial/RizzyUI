
using Bunit;

namespace RizzyUI.Tests.Components.Display;

public class RzProgressTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzProgressTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_ShowsCorrectStructure()
    {
        // Arrange
        var expectedId = "progress-test";

        // Act
        var cut = Render<RzProgress>(parameters => parameters
            .Add(p => p.Id, expectedId)
            .Add(p => p.CurrentValue, 50)
        );

        // Assert
        var root = cut.Find($"div#{expectedId}");
        Assert.NotNull(root);

        var alpineDiv = root.FirstElementChild;
        Assert.NotNull(alpineDiv);
        Assert.Equal("rzProgress", alpineDiv.GetAttribute("x-data"));
        Assert.Equal("50", alpineDiv.GetAttribute("aria-valuenow"));
        Assert.Equal("progressbar", alpineDiv.GetAttribute("role"));
    }

    [Fact]
    public void LabelPosition_Outside_RendersCorrectStructure()
    {
        // Act
        var cut = Render<RzProgress>(parameters => parameters
            .Add(p => p.Label, "{percent}%")
            .Add(p => p.LabelPosition, ProgressLabelPosition.Outside)
        );

        // Assert
        Assert.NotNull(cut.Find("[data-slot='progress-outside-label-container']"));
    }

    [Fact]
    public void LabelPosition_Inside_RendersCorrectStructure()
    {
        // Act
        var cut = Render<RzProgress>(parameters => parameters
            .Add(p => p.Label, "{percent}%")
            .Add(p => p.LabelPosition, ProgressLabelPosition.Inside)
        );

        // Assert
        Assert.NotNull(cut.Find("[data-slot='progress-inside-label-container']"));
    }

    [Theory]
    [InlineData(StatusColor.Success, "bg-success")]
    [InlineData(StatusColor.Destructive, "bg-destructive")]
    [InlineData(StatusColor.Warning, "bg-warning")]
    public void VariantParameter_AppliesCorrectInnerBarClass(StatusColor variant, string expectedClass)
    {
        // Act
        var cut = Render<RzProgress>(parameters => parameters
            .Add(p => p.Variant, variant)
        );

        // Assert
        var innerBar = cut.Find("[data-slot='progress-inner-bar']");
        Assert.Contains(expectedClass, innerBar.ClassList);
    }
}