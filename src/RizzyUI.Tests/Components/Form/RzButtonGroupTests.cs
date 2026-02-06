
using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Form;

public class RzButtonGroupTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzButtonGroupTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void DefaultRender_ShowsCorrectStructure()
    {
        // Act
        var cut = RenderComponent<RzButtonGroup>(parameters => parameters
            .AddChildContent<RzButton>(b => b.Add(p => p.Label, "Btn 1"))
            .AddChildContent<RzButton>(b => b.Add(p => p.Label, "Btn 2"))
        );

        // Assert
        var group = cut.Find("[data-slot='button-group']");
        Assert.Equal("group", group.GetAttribute("role"));
        Assert.Equal("horizontal", group.GetAttribute("data-orientation"));
    }

    [Fact]
    public void Orientation_Vertical_AppliesAttribute()
    {
        // Act
        var cut = RenderComponent<RzButtonGroup>(parameters => parameters
            .Add(p => p.Orientation, Orientation.Vertical)
        );

        // Assert
        var group = cut.Find("[data-slot='button-group']");
        Assert.Equal("vertical", group.GetAttribute("data-orientation"));
    }

    [Fact]
    public void ButtonGroupSeparator_RendersCorrectly()
    {
        // Act
        var cut = RenderComponent<RzButtonGroup>(parameters => parameters
            .AddChildContent<ButtonGroupSeparator>()
        );

        // Assert
        Assert.NotNull(cut.Find("[data-slot='button-group-separator']"));
    }
}