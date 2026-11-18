using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace RizzyUI.Tests.Configuration;

/// <summary>
/// RZUI-038: apps hosted under a path base (<c>UsePathBase("/app")</c>) must get RizzyUI's own
/// asset and module URLs under that base.
/// </summary>
public class PathBaseTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public PathBaseTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Theory]
    [InlineData("/_content/RizzyUI/js/x.js", "/app", "/app/_content/RizzyUI/js/x.js")]
    [InlineData("/_content/RizzyUI/js/x.js", "/app/", "/app/_content/RizzyUI/js/x.js")]
    [InlineData("/_content/RizzyUI/js/x.js", "", "/_content/RizzyUI/js/x.js")]
    [InlineData("/app/_content/RizzyUI/js/x.js", "/app", "/app/_content/RizzyUI/js/x.js")]
    [InlineData("/APP/_content/RizzyUI/js/x.js", "/app", "/APP/_content/RizzyUI/js/x.js")]
    [InlineData("/application/x.js", "/app", "/app/application/x.js")]
    [InlineData("https://cdn.example.test/x.js", "/app", "https://cdn.example.test/x.js")]
    [InlineData("//cdn.example.test/x.js", "/app", "//cdn.example.test/x.js")]
    [InlineData("relative/x.js", "/app", "relative/x.js")]
    public void ApplyPathBase_PrefixesOnlyRootRelativeUrls(string url, string pathBase, string expected)
    {
        Assert.Equal(expected, RizzyUIConfig.ApplyPathBase(url, new PathString(pathBase.Length == 0 ? null : pathBase)));
    }

    [Fact]
    public void ResolveAssets_KeepsTheIntegrityOfTheConfiguredUrl()
    {
        var config = new RizzyUIConfig();
        config.AssetUrls["Local"] = "/_content/RizzyUI/js/local.js";
        config.AssetIntegrity["/_content/RizzyUI/js/local.js"] = "sha256-abc=";

        var resolved = Assert.Single(config.ResolveAssets(["Local"], new PathString("/app")));

        var reference = Assert.IsType<RizzyUIConfig.AssetReference>(resolved);
        Assert.Equal("/app/_content/RizzyUI/js/local.js", reference.Src);
        Assert.Equal("sha256-abc=", reference.Integrity);
    }

    [Fact]
    public void Component_AssetUrls_IncludeTheRequestPathBase()
    {
        Services.Configure<RizzyUIConfig>(c => c.AssetUrls["LocalScript"] = "/_content/RizzyUI/js/local.js");

        var cut = RenderWithPathBase("/app", b =>
        {
            b.OpenComponent<RzSlider>(0);
            b.AddComponentParameter(1, nameof(RzSlider.ComponentAssetKeys), new[] { "LocalScript" });
            b.CloseComponent();
        });

        Assert.Equal("[\"/app/_content/RizzyUI/js/local.js\"]", cut.Find("[x-data='rzSlider']").GetAttribute("data-assets"));
    }

    [Fact]
    public void AlpineCodeBehindModule_IncludesTheRequestPathBase()
    {
        var cut = RenderWithPathBase("/app", b =>
        {
            b.OpenComponent<RzAlpineComponent>(0);
            b.AddComponentParameter(1, nameof(RzAlpineComponent.For), new RizzyUI.Tests.Components.Interactivity.FakeAlpineHost());
            b.AddComponentParameter(2, nameof(RzAlpineComponent.Name), "exampleData");
            b.CloseComponent();
        });

        Assert.Contains("\"/app/_content/RizzyUI.Tests/Components/Interactivity/FakeAlpineHost.razor.js\"", cut.Markup);
    }

    private IRenderedComponent<CascadingValue<HttpContext>> RenderWithPathBase(string pathBase, RenderFragment content)
    {
        var httpContext = new DefaultHttpContext();
        httpContext.Request.PathBase = new PathString(pathBase);

        return Render<CascadingValue<HttpContext>>(ps => ps
            .Add(p => p.Value, httpContext)
            .Add(p => p.ChildContent, content));
    }
}
