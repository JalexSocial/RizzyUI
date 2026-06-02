using Blazicons;
using Bunit;

namespace RizzyUI.Tests.Components.Feedback;

public class RzAlertTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzAlertTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_ShowsCorrectStructureWithAlpine()
    {
        // Arrange
        var id = "alert-test";

        // Act
        var cut = Render<RzAlert>(parameters => parameters
            .Add(p => p.Id, id)
            .AddChildContent("Alert Content")
        );

        // Assert
        var root = cut.Find("[data-slot='alert']");
        var alpineDiv = root.FirstElementChild;
        Assert.NotNull(alpineDiv);
        Assert.Equal("rzAlert", alpineDiv.GetAttribute("x-data"));
        Assert.Equal(id, alpineDiv.GetAttribute("data-alpine-root"));
        Assert.Equal("showAlert", alpineDiv.GetAttribute("x-show"));
        Assert.Contains("Alert Content", alpineDiv.InnerHtml);
    }

    [Fact]
    public void DefaultRender_UsesAssertiveAlertSemantics()
    {
        // Act
        var cut = Render<RzAlert>(parameters => parameters
            .AddChildContent("Urgent alert")
        );

        // Assert
        var root = cut.Find("[data-slot='alert']");
        var liveRegion = root.FirstElementChild;
        Assert.NotNull(liveRegion);
        Assert.Equal("alert", root.GetAttribute("role"));
        Assert.Equal("assertive", root.GetAttribute("aria-live"));
        Assert.Equal("true", liveRegion.GetAttribute("aria-atomic"));
    }

    [Fact]
    public void StatusMode_UsesPoliteStatusSemantics()
    {
        // Act
        var cut = Render<RzAlert>(parameters => parameters
            .Add(p => p.LiveRegionMode, RzAlertLiveRegionMode.Status)
            .AddChildContent("Saved")
        );

        // Assert
        var root = cut.Find("[data-slot='alert']");
        var liveRegion = root.FirstElementChild;
        Assert.NotNull(liveRegion);
        Assert.Equal("status", root.GetAttribute("role"));
        Assert.Equal("polite", root.GetAttribute("aria-live"));
        Assert.Equal("true", liveRegion.GetAttribute("aria-atomic"));
    }

    [Theory]
    [InlineData(ThemeVariant.Information, "border-info")]
    [InlineData(ThemeVariant.Destructive, "border-destructive")]
    [InlineData(ThemeVariant.Success, "border-success")]
    public void VariantParameter_AppliesCorrectClasses(ThemeVariant variant, string expectedClass)
    {
        // Act
        var cut = Render<RzAlert>(parameters => parameters
            .Add(p => p.Variant, variant)
        );

        // Assert
        var root = cut.Find("[data-slot='alert']");
        Assert.Contains(expectedClass, root.ClassList);
    }

    [Fact]
    public void Dismissable_RendersAccessibleCloseButton()
    {
        // Act
        var cut = Render<RzAlert>(parameters => parameters
            .Add(p => p.Dismissable, true)
        );

        // Assert
        var button = cut.Find("button[data-slot='alert-close-button']");
        Assert.Equal("button", button.GetAttribute("type"));
        Assert.Equal("dismiss", button.GetAttribute("x-on:click"));
        Assert.Equal("Close alert", button.GetAttribute("aria-label"));
    }

    [Fact]
    public void Dismissable_DoesNotAddFocusStealingAttributes()
    {
        // Act
        var cut = Render<RzAlert>(parameters => parameters
            .Add(p => p.Dismissable, true)
        );

        // Assert
        var root = cut.Find("[data-slot='alert']");
        var alpineDiv = root.FirstElementChild;
        Assert.NotNull(alpineDiv);
        var button = cut.Find("button[data-slot='alert-close-button']");
        Assert.Null(root.GetAttribute("autofocus"));
        Assert.Null(alpineDiv.GetAttribute("autofocus"));
        Assert.Null(button.GetAttribute("autofocus"));
        Assert.Null(root.GetAttribute("tabindex"));
        Assert.Null(alpineDiv.GetAttribute("tabindex"));
    }

    [Fact]
    public void Icon_IsHiddenFromAssistiveTechnologies()
    {
        // Act
        var cut = Render<RzAlert>(parameters => parameters
            .Add(p => p.Icon, MdiIcon.Home)
        );

        // Assert
        var iconContainer = cut.Find("[data-slot='alert-icon-container']");
        Assert.Equal("true", iconContainer.GetAttribute("aria-hidden"));
    }

    [Fact]
    public void Pulse_RendersPulseElement()
    {
        // Act
        var cut = Render<RzAlert>(parameters => parameters
            .Add(p => p.Icon, MdiIcon.Home)
            .Add(p => p.Pulse, true)
        );

        // Assert
        Assert.NotNull(cut.Find("[data-slot='alert-icon-pulse']"));
    }
}
