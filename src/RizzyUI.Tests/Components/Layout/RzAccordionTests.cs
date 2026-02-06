
using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components.Layout;

public class RzAccordionTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzAccordionTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RzAccordion_RendersWithAlpineAttributes()
    {
        // Arrange
        var id = "accordion-test";

        // Act
        var cut = RenderComponent<RzAccordion>(parameters => parameters
            .Add(p => p.Id, id)
        );

        // Assert
        var root = cut.Find("[data-slot='accordion']");
        Assert.Equal("rzAccordion", root.GetAttribute("x-data"));
        Assert.Equal(id, root.GetAttribute("data-alpine-root"));
    }

    [Theory]
    [InlineData(AccordionType.Single, "false")]
    [InlineData(AccordionType.Multiple, "true")]
    public void TypeParameter_SetsMultipleAttribute(AccordionType type, string expectedMultiple)
    {
        // Act
        var cut = RenderComponent<RzAccordion>(parameters => parameters
            .Add(p => p.Type, type)
        );

        // Assert
        var root = cut.Find("[data-slot='accordion']");
        Assert.Equal(expectedMultiple, root.GetAttribute("data-multiple"));
    }

    [Fact]
    public void AccordionItem_RendersCorrectStructure()
    {
        // Act
        var cut = RenderComponent<RzAccordion>(parameters => parameters
            .AddChildContent<AccordionItem>(item => item
                .Add(p => p.Title, "Section 1")
                .Add(p => p.AccordionContent, (RenderFragment)(b => b.AddContent(0, "Content 1")))
            )
        );

        // Assert
        var itemRoot = cut.Find("[data-slot='accordion-item']");
        Assert.Equal("accordionItem", itemRoot.GetAttribute("x-data"));

        var trigger = cut.Find("[data-slot='accordion-trigger']");
        Assert.Contains("Section 1", trigger.TextContent);
        Assert.Equal("toggle", trigger.GetAttribute("x-on:click"));

        var content = cut.Find("[data-slot='accordion-content']");
        Assert.Contains("Content 1", content.TextContent);
        Assert.True(content.HasAttribute("x-collapse"));
    }

    [Fact]
    public void AccordionItem_DefaultCollapsed_IsReflectedInDataAttribute()
    {
        // Act
        var cut = RenderComponent<RzAccordion>(parameters => parameters
            .AddChildContent<AccordionItem>(item => item
                .Add(p => p.Collapsed, true)
            )
        );

        // Assert
        var itemRoot = cut.Find("[data-slot='accordion-item']");
        Assert.Equal("false", itemRoot.GetAttribute("data-is-open")); // isOpen = !Collapsed
    }
}