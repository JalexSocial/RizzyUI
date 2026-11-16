using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace RizzyUI.Tests.Configuration;

public class AssetIntegrityTests
{
    private static RizzyUIConfig BuildConfig(Action<RizzyUIConfig>? configure = null)
    {
        var services = new ServiceCollection();
        services.AddLogging();
        if (configure != null)
            services.AddRizzyUI(configure);
        else
            services.AddRizzyUI();
        return services.BuildServiceProvider().GetRequiredService<IOptions<RizzyUIConfig>>().Value;
    }

    [Fact]
    public void DefaultCdnAssets_ArePinnedToExactVersions()
    {
        var config = BuildConfig();
        var cdnUrls = config.AssetUrls.Values.Where(url => url.StartsWith("https://", StringComparison.Ordinal)).ToList();

        Assert.NotEmpty(cdnUrls);
        Assert.All(cdnUrls, url =>
        {
            Assert.DoesNotContain("@latest", url, StringComparison.OrdinalIgnoreCase);
            Assert.Matches(new Regex(@"@v?\d+\.\d+\.\d+/"), url);
        });
    }

    [Fact]
    public void DefaultCdnAssets_HaveSha256Integrity()
    {
        var config = BuildConfig();

        foreach (var url in config.AssetUrls.Values.Where(url => url.StartsWith("https://", StringComparison.Ordinal)))
        {
            Assert.True(config.AssetIntegrity.TryGetValue(url, out var hash), $"No integrity hash for {url}");
            Assert.Matches(new Regex(@"^sha256-[A-Za-z0-9+/]{43}=$"), hash);
        }
    }

    [Fact]
    public void DefaultCdnAssets_HaveUniqueKeysAndUrls()
    {
        var assets = ServiceCollectionExtensions.DefaultCdnAssets;

        Assert.Equal(assets.Length, assets.Select(asset => asset.Key).Distinct().Count());
        Assert.Equal(assets.Length, assets.Select(asset => asset.Url).Distinct().Count());
    }

    [Fact]
    public void ResolveAssets_EmitsSrcAndIntegrityForKnownHashes()
    {
        var config = BuildConfig();

        var json = JsonSerializer.Serialize(config.ResolveAssets(["FlatpickrCore"]));

        var entry = JsonDocument.Parse(json).RootElement[0];
        Assert.Equal(config.AssetUrls["FlatpickrCore"], entry.GetProperty("src").GetString());
        Assert.Equal(config.AssetIntegrity[config.AssetUrls["FlatpickrCore"]], entry.GetProperty("integrity").GetString());
    }

    [Fact]
    public void OverriddenUrl_DoesNotInheritTheDefaultHash()
    {
        const string selfHosted = "/lib/flatpickr/flatpickr.min.js";
        var config = BuildConfig(c => c.AssetUrls["FlatpickrCore"] = selfHosted);

        var json = JsonSerializer.Serialize(config.ResolveAssets(["FlatpickrCore"]));

        Assert.Equal($"[\"{selfHosted}\"]", json);
    }

    [Fact]
    public void ConfiguredIntegrity_AppliesToAnOverriddenUrl()
    {
        const string url = "https://cdn.example.test/flatpickr.js";
        var config = BuildConfig(c =>
        {
            c.AssetUrls["FlatpickrCore"] = url;
            c.AssetIntegrity[url] = "sha384-custom";
        });

        var entry = JsonDocument.Parse(JsonSerializer.Serialize(config.ResolveAssets(["FlatpickrCore"]))).RootElement[0];

        Assert.Equal(url, entry.GetProperty("src").GetString());
        Assert.Equal("sha384-custom", entry.GetProperty("integrity").GetString());
    }

    [Fact]
    public void ResolveAssets_SkipsUnknownKeysAndDuplicates()
    {
        var config = BuildConfig();

        var assets = config.ResolveAssets(["Missing", "ChartJs", "ChartJs"]);

        Assert.Single(assets);
    }
}
