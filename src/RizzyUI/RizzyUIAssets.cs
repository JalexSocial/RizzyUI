namespace RizzyUI;

/// <summary>
/// The third-party widget libraries RizzyUI loads on demand, for apps that serve them themselves
/// (<see cref="RizzyUIConfig.LocalAssetPath"/>, Summit SF-012).
/// </summary>
public static class RizzyUIAssets
{
    private const string JsDelivrNpm = "https://cdn.jsdelivr.net/npm/";
    private const string JsDelivrGitHub = "https://cdn.jsdelivr.net/gh/";

    /// <summary>
    /// Every default widget asset: its logical key, its pinned jsDelivr URL, its Subresource Integrity
    /// hash and its path below <see cref="RizzyUIConfig.LocalAssetPath"/>. A copy script downloads each
    /// <see cref="RizzyUIVendorAsset.CdnUrl"/> to <see cref="RizzyUIVendorAsset.LocalPath"/>.
    /// </summary>
    public static IReadOnlyList<RizzyUIVendorAsset> Vendor { get; } =
        ServiceCollectionExtensions.DefaultCdnAssets.Concat(FlatpickrLocales.CdnAssets)
            .Select(a => new RizzyUIVendorAsset(a.Key, a.Url, a.Integrity, LocalPathFor(a.Url)))
            .ToArray();

    /// <summary>
    /// The path of a jsDelivr URL below <see cref="RizzyUIConfig.LocalAssetPath"/>:
    /// <c>.../npm/chart.js@4.6.1/dist/chart.umd.js</c> becomes <c>chart.js@4.6.1/dist/chart.umd.js</c>, and
    /// <c>.../gh/owner/repo@v1/file.js</c> becomes <c>repo@v1/file.js</c>.
    /// </summary>
    public static string LocalPathFor(string cdnUrl)
    {
        if (cdnUrl.StartsWith(JsDelivrNpm, StringComparison.Ordinal))
            return cdnUrl[JsDelivrNpm.Length..];
        if (cdnUrl.StartsWith(JsDelivrGitHub, StringComparison.Ordinal))
        {
            var rest = cdnUrl[JsDelivrGitHub.Length..];
            var slash = rest.IndexOf('/');
            return slash < 0 ? rest : rest[(slash + 1)..];
        }
        return new Uri(cdnUrl).AbsolutePath.TrimStart('/');
    }

    /// <summary>The URL of an asset below <paramref name="localAssetPath"/>.</summary>
    internal static string LocalUrl(string localAssetPath, string cdnUrl) =>
        localAssetPath.TrimEnd('/') + "/" + LocalPathFor(cdnUrl);
}

/// <summary>A widget library file RizzyUI loads on demand.</summary>
/// <param name="Key">The logical key in <see cref="RizzyUIConfig.AssetUrls"/>.</param>
/// <param name="CdnUrl">The pinned jsDelivr URL.</param>
/// <param name="Integrity">The Subresource Integrity hash of the file.</param>
/// <param name="LocalPath">The path below <see cref="RizzyUIConfig.LocalAssetPath"/>.</param>
public sealed record RizzyUIVendorAsset(string Key, string CdnUrl, string Integrity, string LocalPath);
