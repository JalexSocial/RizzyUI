using Bunit;
using Microsoft.AspNetCore.Components;

namespace RizzyUI.Tests.Components;

public class Phase3RegressionTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public Phase3RegressionTests(WebAppFixture fixture) : base(fixture) { }

    [Fact]
    public void AccordionInsideSidebar_PreservesSidebarAndAccordionAccessibilityHooks()
    {
        var cut = Render(builder =>
        {
            builder.OpenComponent<RzSidebarProvider>(0);
            builder.AddAttribute(1, nameof(RzSidebarProvider.Id), "regression-sidebar");
            builder.AddAttribute(2, nameof(RzSidebarProvider.ChildContent), (RenderFragment)(provider =>
            {
                provider.OpenComponent<Sidebar>(0);
                provider.AddAttribute(1, nameof(Sidebar.ChildContent), (RenderFragment)(sidebar =>
                {
                    sidebar.OpenComponent<SidebarContent>(0);
                    sidebar.AddAttribute(1, nameof(SidebarContent.ChildContent), (RenderFragment)(content =>
                    {
                        content.OpenComponent<RzAccordion>(0);
                        content.AddAttribute(1, nameof(RzAccordion.Type), AccordionType.Single);
                        content.AddAttribute(2, nameof(RzAccordion.ChildContent), (RenderFragment)(accordion =>
                        {
                            accordion.OpenComponent<AccordionItem>(0);
                            accordion.AddAttribute(1, nameof(AccordionItem.Title), "Sidebar section");
                            accordion.AddAttribute(2, nameof(AccordionItem.AccordionContent), (RenderFragment)(item => item.AddContent(0, "Nested links")));
                            accordion.CloseComponent();
                        }));
                        content.CloseComponent();
                    }));
                    sidebar.CloseComponent();
                }));
                provider.CloseComponent();
            }));
            builder.CloseComponent();
        });

        var providerRoot = cut.Find("[data-slot='sidebar-wrapper']");
        Assert.Equal("rzSidebar", providerRoot.GetAttribute("x-data"));
        Assert.Equal("regression-sidebar", providerRoot.GetAttribute("data-alpine-root"));
        Assert.Equal("768", providerRoot.GetAttribute("data-mobile-breakpoint"));

        var accordionRoot = cut.Find("[data-slot='accordion'] > div");
        Assert.Equal("rzAccordion", accordionRoot.GetAttribute("x-data"));
        Assert.Equal("false", accordionRoot.GetAttribute("data-multiple"));

        var trigger = cut.Find("[data-slot='accordion-trigger']");
        var content = cut.Find("[data-slot='accordion-content']");
        Assert.Equal("handleKeydown", trigger.GetAttribute("x-on:keydown"));
        Assert.Equal(content.Id, trigger.GetAttribute("aria-controls"));
        Assert.Equal(trigger.Id, content.GetAttribute("aria-labelledby"));
        Assert.Equal("region", content.GetAttribute("role"));
    }

    [Fact]
    public void TooltipOnSidebarItem_PreservesTooltipRelationshipsAndSidebarButtonHooks()
    {
        var cut = Render(builder =>
        {
            builder.OpenComponent<RzSidebarProvider>(0);
            builder.AddAttribute(1, nameof(RzSidebarProvider.ChildContent), (RenderFragment)(provider =>
            {
                provider.OpenComponent<SidebarMenu>(0);
                provider.AddAttribute(1, nameof(SidebarMenu.ChildContent), (RenderFragment)(menu =>
                {
                    menu.OpenComponent<SidebarMenuItem>(0);
                    menu.AddAttribute(1, nameof(SidebarMenuItem.ChildContent), (RenderFragment)(item =>
                    {
                        item.OpenComponent<RzTooltip>(0);
                        item.AddAttribute(1, nameof(RzTooltip.Id), "sidebar-tooltip");
                        item.AddAttribute(2, nameof(RzTooltip.ChildContent), (RenderFragment)(tooltip =>
                        {
                            tooltip.OpenComponent<TooltipTrigger>(0);
                            tooltip.AddAttribute(1, nameof(TooltipTrigger.ChildContent), (RenderFragment)(trigger =>
                            {
                                trigger.OpenComponent<SidebarMenuButton>(0);
                                trigger.AddAttribute(1, nameof(SidebarMenuButton.ChildContent), (RenderFragment)(button => button.AddContent(0, "Dashboard")));
                                trigger.CloseComponent();
                            }));
                            tooltip.CloseComponent();

                            tooltip.OpenComponent<TooltipContent>(1);
                            tooltip.AddAttribute(2, nameof(TooltipContent.ChildContent), (RenderFragment)(content => content.AddContent(0, "Open dashboard")));
                            tooltip.CloseComponent();
                        }));
                        item.CloseComponent();
                    }));
                    menu.CloseComponent();
                }));
                provider.CloseComponent();
            }));
            builder.CloseComponent();
        });

        var tooltipRoot = cut.Find("[data-slot='tooltip']");
        Assert.Equal("rzTooltip", tooltipRoot.GetAttribute("x-data"));
        Assert.Equal("sidebar-tooltip", tooltipRoot.GetAttribute("data-alpine-root"));

        var tooltipTrigger = cut.Find("[data-slot='tooltip-trigger']");
        var tooltipContent = cut.Find("[data-slot='tooltip-content']");
        Assert.Equal("trigger", tooltipTrigger.GetAttribute("x-ref"));
        Assert.Equal(tooltipContent.Id, tooltipTrigger.GetAttribute("aria-describedby"));
        Assert.Equal(tooltipContent.Id, tooltipTrigger.GetAttribute("aria-controls"));
        Assert.Equal(tooltipTrigger.Id, tooltipContent.GetAttribute("aria-labelledby"));
        Assert.Equal("tooltip", tooltipContent.GetAttribute("role"));

        var sidebarButton = cut.Find("[data-slot='sidebar-menu-button']");
        Assert.Equal("button", sidebarButton.GetAttribute("type"));
        Assert.Equal("menu-button", sidebarButton.GetAttribute("data-sidebar"));
    }

    [Fact]
    public void FileInputInsideTabs_PreservesTabPanelRelationshipsAndFileInputLiveStatus()
    {
        var cut = Render<RzTabs>(parameters => parameters
            .Add(p => p.Id, "upload-tabs")
            .Add(p => p.DefaultValue, "files")
            .AddChildContent<TabsList>(list => list
                .Add(p => p.AriaLabel, "Upload settings")
                .AddChildContent<TabsTrigger>(trigger => trigger
                    .Add(p => p.Value, "files")
                    .AddChildContent("Files")))
            .AddChildContent<TabsContent>(content => content
                .Add(p => p.Value, "files")
                .AddChildContent<RzFileInput>(file => file
                    .Add(p => p.Id, "tabs-file-input")
                    .Add(p => p.AriaLabel, "Upload attachments"))));

        var tabsRoot = cut.Find("[data-slot='tabs'] > div");
        Assert.Equal("rzTabs", tabsRoot.GetAttribute("x-data"));
        Assert.Equal("files", tabsRoot.GetAttribute("data-default-value"));

        var tabList = cut.Find("[data-slot='tabs-list']");
        Assert.Equal("tablist", tabList.GetAttribute("role"));
        Assert.Equal("onListKeydown", tabList.GetAttribute("x-on:keydown"));

        var tabTrigger = cut.Find("[data-slot='tabs-trigger']");
        var panel = cut.Find("[data-slot='tabs-content']");
        Assert.Equal(panel.Id, tabTrigger.GetAttribute("aria-controls"));
        Assert.Equal(tabTrigger.Id, panel.GetAttribute("aria-labelledby"));
        Assert.Equal("tabpanel", panel.GetAttribute("role"));

        var fileContainer = cut.Find("[data-slot='container']");
        var nativeInput = cut.Find("input[data-slot='native-input']");
        var status = cut.Find("[data-slot='status']");
        Assert.Equal("rzFileInput", fileContainer.GetAttribute("x-data"));
        Assert.Equal("handleDrop", fileContainer.GetAttribute("x-on:drop.prevent"));
        Assert.Equal("Upload attachments", nativeInput.GetAttribute("aria-label"));
        Assert.Equal("status", status.GetAttribute("role"));
        Assert.Equal("polite", status.GetAttribute("aria-live"));
        Assert.Equal(status.Id, nativeInput.GetAttribute("aria-describedby")?.Split(' ').Last());
    }

    [Fact]
    public void AlertNearInteractiveControls_PreservesLiveRegionWithoutStealingControlFocus()
    {
        var cut = Render(builder =>
        {
            builder.OpenElement(0, "section");
            builder.OpenComponent<RzAlert>(1);
            builder.AddAttribute(2, nameof(RzAlert.Dismissable), true);
            builder.AddAttribute(3, nameof(RzAlert.LiveRegionMode), RzAlertLiveRegionMode.Status);
            builder.AddAttribute(4, nameof(RzAlert.ChildContent), (RenderFragment)(alert => alert.AddContent(0, "Saved")));
            builder.CloseComponent();
            builder.OpenComponent<RzSidebarProvider>(5);
            builder.AddAttribute(6, nameof(RzSidebarProvider.ChildContent), (RenderFragment)(provider =>
            {
                provider.OpenComponent<SidebarTrigger>(0);
                provider.AddAttribute(1, nameof(SidebarTrigger.AriaLabel), "Toggle navigation");
                provider.CloseComponent();
            }));
            builder.CloseComponent();
            builder.CloseElement();
        });

        var alert = cut.Find("[data-slot='alert']");
        Assert.Equal("status", alert.GetAttribute("role"));
        Assert.Equal("polite", alert.GetAttribute("aria-live"));
        Assert.Equal("true", alert.FirstElementChild?.GetAttribute("aria-atomic"));

        var dismiss = cut.Find("[data-slot='alert-close-button']");
        Assert.Equal("button", dismiss.GetAttribute("type"));
        Assert.Equal("dismiss", dismiss.GetAttribute("x-on:click"));
        Assert.Null(alert.GetAttribute("tabindex"));
        Assert.Null(alert.GetAttribute("autofocus"));
        Assert.Null(dismiss.GetAttribute("autofocus"));

        var trigger = cut.Find("[data-slot='sidebar-trigger']");
        Assert.Equal("button", trigger.GetAttribute("type"));
        Assert.Equal("toggle", trigger.GetAttribute("x-on:click"));
        Assert.Equal("triggerExpanded", trigger.GetAttribute("x-bind:aria-expanded"));
        Assert.Equal("Toggle navigation", trigger.GetAttribute("aria-label"));
    }
}
