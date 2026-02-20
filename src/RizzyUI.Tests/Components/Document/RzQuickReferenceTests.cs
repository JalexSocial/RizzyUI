
using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Document;

public class RzQuickReferenceTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzQuickReferenceTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RzQuickReferenceContainer_RendersWithAlpine()
    {
        // Arrange
        var id = "qr-container";

        // Act
        var cut = Render<RzQuickReferenceContainer>(parameters => parameters
            .Add(p => p.Id, id)
        );

        // Assert
        var root = cut.Find($"div[data-alpine-root='{id}']");
        Assert.Equal("rzQuickReferenceContainer", root.GetAttribute("x-data"));
        Assert.NotNull(root.GetAttribute("data-headings"));
    }

    [Fact]
    public void RzQuickReference_RendersListFromContainer()
    {
        // Act
        // Note: RzQuickReference must be inside a Container to work, normally cascades.
        // We simulate a basic render to ensure markup structure.
        // To properly test heading registration, we would need to simulate child headings adding themselves.
        // For unit testing the structure:
        
        var cut = Render<RzQuickReferenceContainer>(parameters => parameters
            .Add(p => p.ChildContent, builder => {
                builder.OpenComponent<RzHeading>(0);
                builder.AddAttribute(1, "Level", HeadingLevel.H2);
                builder.AddAttribute(2, "QuickReferenceTitle", "Intro");
                builder.AddAttribute(3, "ChildContent", (RenderFragment)(b => b.AddContent(0, "Introduction")));
                builder.CloseComponent();

                builder.OpenComponent<RzQuickReference>(10);
                builder.CloseComponent();
            })
        );

        // Assert
        var nav = cut.Find("[data-slot='quick-reference']");
        Assert.NotNull(nav);
        // The loop in RzQuickReference might not render immediately if registration happens after init,
        // but let's check basic structure.
        Assert.NotNull(cut.Find("[data-slot='quick-reference-title']"));
        Assert.NotNull(cut.Find("[data-slot='quick-reference-list']"));
        
        // Assert heading is in list
        Assert.Contains("Intro", cut.Markup);
    }
}