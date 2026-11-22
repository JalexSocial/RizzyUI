using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace RizzyUI.Tests.Configuration;

/// <summary>Summit SF-012: serving the widget libraries from the app with LocalAssetPath.</summary>
public class LocalAssetPathTests
{
    private static RizzyUIConfig Configure(Action<RizzyUIConfig> configure)
    {
        var services = new ServiceCollection();
        services.AddRizzyUI(configure);
        return services.BuildServiceProvider().GetRequiredService<IOptions<RizzyUIConfig>>().Value;
    }

    [Fact]
    public void Default_assets_load_from_the_local_path_with_their_hashes()
    {
        var config = Configure(c => c.LocalAssetPath = "/lib/");
        var chart = RizzyUIAssets.Vendor.Single(a => a.Key == "ChartJs");

        Assert.Equal("chart.js@4.6.1/dist/chart.umd.js", chart.LocalPath);
        Assert.Equal("/lib/chart.js@4.6.1/dist/chart.umd.js", config.AssetUrls["ChartJs"]);
        Assert.Equal(chart.Integrity, config.AssetIntegrity[config.AssetUrls["ChartJs"]]);
        Assert.StartsWith("/lib/Coloris@", config.AssetUrls["Coloris"]);
        Assert.Equal("/lib/flatpickr@4.6.13/dist/l10n/de.js", config.AssetUrls["FlatpickrLocale.de"]);
        Assert.All(RizzyUIAssets.Vendor, a => Assert.StartsWith("/lib/", config.AssetUrls[a.Key]));
    }

    [Fact]
    public void Without_a_local_path_the_assets_come_from_jsDelivr_and_overrides_win()
    {
        var config = Configure(c => c.AssetUrls["ChartJs"] = "/my/chart.js");
        Assert.StartsWith("https://cdn.jsdelivr.net/", config.AssetUrls["TomSelect"]);
        Assert.Equal("/my/chart.js", config.AssetUrls["ChartJs"]);
    }
}
