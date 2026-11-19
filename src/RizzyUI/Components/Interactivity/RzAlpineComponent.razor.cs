using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System.Reflection;
using System.Text.Json;

namespace RizzyUI;

/// <xmldoc>
/// Connects a server-rendered component to its Alpine code-behind module, the <c>.razor.js</c> file
/// next to the component. Renders the Alpine root as a wrapper element or, with <c>AsChild</c>, on
/// its single child element.
/// </xmldoc>
/// <remarks>
/// <para>
/// The component in <see cref="For"/> must be marked with <see cref="RzAlpineCodeBehindAttribute"/>.
/// The root gets <c>x-data</c> (the data name), <c>x-load</c> (the load strategy) and
/// <c>x-load-src</c> (the module URL): async-alpine loads the module when the strategy allows and
/// registers its default export as the Alpine data. No inline script is rendered, so the component
/// works in the initial page, in htmx swaps and under a strict Content Security Policy.
/// </para>
/// <para>
/// The data name is generated from the component type and the module URL unless <see cref="Name"/>
/// is set. <see cref="Props"/> is serialized into <c>data-rz-props</c> with the names written in C#
/// (see <see cref="RizzyUIConfig.CodeBehindPropsSerializerOptions"/>) and read in the module with
/// <c>this.$props</c>.
/// </para>
/// </remarks>
public partial class RzAlpineComponent : RzAsChildComponent
{
    private const string PreloadedModulesKey = "RizzyUI.RzAlpineComponent.PreloadedModules";
    private static readonly JsonSerializerOptions DefaultPropsSerializerOptions = new();

    private string _dataName = string.Empty;
    private string _moduleUrl = string.Empty;
    private string? _fallbackUrl;
    private string? _serializedProps;
    private string _loadStrategy = "eager";
    private bool _renderPreload;

    [Inject] private IServiceProvider Services { get; set; } = default!;

    /// <summary>
    /// The component instance whose co-located <c>.razor.js</c> module provides the Alpine data,
    /// usually <c>this</c>. Its type must be marked with <see cref="RzAlpineCodeBehindAttribute"/>.
    /// </summary>
    [Parameter, EditorRequired] public object For { get; set; } = default!;

    /// <summary>
    /// Optional Alpine data name used in <c>x-data</c>. By default a name is generated from the
    /// component type and the module URL (for example <c>rzcb_Counter_1a2b3c4d</c>), which cannot
    /// collide with another component and changes with each deployment of the module. Set it only
    /// when other markup refers to the component by name; the name is global to the page.
    /// </summary>
    [Parameter] public string? Name { get; set; }

    /// <summary>
    /// Optional data passed to the module as JSON. Property names stay as written in C#:
    /// <c>new { InitialCount = 10 }</c> is read as <c>this.$props.InitialCount</c>. The serializer is
    /// <see cref="RizzyUIConfig.CodeBehindPropsSerializerOptions"/>, which can switch the app to
    /// camelCase or add converters.
    /// </summary>
    [Parameter] public object? Props { get; set; }

    /// <summary>
    /// Whether to render <c>&lt;link rel="modulepreload"&gt;</c> for the module so the browser
    /// fetches it while it parses the page. Defaults to <c>true</c>; applies only to the
    /// <c>eager</c> load strategy, and the link is rendered once per request for each module.
    /// </summary>
    [Parameter] public bool Preload { get; set; } = true;

    /// <summary>
    /// The child content rendered within the Alpine root.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>The generated or explicit Alpine data name rendered in <c>x-data</c>.</summary>
    protected string DataName => _dataName;

    /// <summary>The module URL rendered in <c>x-load-src</c>, including the request path base.</summary>
    protected string ModuleUrl => _moduleUrl;

    /// <summary>Whether this render emits the module preload link.</summary>
    protected bool RenderPreload => _renderPreload;

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        if (For is null)
            throw new InvalidOperationException($"{nameof(RzAlpineComponent)} requires 'For', usually For=\"this\".");

        var componentType = For.GetType();
        var resolver = Services.GetService<RzAlpineModuleResolver>() ?? new RzAlpineModuleResolver(Services);
        var assetKey = RzAlpineModuleResolver.GetAssetKey(componentType);

        var pageAssets = GetPageAssets();
        var resolvedUrl = resolver.ResolveUrl(assetKey, pageAssets);
        var plainUrl = "/" + assetKey;

        _moduleUrl = RizzyUIConfig.ApplyPathBase(resolvedUrl, RequestPathBase);
        _fallbackUrl = resolvedUrl == plainUrl ? null : RizzyUIConfig.ApplyPathBase(plainUrl, RequestPathBase);
        _dataName = string.IsNullOrWhiteSpace(Name)
            ? RzAlpineModuleResolver.CreateDataName(componentType, resolvedUrl)
            : Name;

        // async-alpine only loads elements that have x-load; an empty strategy would never load.
        _loadStrategy = string.IsNullOrWhiteSpace(LoadStrategy) ? "eager" : LoadStrategy;
        _serializedProps = Props is null ? null : JsonSerializer.Serialize(Props, Props.GetType(), GetPropsSerializerOptions());
        _renderPreload = Preload && _loadStrategy == "eager" && MarkPreloaded(_moduleUrl);
    }

    private JsonSerializerOptions GetPropsSerializerOptions() =>
        Services.GetService<IOptions<RizzyUIConfig>>()?.Value.CodeBehindPropsSerializerOptions ?? DefaultPropsSerializerOptions;

    private ResourceAssetCollection? GetPageAssets()
    {
        try
        {
            return Assets;
        }
        catch (InvalidOperationException)
        {
            // Not attached to a renderer that provides assets (for example some test renderers).
            return null;
        }
    }

    private bool MarkPreloaded(string url)
    {
        var items = CurrentHttpContext?.Items;
        if (items is null)
            return true;

        if (items[PreloadedModulesKey] is not HashSet<string> preloaded)
        {
            preloaded = new HashSet<string>(StringComparer.Ordinal);
            items[PreloadedModulesKey] = preloaded;
        }

        return preloaded.Add(url);
    }

    /// <inheritdoc/>
    protected override RenderFragment? GetAsChildContent() => ChildContent;

    /// <inheritdoc/>
    protected override Dictionary<string, object?> GetComponentAttributes()
    {
        var attributes = new Dictionary<string, object?>(CopyAdditionalAttributes(), StringComparer.OrdinalIgnoreCase)
        {
            ["id"] = Id,
            ["class"] = AdditionalAttributes?.GetValueOrDefault("class", string.Empty)?.ToString(),
            ["data-alpine-root"] = Id,
            ["x-data"] = _dataName,
            ["x-load"] = _loadStrategy,
            ["x-load-src"] = _moduleUrl,
        };

        if (_fallbackUrl is not null)
            attributes["data-rz-module-fallback"] = _fallbackUrl;

        if (_serializedProps is not null)
            attributes["data-rz-props"] = _serializedProps;

        return attributes;
    }

    /// <summary>
    /// Computes the absolute web path to the co-located JavaScript module for a component type,
    /// from the component's <see cref="RzAlpineCodeBehindAttribute"/> (its source file path) and the
    /// assembly's <see cref="AssemblyRzAlpineCodeBehindAttribute"/> (the project directory and the
    /// static web asset base path). This is the plain path; <see cref="RzAlpineComponent"/> renders
    /// the fingerprinted URL when the app's static asset manifest has one.
    /// </summary>
    /// <param name="componentType">The component type.</param>
    /// <returns>A path starting with '/', for example <c>/Components/Counter.razor.js</c>.</returns>
    /// <exception cref="InvalidOperationException">
    /// The type is not marked with <see cref="RzAlpineCodeBehindAttribute"/>, its assembly has no
    /// <see cref="AssemblyRzAlpineCodeBehindAttribute"/>, or the source path is outside the project.
    /// </exception>
    public static string? GetComponentModulePath(Type componentType)
    {
        var componentAttr = componentType.GetCustomAttribute<RzAlpineCodeBehindAttribute>();
        if (componentAttr?.RazorFilePath is null)
            throw new InvalidOperationException(
                $"'{componentType.FullName}' has no [RzAlpineCodeBehind] attribute, so its code-behind module cannot be found. " +
                $"Add '@attribute [RzAlpineCodeBehind]' to {componentType.Name}.razor and put the module in {componentType.Name}.razor.js next to it.");

        var assembly = componentType.Assembly;
        var assemblyAttr = assembly.GetCustomAttribute<AssemblyRzAlpineCodeBehindAttribute>()
            ?? throw new InvalidOperationException(
                $"[AssemblyRzAlpineCodeBehind] is missing on '{assembly.GetName().Name}'. RizzyUI's build targets add it to projects " +
                "that reference the RizzyUI package; a project that references RizzyUI as a project must import build/RizzyUI.targets.");

        var razorFilePath = componentAttr.RazorFilePath;
        var pathPrefix = assemblyAttr.CallerFileNamePathPrefix;

        if (!razorFilePath.StartsWith(pathPrefix, StringComparison.Ordinal))
            throw new InvalidOperationException($"Cannot compute relative path for '{componentType.FullName}'. File '{razorFilePath}' does not start with prefix '{pathPrefix}'.");

        var relative = razorFilePath.Substring(pathPrefix.Length);
        // RazorFilePath is a compile-time path: a library built on Windows and run on Linux still
        // has backslashes, so normalize both separators (RZUI-054).
        var webPath = GetModuleFileName(relative).Replace('\\', '/');

        return BuildAbsoluteUrl(assemblyAttr.StaticWebAssetBasePath, webPath);
    }

    /// <summary>
    /// The module file for the file the attribute was declared in: <c>Counter.razor</c> and
    /// <c>Counter.razor.cs</c> both map to <c>Counter.razor.js</c>.
    /// </summary>
    internal static string GetModuleFileName(string sourceFile)
    {
        if (sourceFile.EndsWith(".razor.cs", StringComparison.OrdinalIgnoreCase))
            return sourceFile[..^".cs".Length] + ".js";
        if (sourceFile.EndsWith(".razor", StringComparison.OrdinalIgnoreCase))
            return sourceFile + ".js";
        return Path.ChangeExtension(sourceFile, ".razor.js");
    }

    private static string BuildAbsoluteUrl(string? basePath, string relativePath)
    {
        var b = (basePath ?? string.Empty).Trim('/');
        var r = relativePath.TrimStart('/');
        return "/" + (string.IsNullOrEmpty(b) ? r : $"{b}/{r}");
    }
}
