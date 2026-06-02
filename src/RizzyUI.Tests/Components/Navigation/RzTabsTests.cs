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
        var root = cut.Find("[data-slot='tabs'] > div");
        Assert.Equal("rzTabs", root.GetAttribute("x-data"));
        Assert.Equal(id, root.GetAttribute("data-alpine-root"));
        Assert.Equal("tab1", root.GetAttribute("data-default-value"));
    }

    [Fact]
    public void RzTabs_RendersTablistSemanticsAndKeyboardHandler()
    {
        // Act
        var cut = Render<RzTabs>(parameters => parameters
            .Add(p => p.DefaultValue, "tab1")
            .AddChildContent<TabsList>(l => l
                .Add(p => p.AriaLabel, "Account settings tabs")
                .Add(p => p.Orientation, Orientation.Vertical)
                .AddChildContent<TabsTrigger>(t => t.Add(p => p.Value, "tab1").AddChildContent("Tab 1"))
            )
            .AddChildContent<TabsContent>(c => c.Add(p => p.Value, "tab1"))
        );

        // Assert
        var list = cut.Find("[data-slot='tabs-list']");
        Assert.Equal("tablist", list.GetAttribute("role"));
        Assert.Equal("Account settings tabs", list.GetAttribute("aria-label"));
        Assert.Equal("vertical", list.GetAttribute("aria-orientation"));
        Assert.Equal("onListKeydown", list.GetAttribute("x-on:keydown"));
    }

    [Fact]
    public void TabsTrigger_RendersWithCorrectAttributes()
    {
        // Act
        var cut = Render<RzTabs>(parameters => parameters
            .Add(p => p.Id, "tabs-a11y")
            .Add(p => p.DefaultValue, "tab1")
            .AddChildContent<TabsList>(l => l
                .AddChildContent<TabsTrigger>(t => t.Add(p => p.Value, "tab1").AddChildContent("Tab 1"))
            )
            .AddChildContent<TabsContent>(c => c.Add(p => p.Value, "tab1"))
        );

        // Assert
        var trigger = cut.Find("[data-slot='tabs-trigger']");
        Assert.Equal("tabs-a11y-tab1-trigger", trigger.Id);
        Assert.Equal("tab1", trigger.GetAttribute("data-value"));
        Assert.Equal("tab", trigger.GetAttribute("role"));
        Assert.Equal("tabs-a11y-tab1-content", trigger.GetAttribute("aria-controls"));
        Assert.Equal("false", trigger.GetAttribute("aria-selected"));
        Assert.Equal("-1", trigger.GetAttribute("tabindex"));
        Assert.Equal("inactive", trigger.GetAttribute("data-state"));
        Assert.Equal("onTriggerClick", trigger.GetAttribute("x-on:click"));
        Assert.Equal("_attrAriaSelected", trigger.GetAttribute("x-bind:aria-selected"));
        Assert.Equal("_attrTabIndex", trigger.GetAttribute("x-bind:tabindex"));
        Assert.Equal("_attrDataState", trigger.GetAttribute("x-bind:data-state"));
    }

    [Fact]
    public void TabsTrigger_RendersDisabledSemantics()
    {
        // Act
        var cut = Render<RzTabs>(parameters => parameters
            .Add(p => p.DefaultValue, "tab1")
            .AddChildContent<TabsList>(l => l
                .AddChildContent<TabsTrigger>(t => t
                    .Add(p => p.Value, "tab1")
                    .Add(p => p.Disabled, true)
                    .AddChildContent("Tab 1"))
            )
            .AddChildContent<TabsContent>(c => c.Add(p => p.Value, "tab1"))
        );

        // Assert
        var trigger = cut.Find("[data-slot='tabs-trigger']");
        Assert.Equal("true", trigger.GetAttribute("aria-disabled"));
        Assert.Equal("_attrDisabled", trigger.GetAttribute("x-bind:disabled"));
    }

    [Fact]
    public void TabsContent_RendersWithCorrectAttributes()
    {
        // Act
        var cut = Render<RzTabs>(parameters => parameters
            .Add(p => p.Id, "tabs-a11y")
            .Add(p => p.DefaultValue, "tab1")
            .AddChildContent<TabsList>(l => l
                .AddChildContent<TabsTrigger>(t => t.Add(p => p.Value, "tab1"))
            )
            .AddChildContent<TabsContent>(c => c.Add(p => p.Value, "tab1"))
        );

        // Assert
        var content = cut.Find("[data-slot='tabs-content']");
        Assert.Equal("tabs-a11y-tab1-content", content.Id);
        Assert.Equal("tab1", content.GetAttribute("data-value"));
        Assert.Equal("tabpanel", content.GetAttribute("role"));
        Assert.Equal("tabs-a11y-tab1-trigger", content.GetAttribute("aria-labelledby"));
        Assert.Equal("-1", content.GetAttribute("tabindex"));
        Assert.True(content.HasAttribute("hidden"));
        Assert.Equal("true", content.GetAttribute("aria-hidden"));
        Assert.Equal("inactive", content.GetAttribute("data-state"));
        Assert.Equal("_attrHidden", content.GetAttribute("x-bind:hidden"));
        Assert.Equal("_attrAriaHidden", content.GetAttribute("x-bind:aria-hidden"));
        Assert.Equal("_attrTabIndex", content.GetAttribute("x-bind:tabIndex"));
        Assert.Equal("_attrDataState", content.GetAttribute("x-bind:data-state"));
    }

    [Fact]
    public void RzTabs_RendersStableTriggerAndPanelRelationshipsForMultipleValues()
    {
        // Act
        var cut = Render<RzTabs>(parameters => parameters
            .Add(p => p.Id, "settings-tabs")
            .Add(p => p.DefaultValue, "account")
            .AddChildContent<TabsList>(l => l
                .AddChildContent<TabsTrigger>(t => t.Add(p => p.Value, "account").AddChildContent("Account"))
                .AddChildContent<TabsTrigger>(t => t.Add(p => p.Value, "password").AddChildContent("Password"))
            )
            .AddChildContent<TabsContent>(c => c.Add(p => p.Value, "account").AddChildContent("Account content"))
            .AddChildContent<TabsContent>(c => c.Add(p => p.Value, "password").AddChildContent("Password content"))
        );

        // Assert
        var accountTrigger = cut.Find("#settings-tabs-account-trigger");
        var passwordTrigger = cut.Find("#settings-tabs-password-trigger");
        var accountPanel = cut.Find("#settings-tabs-account-content");
        var passwordPanel = cut.Find("#settings-tabs-password-content");

        Assert.Equal(accountPanel.Id, accountTrigger.GetAttribute("aria-controls"));
        Assert.Equal(passwordPanel.Id, passwordTrigger.GetAttribute("aria-controls"));
        Assert.Equal(accountTrigger.Id, accountPanel.GetAttribute("aria-labelledby"));
        Assert.Equal(passwordTrigger.Id, passwordPanel.GetAttribute("aria-labelledby"));
    }
}
