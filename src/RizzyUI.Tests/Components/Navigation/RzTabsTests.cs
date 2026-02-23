
using Bunit;

namespace RizzyUI.Tests.Components.Navigation;

public class RzTabsTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzTabsTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void RzTabs_RendersRootWithAlpineData()
    {
        // Arrange
        var id = "tabs-test";

        // Act
        var cut = Render<RzTabs>(parameters => parameters
            .Add(p => p.Id, id)
            .Add(p => p.DefaultValue, "tab1")
            .AddChildContent<TabsList>(l => l
                .AddChildContent<TabsTrigger>(t => t.Add(p => p.Value, "tab1").AddChildContent("Tab 1"))
            )
            .AddChildContent<TabsContent>(c => c
                .Add(p => p.Value, "tab1")
                .AddChildContent("Content 1")
            )
        );

        // Assert
        var root = cut.Find("[data-slot='tabs'] > div"); // The x-data div is inside the slot div
        Assert.Equal("rzTabs", root.GetAttribute("x-data"));
        Assert.Equal(id, root.GetAttribute("data-alpine-root"));
        Assert.Equal("tab1", root.GetAttribute("data-default-value"));
    }

    [Fact]
    public void TabsTrigger_RendersWithCorrectAttributes()
    {
        // Act
        var cut = Render<RzTabs>(parameters => parameters
            .Add(p => p.DefaultValue, "tab1")
            .AddChildContent<TabsList>(l => l
                .AddChildContent<TabsTrigger>(t => t.Add(p => p.Value, "tab1").AddChildContent("Tab 1"))
            )
            .AddChildContent<TabsContent>(c => c.Add(p => p.Value, "tab1"))
        );

        // Assert
        var trigger = cut.Find("[data-slot='tabs-trigger']");
        Assert.Equal("tab1", trigger.GetAttribute("data-value"));
        Assert.Equal("tab", trigger.GetAttribute("role"));
        Assert.Equal("onTriggerClick", trigger.GetAttribute("x-on:click"));
    }

    [Fact]
    public void TabsContent_RendersWithCorrectAttributes()
    {
        // Act
        var cut = Render<RzTabs>(parameters => parameters
            .Add(p => p.DefaultValue, "tab1")
            .AddChildContent<TabsList>(l => l
                .AddChildContent<TabsTrigger>(t => t.Add(p => p.Value, "tab1"))
            )
            .AddChildContent<TabsContent>(c => c.Add(p => p.Value, "tab1"))
        );

        // Assert
        var content = cut.Find("[data-slot='tabs-content']");
        Assert.Equal("tab1", content.GetAttribute("data-value"));
        Assert.Equal("tabpanel", content.GetAttribute("role"));
    }
}