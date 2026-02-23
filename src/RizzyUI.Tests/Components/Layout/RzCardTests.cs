
using Bunit;

namespace RizzyUI.Tests.Components.Layout;

public class RzCardTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzCardTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RzCard_RendersContainer()
    {
        // Act
        var cut = Render<RzCard>(parameters => parameters
            .AddChildContent("Card Body")
        );

        // Assert
        var card = cut.Find("[data-slot='card-card']");
        Assert.NotNull(card);
        Assert.Contains("bg-card", card.ClassList);
        Assert.Contains("rounded-xl", card.ClassList);
    }

    [Fact]
    public void CardComponents_RenderCorrectSlots()
    {
        // Act
        var cut = Render<RzCard>(parameters => parameters
            .AddChildContent<CardHeader>(h => h
                .AddChildContent<CardTitle>(t => t.AddChildContent("Title"))
                .AddChildContent<CardDescription>(d => d.AddChildContent("Description"))
                .AddChildContent<CardAction>(a => a.AddChildContent("Action"))
            )
            .AddChildContent<CardContent>(c => c.AddChildContent("Content"))
            .AddChildContent<CardFooter>(f => f.AddChildContent("Footer"))
        );

        // Assert
        Assert.NotNull(cut.Find("[data-slot='card-header']"));
        Assert.NotNull(cut.Find("[data-slot='card-title']"));
        Assert.NotNull(cut.Find("[data-slot='card-description']"));
        Assert.NotNull(cut.Find("[data-slot='card-action']"));
        Assert.NotNull(cut.Find("[data-slot='card-content']"));
        Assert.NotNull(cut.Find("[data-slot='card-footer']"));
    }
}