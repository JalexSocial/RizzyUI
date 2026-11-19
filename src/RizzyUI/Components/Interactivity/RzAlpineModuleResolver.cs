using System.Collections.Concurrent;
using System.Text;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;

namespace RizzyUI;

/// <summary>
/// Resolves the URL of a component's Alpine code-behind module (<c>Component.razor.js</c>) and the
/// Alpine data name it is registered under.
/// </summary>
/// <remarks>
/// <para>
/// With <c>MapStaticAssets()</c> every module has a fingerprinted URL
/// (<c>Counter.ezjsubrzj2.razor.js</c>) that browsers may cache for a year. Pages rendered by
/// <c>MapRazorComponents</c> resolve it through <see cref="ComponentBase"/>'s <c>Assets</c>; htmx
/// fragments rendered by other endpoints (minimal APIs, controllers) have no asset collection, so the
/// resolver falls back to the collection any Razor components endpoint carries. Without
/// <c>MapStaticAssets()</c> (or in a static export) the plain URL is used.
/// </para>
/// <para>
/// The generated data name includes a hash of that URL. A new deployment changes the fingerprint,
/// so markup from the new version gets a new name and loads the new module, even on a page that
/// loaded the previous version.
/// </para>
/// </remarks>
internal sealed class RzAlpineModuleResolver(IServiceProvider services)
{
    private static readonly ConcurrentDictionary<Type, string> _assetKeys = new();
    private readonly object _gate = new();
    private ResourceAssetCollection? _endpointAssets;
    private bool _searched;

    /// <summary>
    /// The static asset key (no leading slash) of the module for <paramref name="componentType"/>,
    /// for example <c>Components/Counter.razor.js</c> or <c>_content/MyLib/Counter.razor.js</c>.
    /// </summary>
    public static string GetAssetKey(Type componentType) =>
        _assetKeys.GetOrAdd(componentType, static type => RzAlpineComponent.GetComponentModulePath(type)!.TrimStart('/'));

    /// <summary>
    /// The URL (without the request path base) to load the module from: fingerprinted when the
    /// app's static asset manifest knows the module, otherwise the plain path.
    /// </summary>
    public string ResolveUrl(string assetKey, ResourceAssetCollection? pageAssets)
    {
        var resolved = TryResolve(pageAssets, assetKey) ?? TryResolve(GetEndpointAssets(), assetKey) ?? assetKey;
        return "/" + resolved.TrimStart('/');
    }

    private static string? TryResolve(ResourceAssetCollection? assets, string key)
    {
        if (assets is null)
            return null;

        var url = assets[key];
        return string.Equals(url, key, StringComparison.Ordinal) ? null : url;
    }

    private ResourceAssetCollection? GetEndpointAssets()
    {
        if (_searched)
            return _endpointAssets;

        lock (_gate)
        {
            if (_searched)
                return _endpointAssets;

            try
            {
                var endpoints = services.GetService<EndpointDataSource>()?.Endpoints;
                _endpointAssets = endpoints?
                    .Select(endpoint => endpoint.Metadata.GetMetadata<ResourceAssetCollection>())
                    .FirstOrDefault(assets => assets is not null);
            }
            catch (InvalidOperationException)
            {
                // Endpoints are not built yet (for example during startup); try again next time.
                return null;
            }

            _searched = true;
            return _endpointAssets;
        }
    }

    /// <summary>
    /// The Alpine data name for a component's module: <c>rzcb_{TypeName}_{hash}</c>, where the hash
    /// is computed from the module URL. Only letters, digits and underscores, so it is a valid
    /// <c>x-data</c> expression in both the standard and the CSP build of Alpine.
    /// </summary>
    public static string CreateDataName(Type componentType, string moduleUrl)
    {
        var typeName = componentType.Name;
        var tick = typeName.IndexOf('`');
        if (tick >= 0)
            typeName = typeName[..tick];

        var builder = new StringBuilder("rzcb_", 5 + typeName.Length + 9);
        foreach (var c in typeName)
            builder.Append(char.IsAsciiLetterOrDigit(c) ? c : '_');

        builder.Append('_').Append(Fnv1a(moduleUrl).ToString("x8"));
        return builder.ToString();
    }

    private static uint Fnv1a(string value)
    {
        var hash = 2166136261u;
        foreach (var c in value)
        {
            hash ^= c;
            hash *= 16777619u;
        }
        return hash;
    }
}
