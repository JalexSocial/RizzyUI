using System.Reflection;
using Bunit;
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
    public void RenderedComponents_UseTheConfiguredThemeInstance()
    {
        var configured = Services.GetRequiredService<IOptions<RizzyUIConfig>>().Value.DefaultTheme;

        var first = Render<RzButton>(p => p.AddChildContent("One"));
        var second = Render<RzButton>(p => p.AddChildContent("Two"));

        Assert.Same(configured, ThemeField(first.Instance));
        Assert.Same(configured, ThemeField(second.Instance));
    }
}
