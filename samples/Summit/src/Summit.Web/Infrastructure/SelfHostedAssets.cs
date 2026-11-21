using System.Text.Json;
using Microsoft.Extensions.Options;
using RizzyUI;

namespace Summit.Web.Infrastructure;

/// <summary>
/// Points RizzyUI's widget libraries (Chart.js, Tom Select, flatpickr, ...) at the copies in
/// wwwroot/lib instead of jsDelivr. Each local URL reuses the SRI hash RizzyUI pins for the CDN URL,
/// so a local copy that is not byte-identical fails to load (and the browser tests catch it).
/// </summary>
/// <remarks>
/// Runs as a PostConfigure registered after AddRizzyUI, so RizzyUI has already filled in its CDN
/// defaults and their hashes. See summit-findings.md SF-012 for why this is needed at all.
/// </remarks>
internal sealed class SelfHostedAssets(IWebHostEnvironment environment, IOptions<SummitOptions> summit)
    : IPostConfigureOptions<RizzyUIConfig>
{
    public void PostConfigure(string? name, RizzyUIConfig config)
    {
        if (summit.Value.Assets.UseCdnDefaults)
            return;

        foreach (var asset in ReadManifest(environment.ContentRootPath))
        {
            var localUrl = "/" + asset.Path;
            config.AssetUrls[asset.Key] = localUrl;

            if (config.AssetIntegrity.TryGetValue(asset.Url, out var integrity))
                config.AssetIntegrity[localUrl] = integrity;
        }
    }

    internal static IReadOnlyList<VendorAsset> ReadManifest(string contentRoot)
    {
        var path = Path.Combine(contentRoot, "vendor.json");
        if (!File.Exists(path))
            return [];

        using var stream = File.OpenRead(path);
        var manifest = JsonSerializer.Deserialize<VendorManifest>(stream, JsonOptions);
        return manifest?.Assets ?? [];
    }

    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    internal sealed record VendorManifest(List<VendorAsset> Assets);

    internal sealed record VendorAsset(string Key, string Url, string Path);
}
