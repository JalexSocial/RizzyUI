using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Rizzy;

namespace RizzyUI.Tests.Configuration;

/// <summary>
/// RZUI-038 end to end: a real request under <c>UsePathBase("/app")</c> renders RizzyUI asset URLs
/// under the path base, both through ASP.NET's <see cref="RazorComponentResult{TComponent}"/> and
/// through Rizzy's <see cref="IRizzyService"/>.
/// </summary>
public class PathBaseHostTests
{
    private static async Task<WebApplication> StartAsync()
    {
        var builder = WebApplication.CreateBuilder();
        builder.WebHost.UseTestServer();
        builder.Services.AddRizzy();
        builder.Services.AddRizzyUI(config => config.AssetUrls["LocalScript"] = "/_content/RizzyUI/js/local.js");

        var app = builder.Build();
        app.UsePathBase("/app");
        app.UseRouting();
        app.UseAntiforgery();
        app.UseRizzy();

        var parameters = new Dictionary<string, object?>
        {
            [nameof(RzSlider.Name)] = "price",
            [nameof(RzSlider.ComponentAssetKeys)] = new[] { "LocalScript" },
        };
        app.MapGet("/razor-component", () => new RazorComponentResult<RzSlider>(parameters));
        app.MapGet("/rizzy-partial", (IRizzyService rizzy) => rizzy.PartialView<RzSlider>(parameters));

        await app.StartAsync();
        return app;
    }

    [Theory]
    [InlineData("/app/razor-component")]
    [InlineData("/app/rizzy-partial")]
    public async Task AssetUrlsIncludeThePathBase(string path)
    {
        await using var app = await StartAsync();
        using var client = app.GetTestClient();

        var html = await client.GetStringAsync(path);

        Assert.Contains("/app/_content/RizzyUI/js/local.js", html);
        Assert.DoesNotContain("&quot;/_content/RizzyUI/js/local.js", html);
    }
}
