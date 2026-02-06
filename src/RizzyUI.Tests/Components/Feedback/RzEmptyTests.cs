
using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Feedback;

public class RzEmptyTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzEmptyTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RzEmpty_RendersCorrectStructure()
    {
        // Act
        var cut = RenderComponent<RzEmpty>(parameters => parameters
            .AddChildContent<EmptyHeader>(h => h
                .AddChildContent<EmptyTitle>(t => t.AddChildContent("Title"))
                .AddChildContent<EmptyDescription>(d => d.AddChildContent("Description"))
            )
            .AddChildContent<EmptyContent>(c => c.AddChildContent("Action"))
        );

        // Assert
        Assert.NotNull(cut.Find("[data-slot='empty']"));
        Assert.NotNull(cut.Find("[data-slot='empty-header']"));
        Assert.NotNull(cut.Find("[data-slot='empty-title']"));
        Assert.NotNull(cut.Find("[data-slot='empty-description']"));
        Assert.NotNull(cut.Find("[data-slot='empty-content']"));
    }

    [Fact]
    public void EmptyMedia_Variant_AppliesAttribute()
    {
        // Act
        var cut = RenderComponent<RzEmpty>(parameters => parameters
            .AddChildContent<EmptyHeader>(h => h
                .AddChildContent<EmptyMedia>(m => m
                    .Add(p => p.Variant, EmptyMediaVariant.Icon)
                    .AddChildContent("Icon")
                )
            )
        );

        // Assert
        var media = cut.Find("[data-slot='empty-media']");
        Assert.Equal("icon", media.GetAttribute("data-variant"));
    }
}