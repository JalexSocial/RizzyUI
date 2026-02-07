
using Microsoft.AspNetCore.Components;
using System.Collections.Concurrent;
using System.Reflection;
using System.Text.Json;

namespace RizzyUI;

/// <xmldoc>
/// A component that bridges a server-rendered Blazor component with a co-located JavaScript module,
/// registering it as an `async-alpine` component. It can render as a wrapper `div` or, using the `AsChild` pattern,
/// merge its Alpine-related attributes directly onto its single child element.
/// </xmldoc>
/// <remarks>
/// This component is the cornerstone of RizzyUI's "Alpine Code-Behind" feature. It requires the Blazor component
/// specified in the `For` parameter to be decorated with the `[RzAlpineCodeBehind]` attribute.
/// </remarks>
public partial class RzAlpineComponent : RzAsChildComponent
{
    private static readonly ConcurrentDictionary<Type, string?> _pathCache = new();
    private string? _modulePath;
    private string _serializedProps = "{}";
    private string _propsScriptId = string.Empty;

    /// <summary>
    /// A reference to the Blazor component instance that has a co-located `.razor.js` file. This is required.
    /// </summary>
    [Parameter, EditorRequired] public object For { get; set; } = default!;

    /// <summary>
    /// The name to register the Alpine.js component with. This name will be used in the `x-data` attribute. This is required.
    /// </summary>
    [Parameter, EditorRequired] public string Name { get; set; } = string.Empty;

    /// <summary>
    /// An optional C# object that will be serialized to JSON and passed to the Alpine component's factory function.
    /// </summary>
    [Parameter] public object? Props { get; set; }

    /// <summary>
    /// An optional loading strategy for `async-alpine`, corresponding to the `x-load` attribute (e.g., "visible", "idle").
    /// </summary>
    [Parameter] public string? LoadStrategy { get; set; }

    /// <summary>
    /// The child content to be rendered within the Alpine-enabled element.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        _propsScriptId = $"{Id}-props";
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        if (For is null) throw new InvalidOperationException("'For' is required.");
        if (string.IsNullOrWhiteSpace(Name)) throw new InvalidOperationException("'Name' is required.");

        _modulePath = _pathCache.GetOrAdd(For.GetType(), GetComponentModulePath);

        if (Props is not null)
        {
            _serializedProps = JsonSerializer.Serialize(Props, new JsonSerializerOptions(JsonSerializerDefaults.Web));
        }
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(AdditionalAttributes?.ToDictionary(kvp => kvp.Key, kvp => (object?)kvp.Value) ?? new Dictionary<string, object?>(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = AdditionalAttributes?.GetValueOrDefault("class", string.Empty)?.ToString(),
            ["data-alpine-root"] = Id,
            ["x-data"] = Name,
            ["x-load"] = string.IsNullOrWhiteSpace(LoadStrategy) ? string.Empty : LoadStrategy,
        };

        if (Props is not null)
        {
            attributes["data-props-id"] = _propsScriptId;
        }

        return attributes;
    }


    /// <summary>
    /// Computes the absolute web path to the co-located JavaScript module for a Blazor component type.
    /// Uses attributes applied at the assembly and component level:
    /// - <see cref="AssemblyRzAlpineCodeBehindAttribute"/> provides the static web asset base path and caller file path prefix.
    /// - <see cref="RzAlpineCodeBehindAttribute"/> on the component type provides the original Razor file path.
    /// </summary>
    /// <param name="componentType">The Blazor component <see cref="Type"/> whose module path should be resolved.</param>
    /// <returns>
    /// A URL path (starting with '/') to the component's `.razor.js` static file or null when the component does not declare a Razor file path.
    /// </returns>
    /// <exception cref="InvalidOperationException">
    /// Thrown when the assembly is not decorated with <see cref="AssemblyRzAlpineCodeBehindAttribute"/> or
    /// when the component's razor file path does not start with the expected caller file prefix.
    /// </exception>
    public static string? GetComponentModulePath(Type componentType)
    {
        var assembly = componentType.Assembly;
        _ = typeof(AssemblyRzAlpineCodeBehindAttribute);
        var assemblyAttr = assembly.GetCustomAttribute<AssemblyRzAlpineCodeBehindAttribute>()
            ?? throw new InvalidOperationException($"[AssemblyRzAlpineCodeBehindAttribute] missing on '{assembly.FullName}'.");

        var componentAttr = componentType.GetCustomAttribute<RzAlpineCodeBehindAttribute>();
        if (componentAttr?.RazorFilePath is null) return null;

        var razorFilePath = componentAttr.RazorFilePath;
        var pathPrefix = assemblyAttr.CallerFileNamePathPrefix;

        if (!razorFilePath.StartsWith(pathPrefix, StringComparison.Ordinal))
            throw new InvalidOperationException($"Cannot compute relative path for '{componentType.FullName}'. File '{razorFilePath}' does not start with prefix '{pathPrefix}'.");

        var relative = razorFilePath.Substring(pathPrefix.Length);
        var jsPath = Path.ChangeExtension(relative, ".razor.js");
        var webPath = jsPath.Replace(Path.DirectorySeparatorChar, '/');

        return BuildAbsoluteUrl(assemblyAttr.StaticWebAssetBasePath, webPath);
    }

    private static string BuildAbsoluteUrl(string? basePath, string relativePath)
    {
        var b = (basePath ?? string.Empty).Trim('/');
        var r = relativePath.TrimStart('/');
        return "/" + (string.IsNullOrEmpty(b) ? r : $"{b}/{r}");
    }
}