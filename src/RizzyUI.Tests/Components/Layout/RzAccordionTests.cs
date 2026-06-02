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
        var id = "accordion-test";

        var cut = Render<RzAccordion>(parameters => parameters
            .Add(p => p.Id, id)
        );

        var root = cut.Find("[data-slot='accordion']");
        Assert.Equal("w-full", root.GetAttribute("class"));

        var alpineRoot = cut.Find("[x-data='rzAccordion']");
        Assert.Equal("rzAccordion", alpineRoot.GetAttribute("x-data"));
        Assert.Equal(id, alpineRoot.GetAttribute("data-alpine-root"));
    }

    [Theory]
    [InlineData(AccordionType.Single, "false")]
    [InlineData(AccordionType.Multiple, "true")]
    public void TypeParameter_SetsMultipleAttribute(AccordionType type, string expectedMultiple)
    {
        var cut = Render<RzAccordion>(parameters => parameters
            .Add(p => p.Type, type)
        );

        var alpineRoot = cut.Find("[x-data='rzAccordion']");
        Assert.Equal(expectedMultiple, alpineRoot.GetAttribute("data-multiple"));
    }

    [Fact]
    public void AccordionItem_RendersApgHeaderButtonAndPanelRelationships()
    {
        var cut = Render<RzAccordion>(parameters => parameters
            .AddChildContent<AccordionItem>(item => item
                .Add(p => p.Title, "Section 1")
                .Add(p => p.AccordionContent, (RenderFragment)(b => b.AddContent(0, "Content 1")))
            )
        );

        var itemRoot = cut.Find("[data-slot='accordion-item']");
        Assert.Equal("accordionItem", itemRoot.GetAttribute("x-data"));

        var header = cut.Find("[data-slot='accordion-header']");
        Assert.Equal("H3", header.TagName);

        var trigger = cut.Find("[data-slot='accordion-trigger']");
        Assert.Equal("BUTTON", trigger.TagName);
        Assert.Equal("button", trigger.GetAttribute("type"));
        Assert.Contains("Section 1", trigger.TextContent);
        Assert.Equal("toggle", trigger.GetAttribute("x-on:click"));
        Assert.Equal("handleKeydown", trigger.GetAttribute("x-on:keydown"));
        Assert.Equal("getAriaExpanded", trigger.GetAttribute("x-bind:aria-expanded"));
        Assert.Equal("false", trigger.GetAttribute("aria-expanded"));

        var content = cut.Find("[data-slot='accordion-content']");
        Assert.Equal("region", content.GetAttribute("role"));
        Assert.Contains("Content 1", content.TextContent);
        Assert.True(content.HasAttribute("x-collapse"));

        var triggerId = trigger.GetAttribute("id");
        var contentId = content.GetAttribute("id");
        Assert.False(string.IsNullOrWhiteSpace(triggerId));
        Assert.False(string.IsNullOrWhiteSpace(contentId));
        Assert.Equal(contentId, trigger.GetAttribute("aria-controls"));
        Assert.Equal(triggerId, content.GetAttribute("aria-labelledby"));
    }

    [Theory]
    [InlineData(true, "false")]
    [InlineData(false, "true")]
    public void AccordionItem_CollapsedParameterSetsInitialStateAttributes(bool collapsed, string expectedOpen)
    {
        var cut = Render<RzAccordion>(parameters => parameters
            .AddChildContent<AccordionItem>(item => item
                .Add(p => p.Collapsed, collapsed)
            )
        );

        var itemRoot = cut.Find("[data-slot='accordion-item']");
        Assert.Equal(expectedOpen, itemRoot.GetAttribute("data-is-open"));

        var trigger = cut.Find("[data-slot='accordion-trigger']");
        Assert.Equal(expectedOpen, trigger.GetAttribute("aria-expanded"));
    }
}
