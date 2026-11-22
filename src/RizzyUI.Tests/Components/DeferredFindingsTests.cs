using System.Reflection;
using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace RizzyUI.Tests.Components;

/// <summary>Regression tests for audit findings first deferred past 1.0 and then done before it.</summary>
public class DeferredFindingsTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public DeferredFindingsTests(WebAppFixture fixture) : base(fixture)
    {
    }

    private static RzTheme? ThemeField(object component)
        => (RzTheme?)typeof(RzComponent)
            .GetField("_theme", BindingFlags.Instance | BindingFlags.NonPublic)!
            .GetValue(component);

    [Fact]
    public void ConstructingAComponent_DoesNotBuildATheme()
    {
        // RZUI-035: a field initializer built a full ArcticTheme for every component instance,
        // which OnInitialized then replaced.
        var button = new RzButton();
        Assert.Null(ThemeField(button));
    }

    [Fact]
    public void DefaultElement_IsRenderedWithoutChangingTheElementParameter()
    {
        // RZUI-053: components assigned their default tag to the Element parameter in OnInitialized.
        var badge = Render<RzBadge>(p => p.AddChildContent("New"));
        Assert.Equal("SPAN", badge.Find("[data-slot='badge']").TagName);
        Assert.Equal(string.Empty, badge.Instance.Element);

        var title = Render<CardTitle>(p => p.AddChildContent("Title"));
        Assert.Equal("H2", title.Find("[data-slot='card-title']").TagName);
        Assert.Equal(string.Empty, title.Instance.Element);
    }

    [Fact]
    public void CallerElement_IsHonoredWhereItUsedToBeOverwritten()
    {
        // RZUI-053: RzSeparator (and 54 others) replaced the caller's Element unconditionally.
        var separator = Render<RzSeparator>(p => p.Add(x => x.Element, "hr"));
        Assert.Equal("HR", separator.Find("[data-slot='separator']").TagName);

        var title = Render<CardTitle>(p => p.Add(x => x.Element, "h3").AddChildContent("Title"));
        Assert.Equal("H3", title.Find("[data-slot='card-title']").TagName);
    }

    [Fact]
    public void AttributesDifferingOnlyByCase_DoNotThrow()
    {
        // RZUI-053: 27 components copied AdditionalAttributes into a case-insensitive dictionary
        // with the copy constructor, which throws on keys that differ only by case.
        // Markup attributes are merged case-insensitively by Blazor; a dictionary passed directly as
        // AdditionalAttributes keeps its own comparer.
        var ordinal = new Dictionary<string, object>(StringComparer.Ordinal)
        {
            ["data-test"] = "lower",
            ["DATA-TEST"] = "upper",
        };

        var text = Render<ButtonGroupText>(p => p
            .Add(x => x.AdditionalAttributes, ordinal)
            .AddChildContent("Label"));
        Assert.NotNull(text.Find("[data-slot='button-group-text']").GetAttribute("data-test"));

        var item = Render<RzItem>(p => p
            .Add(x => x.AdditionalAttributes, ordinal)
            .AddChildContent("Item"));
        Assert.NotNull(item.Find("[data-slot='item']").GetAttribute("data-test"));
    }

    [Fact]
    public void LocalizedDefaults_AreRenderedWithoutChangingTheParameter()
    {
        // RZUI-053: 41 components wrote their localized default into the parameter
        // (AriaLabel ??= Localizer[...]) in OnInitialized and OnParametersSet.
        var cut = Render<RzBackToTop>();

        Assert.Null(cut.Instance.AriaLabel);
        Assert.False(string.IsNullOrWhiteSpace(cut.Find("[aria-label]").GetAttribute("aria-label")));

        var named = Render<RzBackToTop>(p => p.Add(x => x.AriaLabel, "Up"));
        Assert.Equal("Up", named.Find("[aria-label]").GetAttribute("aria-label"));
    }

    [Fact]
    public void CallerClass_IsMergedWithTheBaseClasses_NotSubstituted()
    {
        // RZUI-053: Label, RzAspectRatio, RzCombobox and RzCalendarProvider rendered class before the
        // @attributes splat, so a caller's class replaced the merged class (base classes lost).
        var label = Render<Label>(p => p.AddUnmatched("class", "my-label").AddChildContent("Name"));
        var classes = label.Find("[data-slot='label']").ClassList;
        Assert.Contains("my-label", classes);
        Assert.True(classes.Length > 1, "base classes are kept");
    }

    [Fact]
    public void ComponentWiring_WinsOverCallerAttributes_RoleAndDataSlotDoNot()
    {
        // RZUI-053 precedence rule: role, data-slot and type (buttons) are caller-overridable; the
        // attributes the component computes (class, id, x-*, aria state, data-* configuration) win.
        var spinner = Render<RzSpinner>(p => p
            .AddUnmatched("role", "img")
            .AddUnmatched("data-slot", "my-spinner")
            .Add(x => x.AriaLabel, "Saving"));
        var root = spinner.Find("[data-slot='my-spinner']");
        Assert.Equal("img", root.GetAttribute("role"));
        Assert.Equal("Saving", root.GetAttribute("aria-label"));

        // x-data from a caller is no longer silently replaced: it throws (D-24, DirectiveRulesTests).
        var dropdown = Render<RzDropdownMenu>();
        Assert.Equal("rzDropdownMenu", dropdown.Find("[x-data]").GetAttribute("x-data"));
    }

    private string RenderScoped(string prefix)
    {
        var cut = Render<RzIdScope>(p => p
            .Add(x => x.Prefix, prefix)
            .AddChildContent(b =>
            {
                b.OpenComponent<RzBadge>(0);
                b.AddComponentParameter(1, "ChildContent", (RenderFragment)(c => c.AddContent(0, "One")));
                b.CloseComponent();
                b.OpenComponent<RzBadge>(2);
                b.AddComponentParameter(3, "Id", "explicit");
                b.AddComponentParameter(4, "ChildContent", (RenderFragment)(c => c.AddContent(0, "Two")));
                b.CloseComponent();
                b.OpenComponent<RzCodeViewer>(5);
                b.AddComponentParameter(6, "Source", "var x = 1;");
                b.CloseComponent();
            }));
        return cut.Markup;
    }

    [Fact]
    public void IdScope_RendersTheSameIdsForTheSameMarkup()
    {
        // RZUI-061: ids were process-unique, so every render produced different ids.
        var first = RenderScoped("cart");
        var second = RenderScoped("cart");

        Assert.Equal(first, second);
        Assert.Contains("id=\"cart-1\"", first);
        Assert.Contains("id=\"explicit\"", first);   // a caller's Id is kept and uses no number
        Assert.Contains("id=\"cart-2\"", first);     // the code viewer
        Assert.Contains("cart-2-code", first);       // derived ids follow the component id
    }

    [Fact]
    public void IdsOutsideAScope_AreUniqueAndAnExplicitIdAllocatesNone()
    {
        var a = Render<RzBadge>(p => p.AddChildContent("A"));
        var b = Render<RzBadge>(p => p.AddChildContent("B"));
        Assert.NotEqual(a.Instance.Id, b.Instance.Id);
        Assert.StartsWith("rz", a.Instance.Id);

        var named = new RzBadge { Id = "given" };
        Assert.Equal("given", named.Id);
    }

    [Fact]
    public void IdScope_RequiresAPrefixWithoutWhitespace()
    {
        Assert.Throws<InvalidOperationException>(() => Render<RzIdScope>(p => p.Add(x => x.Prefix, "two words")));
    }

    [Fact]
    public void RenderedComponents_UseTheConfiguredThemeInstance()
    {
        var configured = Services.GetRequiredService<IOptions<RizzyUIConfig>>().Value.DefaultTheme;

        var first = Render<RzButton>(p => p.AddChildContent("One"));
        var second = Render<RzButton>(p => p.AddChildContent("Two"));

        Assert.Same(configured, ThemeField(first.Instance));
        Assert.Same(configured, ThemeField(second.Instance));
    }
}
