using System.ComponentModel.DataAnnotations;
using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;

namespace RizzyUI.Tests.Components;

/// <summary>
/// Accessibility defaults (Summit SF-022, SF-023, SF-026, SF-029, SF-031, SF-037, SF-038, SF-066, SF-071,
/// SF-075, SF-076, SF-084).
/// </summary>
public class AccessibilityDefaultsTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public AccessibilityDefaultsTests(WebAppFixture fixture) : base(fixture)
    {
    }

    private sealed class Model
    {
        [Display(Name = "Workshops")]
        public IList<string> Tags { get; set; } = [];
    }

    [Fact]
    public void An_alert_can_be_a_static_callout_without_a_live_region()
    {
        var cut = Render<RzAlert>(p => p.Add(x => x.LiveRegionMode, RzAlertLiveRegionMode.None).AddChildContent("Note"));
        var alert = cut.Find("[data-slot='alert']");
        Assert.Null(alert.GetAttribute("role"));
        Assert.Null(alert.GetAttribute("aria-live"));
    }

    [Fact]
    public void Built_in_icons_render_no_ids()
    {
        var cut = Render<RzAlert>(p => p.Add(x => x.Variant, ThemeVariant.Success).AddChildContent("Saved"));
        Assert.Empty(cut.FindAll("svg[id]"));
    }

    [Fact]
    public void A_field_error_around_child_content_is_not_an_alert()
    {
        var wrapped = Render<FieldError>(p => p.AddChildContent("<span></span>"));
        Assert.Null(wrapped.Find("[data-slot='field-error']").GetAttribute("role"));

        var listed = Render<FieldError>(p => p.Add(x => x.Errors, ["Required"]));
        Assert.Equal("alert", listed.Find("[data-slot='field-error']").GetAttribute("role"));
    }

    [Fact]
    public void A_checkbox_group_is_named_by_the_display_attribute()
    {
        var model = new Model();
        var cut = Render<CascadingValue<EditContext>>(p => p
            .Add(x => x.Value, new EditContext(model))
            .AddChildContent<RzCheckboxGroup<string>>(g => g.Add(x => x.For, () => model.Tags).Add(x => x.LegendVisible, true)));

        var legend = cut.Find("legend");
        Assert.Equal("Workshops", legend.TextContent.Trim());
        Assert.DoesNotContain("sr-only", legend.ClassList);
    }

    [Fact]
    public void An_avatar_can_be_named_or_decorative()
    {
        var named = Render<RzAvatar>(p => p.Add(x => x.AriaLabel, "Ada Lovelace"));
        var root = named.Find("[data-slot='avatar']");
        Assert.Equal("img", root.GetAttribute("role"));
        Assert.Equal("Ada Lovelace", root.GetAttribute("aria-label"));

        var decorative = Render<RzAvatar>(p => p.Add(x => x.Decorative, true).Add(x => x.AriaLabel, "ignored"));
        var hidden = decorative.Find("[data-slot='avatar']");
        Assert.Equal("true", hidden.GetAttribute("aria-hidden"));
        Assert.Null(hidden.GetAttribute("role"));
    }

    [Fact]
    public void The_dropzone_is_named_by_its_text_unless_the_caller_names_it()
    {
        var cut = Render<RzFileInput>(p => p.Add(x => x.Variant, FileInputVariant.Dropzone));
        var trigger = cut.Find("[data-slot='trigger']");
        Assert.Null(trigger.GetAttribute("aria-label"));
        Assert.Contains("Drag and drop", trigger.TextContent);
        Assert.NotNull(cut.Find("input[type=file]").GetAttribute("aria-label"));
    }

    [Fact]
    public void Items_in_an_item_group_are_list_items()
    {
        var cut = Render<RzItemGroup>(p => p.AddChildContent<RzItem>(i => i.AddChildContent("One")));
        Assert.Equal("listitem", cut.Find("[data-slot='item']").GetAttribute("role"));

        var alone = Render<RzItem>(p => p.AddChildContent("Alone"));
        Assert.Null(alone.Find("[data-slot='item']").GetAttribute("role"));
    }

    [Fact]
    public void An_indicator_is_an_image_with_a_label_and_decorative_without()
    {
        var labeled = Render<RzIndicator>(p => p.Add(x => x.AriaLabel, "Live"));
        var dot = labeled.Find("[data-slot='indicator']");
        Assert.Equal("img", dot.GetAttribute("role"));
        Assert.Equal("Live", dot.GetAttribute("aria-label"));

        var plain = Render<RzIndicator>();
        var bare = plain.Find("[data-slot='indicator']");
        Assert.Null(bare.GetAttribute("aria-label"));
        Assert.Equal("true", bare.GetAttribute("aria-hidden"));
    }

    [Fact]
    public void The_clipboard_button_meets_the_minimum_target_size()
    {
        var cut = Render<RzClipboard>(p => p.Add(x => x.Value, "text").AddChildContent("C"));
        var button = cut.Find("[data-slot='clipboard']");
        Assert.Contains("min-h-6", button.ClassList);
        Assert.Contains("min-w-6", button.ClassList);
    }

    [Fact]
    public void A_sidebar_group_references_its_label_only_when_it_has_one()
    {
        var unlabeled = Render<SidebarGroup>(p => p.AddChildContent("Items"));
        Assert.Null(unlabeled.Find("[data-slot='sidebar-group']").GetAttribute("aria-labelledby"));

        var labeled = Render<SidebarGroup>(p => p.AddChildContent<SidebarGroupLabel>(l => l.AddChildContent("Projects")));
        var group = labeled.Find("[data-slot='sidebar-group']");
        Assert.Equal(group.GetAttribute("id") + "-label", group.GetAttribute("aria-labelledby"));

        // An AsChild label whose child computes its own id (a collapsible trigger) cannot be referenced.
        var collapsible = Render<RzCollapsible>(p => p.AddChildContent<SidebarGroup>(g => g
            .AddChildContent<SidebarGroupLabel>(l => l.Add(x => x.AsChild, true)
                .AddChildContent<CollapsibleTrigger>(t => t.AddChildContent("Plugins")))));
        Assert.Null(collapsible.Find("[data-slot='sidebar-group']").GetAttribute("aria-labelledby"));
    }

    [Fact]
    public void A_popover_label_names_its_content_not_its_wrapper()
    {
        var cut = Render<RzPopover>(p => p
            .Add(x => x.AriaLabel, "Filters")
            .AddChildContent<PopoverContent>(c => c.AddChildContent("Body")));
        Assert.Null(cut.Find("[data-slot='popover']").GetAttribute("aria-label"));
        // The content is in a <template> (teleported by Alpine), so read its markup.
        var content = cut.Markup;
        Assert.Contains("data-slot=\"popover-content\"", content);
        Assert.Contains("aria-label=\"Filters\"", content);
    }

    [Fact]
    public void A_collapsible_as_child_puts_its_behavior_on_the_menu_item()
    {
        // SF-080: <RzCollapsible AsChild><SidebarMenuItem> renders the li itself, not a div inside the list.
        var cut = Render<RzCollapsible>(p => p.Add(x => x.AsChild, true)
            .AddChildContent<SidebarMenuItem>(i => i.AddChildContent("Item")));
        var item = cut.Find("li");
        Assert.Equal("menu-item", item.GetAttribute("data-sidebar"));
        Assert.Equal("rzCollapsible", item.GetAttribute("x-data"));
        Assert.Empty(cut.FindAll("div"));
    }

    [Fact]
    public void Markdown_code_blocks_are_focusable()
    {
        var cut = Render<RzMarkdown>(p => p.Add(x => x.Content, "```\nvery long line\n```"));
        Assert.Equal("0", cut.Find("pre").GetAttribute("tabindex"));
    }
}
