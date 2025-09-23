using Microsoft.AspNetCore.Components;
using System.Collections.Concurrent;
using System.Reflection;

namespace RizzyUI;

public partial class RzAlpineModule : RzComponent
{
    private static readonly ConcurrentDictionary<Type, string?> _pathCache = new();
    private string? _modulePath;

    [Parameter, EditorRequired] public object For { get; set; } = default!;
    [Parameter, EditorRequired] public string Name { get; set; } = string.Empty;

    protected override void OnParametersSet()
    {
        if (For is null) throw new InvalidOperationException("'For' is required.");
        if (string.IsNullOrWhiteSpace(Name)) throw new InvalidOperationException("'Name' is required.");
        _modulePath = _pathCache.GetOrAdd(For.GetType(), GetComponentModulePath);
    }

    private static string? GetComponentModulePath(Type componentType)
    {
        var assembly = componentType.Assembly;

        // Root the attribute type to avoid trimming
        _ = typeof(AssemblyCollocatedJSAttribute);

        var assemblyAttr = assembly.GetCustomAttribute<AssemblyCollocatedJSAttribute>()
            ?? throw new InvalidOperationException(
                $"[AssemblyCollocatedJSAttribute] missing on '{assembly.FullName}'. " +
                "Ensure build/RizzyUI.targets is imported and tasks ran.");

        var componentAttr = componentType.GetCustomAttribute<DiscoverCollocatedJSAttribute>();
        if (componentAttr?.RazorFilePath is null) return null;

        var razorFilePath = componentAttr.RazorFilePath;
        var pathPrefix = assemblyAttr.CallerFileNamePathPrefix;

        if (!razorFilePath.StartsWith(pathPrefix, StringComparison.Ordinal))
            throw new InvalidOperationException(
                $"Cannot compute relative path for '{componentType.FullName}'. " +
                $"File '{razorFilePath}' does not start with prefix '{pathPrefix}'.");

        var relative = razorFilePath.Substring(pathPrefix.Length);
        var jsPath = Path.ChangeExtension(relative, ".razor.js");
        var webPath = jsPath.Replace(Path.DirectorySeparatorChar, '/');

        return BuildAbsoluteUrl(assemblyAttr.StaticWebAssetBasePath, webPath);
    }

    /// Build a root-relative URL from optional base path and relative path.
    private static string BuildAbsoluteUrl(string? basePath, string relativePath)
    {
        var b = (basePath ?? string.Empty).Trim('/');
        var r = relativePath.TrimStart('/');
        return "/" + (string.IsNullOrEmpty(b) ? r : $"{b}/{r}");
    }
}
