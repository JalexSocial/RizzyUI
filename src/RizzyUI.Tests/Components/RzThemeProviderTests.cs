using Bunit;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.DependencyInjection;

namespace RizzyUI.Tests.Components;

/// <summary>Summit SF-034: the theme does not go through HeadContent.</summary>
public class RzThemeProviderTests : BunitAlbaContext, IClassFixture<WebAppFixture>
{
    public RzThemeProviderTests(WebAppFixture fixture) : base(fixture)
    {
    }

    [Fact]
    public void WithoutAnOutlet_TheThemeRendersAtTheStartOfTheProvider()
    {
        var cut = Render<RzThemeProvider>(p => p.AddChildContent("<p id=\"child\">content</p>"));

        var style = Assert.Single(cut.FindAll("style"));
        Assert.Contains("--primary:", style.TextContent);
        Assert.Single(cut.FindAll("script"));
        Assert.NotNull(cut.Find("#child"));
    }

    [Fact]
    public void WithAnOutlet_TheThemeRendersInTheOutletAlongsideAPageHeadContent()
    {
        JSInterop.Mode = JSRuntimeMode.Loose; // HeadOutlet's page title interop
        Services.AddScoped<RzThemeHeadState>(); // AddRizzyUI registers it per request
        RenderFragment page = builder =>
        {
            builder.OpenElement(0, "head");
            builder.OpenComponent<HeadOutlet>(1);
            builder.CloseComponent();
            builder.OpenComponent<RzThemeHeadOutlet>(2);
            builder.CloseComponent();
            builder.CloseElement();
            builder.OpenElement(3, "body");
            builder.OpenComponent<RzThemeProvider>(4);
            builder.AddComponentParameter(5, nameof(RzThemeProvider.ChildContent), (RenderFragment)(child =>
            {
                // A page's own HeadContent: it used to replace the theme.
                child.OpenComponent<HeadContent>(0);
                child.AddComponentParameter(1, nameof(HeadContent.ChildContent),
                    (RenderFragment)(head => head.AddMarkupContent(0, "<meta name=\"page\" content=\"1\" />")));
                child.CloseComponent();
            }));
            builder.CloseComponent();
            builder.CloseElement();
        };

        var cut = Render(page);

        var style = Assert.Single(cut.FindAll("head style"));
        Assert.Contains("--primary:", style.TextContent);
        Assert.Empty(cut.FindAll("body style"));
        Assert.Single(cut.FindAll("head meta[name='page']"));
    }
}
