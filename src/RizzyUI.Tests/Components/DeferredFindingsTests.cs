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
    public void RenderedComponents_UseTheConfiguredThemeInstance()
    {
        var configured = Services.GetRequiredService<IOptions<RizzyUIConfig>>().Value.DefaultTheme;

        var first = Render<RzButton>(p => p.AddChildContent("One"));
        var second = Render<RzButton>(p => p.AddChildContent("Two"));

        Assert.Same(configured, ThemeField(first.Instance));
        Assert.Same(configured, ThemeField(second.Instance));
    }
}
