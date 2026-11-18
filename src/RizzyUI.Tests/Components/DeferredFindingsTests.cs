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
    public void RenderedComponents_UseTheConfiguredThemeInstance()
    {
        var configured = Services.GetRequiredService<IOptions<RizzyUIConfig>>().Value.DefaultTheme;

        var first = Render<RzButton>(p => p.AddChildContent("One"));
        var second = Render<RzButton>(p => p.AddChildContent("Two"));

        Assert.Same(configured, ThemeField(first.Instance));
        Assert.Same(configured, ThemeField(second.Instance));
    }
}
