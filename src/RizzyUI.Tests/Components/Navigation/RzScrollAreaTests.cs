using Bunit;

namespace RizzyUI.Tests.Components.Navigation;

public class RzScrollAreaTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzScrollAreaTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RzScrollArea_DefaultRender_RendersVerticalViewportAndScrollbar()
    {
        // Act
        var cut = RenderComponent<RzScrollArea>(parameters => parameters
            .AddChildContent("Scrollable content")
        );

        // Assert
        var root = cut.Find("[data-slot='scroll-area']");
        Assert.Equal("vertical", root.GetAttribute("data-orientation"));

        var viewport = cut.Find("[data-slot='scroll-area-viewport']");
        Assert.Equal("0", viewport.GetAttribute("tabindex"));
        Assert.Contains("overflow-y-scroll", viewport.ClassList);
        Assert.Contains("overflow-x-hidden", viewport.ClassList);
        Assert.Contains("Scrollable content", viewport.TextContent);

        var scrollbar = cut.Find("[data-slot='scroll-area-scrollbar']");
        Assert.Equal("vertical", scrollbar.GetAttribute("data-orientation"));
        Assert.Equal("hidden", scrollbar.GetAttribute("data-state"));
        cut.Find("[data-slot='scroll-area-thumb']");
    }

    [Fact]
    public void RzScrollArea_HorizontalOrientation_RendersHorizontalViewportAndScrollbar()
    {
        // Act
        var cut = RenderComponent<RzScrollArea>(parameters => parameters
            .Add(p => p.Orientation, Orientation.Horizontal)
        );

        // Assert
        var root = cut.Find("[data-slot='scroll-area']");
        Assert.Equal("horizontal", root.GetAttribute("data-orientation"));

        var viewport = cut.Find("[data-slot='scroll-area-viewport']");
        Assert.Contains("overflow-x-scroll", viewport.ClassList);
        Assert.Contains("overflow-y-hidden", viewport.ClassList);

        var scrollbar = cut.Find("[data-slot='scroll-area-scrollbar']");
        Assert.Equal("horizontal", scrollbar.GetAttribute("data-orientation"));
    }

    [Fact]
    public void RzScrollArea_ShowDefaultScrollBarFalse_DoesNotRenderDefaultScrollbar()
    {
        // Act
        var cut = RenderComponent<RzScrollArea>(parameters => parameters
            .Add(p => p.ShowDefaultScrollBar, false)
        );

        // Assert
        Assert.Empty(cut.FindAll("[data-slot='scroll-area-scrollbar']"));
    }

    [Fact]
    public void RzScrollArea_AlwaysType_InitializesScrollbarVisibleState()
    {
        // Act
        var cut = RenderComponent<RzScrollArea>(parameters => parameters
            .Add(p => p.Type, ScrollAreaType.Always)
        );

        // Assert
        var scrollbar = cut.Find("[data-slot='scroll-area-scrollbar']");
        Assert.Equal("visible", scrollbar.GetAttribute("data-state"));
    }
}
