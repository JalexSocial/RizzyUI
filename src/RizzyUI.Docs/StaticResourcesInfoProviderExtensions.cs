using AspNetStatic;
using Microsoft.AspNetCore.Components;
using System.Diagnostics;
using System.Reflection;
using ThrowGuard;

namespace RizzyUI.Docs;

public static class StaticResourcesInfoProviderExtensions
{
    /// <summary>
    ///		Adds all viewable razor pages in the project to 
    ///		the <see cref="StaticResourcesInfoProvider"/> instance.
    /// </summary>
    /// <remarks>
    ///		<para>
    ///			Expectes Razor Page files to be located in the Pages 
    ///			subfolder in the project root folder.
    ///		</para>
    ///		<para>
    ///			Pages considered 'viewable are those that are not 
    ///			located in a subfolder named 'Shared', or whose 
    ///			filename does not start with the '_' character.
    ///		</para>
    /// </remarks>
    /// <param name="provider">The <see cref="StaticResourcesInfoProvider"/> instance.</param>
    /// <param name="env">An instance of <see cref="IWebHostEnvironment"/>.</param>
    /// <returns>The object referenced in <paramref name="provider"/>.</returns>
    public static StaticResourcesInfoProvider AddAllProjectRazorPages(
        this StaticResourcesInfoProvider provider,
        IWebHostEnvironment env)
    {
        Throw.IfNull(provider);
        Throw.IfNull(env);

        const string razorExtension = ".cshtml";
        const StringComparison compMode = StringComparison.Ordinal;

        var sharedFolder = string.Format("{0}Shared{0}", Path.DirectorySeparatorChar);
        var pagesFolderPath = Path.Combine(env.ContentRootPath, "Pages");
        var razorPageFiles = Directory.GetFiles(pagesFolderPath, $"*{razorExtension}", SearchOption.AllDirectories);
        var razorPageRoutes = razorPageFiles
            .Where(f =>
                !f.Contains($"{Path.DirectorySeparatorChar}_", compMode) &&
                !f.Contains(sharedFolder, compMode))
            .Select(f => f
                .Replace(pagesFolderPath, string.Empty)
                .Replace(razorExtension, string.Empty)
                .Replace(Path.DirectorySeparatorChar, '/'));

        provider.Add(razorPageRoutes.Select(route => new PageResource(route)));

        return provider;
    }


    /// <summary>
    ///		Adds all CSS, JS and binary content found in the project wwwroot folder 
    ///		to the <see cref="StaticResourcesInfoProvider"/> instance.
    /// </summary>
    /// <remarks>
    ///		Any file that is not considered to be a CSS or JS file is deemed to be 
    ///		a binary resource, and therefore added as a <see cref="BinResource"/>.
    /// </remarks>
    /// <param name="provider">The <see cref="StaticResourcesInfoProvider"/> instance.</param>
    /// <param name="env">An instance of <see cref="IWebHostEnvironment"/>.</param>
    /// <returns>The object referenced in <paramref name="provider"/>.</returns>
    public static StaticResourcesInfoProvider AddAllWebRootContent(
        this StaticResourcesInfoProvider provider,
        IWebHostEnvironment env)
    {
        Throw.IfNull(provider);
        Throw.IfNull(env);

        AddWebResources(provider, env.WebRootPath, string.Empty);
        AddVirtualResources(provider, env, "/_content/RizzyUI");
        AddVirtualResources(provider, env, "/_content/Rizzy/dist");

        return provider;
    }

    private static void AddVirtualResources(StaticResourcesInfoProvider provider, IWebHostEnvironment env, string virtualPathPrefix)
    {
        var contents = env.WebRootFileProvider.GetDirectoryContents(virtualPathPrefix);
        var allWebRootFiles = contents
            .Where(f => f is { IsDirectory: false, Exists: true })
            .Select(f =>
            {
                var path = f.PhysicalPath;
                return Path.GetFileName(f.PhysicalPath) ?? string.Empty;
            }).ToList();

        var directories = contents.Where(f => f.IsDirectory)
            .Select(f => $"{virtualPathPrefix}/{f.Name}");

        foreach (var directory in directories)
        {
            AddVirtualResources(provider, env, directory);
        }

        string[] cssExts = [".css", ".scss"];
        string[] jsExts = [".js", ".js.map", ".json"];

        var comparer = StringComparer.OrdinalIgnoreCase;

        provider.Add(allWebRootFiles
                .Where(r => !string.IsNullOrEmpty(r) && cssExts.Contains(Path.GetExtension(r), comparer))
                .Select(r => new CssResource($"{virtualPathPrefix}/{r}") { Route = $"{virtualPathPrefix}/{r}" }))
            ;

        provider.Add(allWebRootFiles
                .Where(r => !string.IsNullOrEmpty(r) && jsExts.Contains(Path.GetExtension(r), comparer))
                .Select(r => new JsResource($"{virtualPathPrefix}/{r}") { Route = $"{virtualPathPrefix}/{r}" }))
            ;

        provider.Add(allWebRootFiles
                .Where(r =>
                    !cssExts.Contains(Path.GetExtension(r), comparer) &&
                    !jsExts.Contains(Path.GetExtension(r), comparer) &&
                    Path.GetExtension(r) != ".gz"
                )
                .Select(r => new BinResource($"{virtualPathPrefix}/{r}") { Route = $"{virtualPathPrefix}/{r}" }))
            ;

        foreach (var file in allWebRootFiles)
        {
            Debug.WriteLine($"Processing {virtualPathPrefix}/{file}");
        }
    }

    private static void AddWebResources(StaticResourcesInfoProvider provider, string path, string virtualPathPrefix)
    {
        var webRootPath = path;
        var allWebRootFiles = Directory
                .GetFiles(webRootPath, "*.*", SearchOption.AllDirectories)
                .Select(f => f
                    .Replace(webRootPath, string.Empty)
                    .Replace(Path.DirectorySeparatorChar, '/')).ToList();
        ;

        foreach (var file in allWebRootFiles)
        {
            Debug.WriteLine($"Processing {file}");
        }

        string[] cssExts = [".css", ".scss"];
        string[] jsExts = [".js", ".js.map", ".json"];

        var comparer = StringComparer.OrdinalIgnoreCase;

        provider.Add(allWebRootFiles
                .Where(r => cssExts.Contains(Path.GetExtension(r), comparer))
                .Select(r => new CssResource(r) { Route = $"{virtualPathPrefix}{r}" }))
            ;

        provider.Add(allWebRootFiles
                .Where(r => jsExts.Contains(Path.GetExtension(r), comparer))
                .Select(r => new JsResource(r) { Route = $"{virtualPathPrefix}{r}" }))
            ;

        provider.Add(allWebRootFiles
                .Where(r =>
                    !cssExts.Contains(Path.GetExtension(r), comparer) &&
                    !jsExts.Contains(Path.GetExtension(r), comparer)
                )
                .Select(r => new BinResource(r) { Route = $"{virtualPathPrefix}{r}" }))
            ;
    }

    public static StaticResourcesInfoProvider AddAllBlazorPages(
        this StaticResourcesInfoProvider provider)
    {
        provider.Add(GetPageResources());
        return provider;
    }

    private static IEnumerable<PageResource> GetPageResources() =>
                GetAllRoutes().Select(route => route.EndsWith("/") ? new PageResource(route) { OutFile = "index.html" } : new PageResource(route));

    private static string[] GetAllRoutes()
    {
        var routeTemplates = new List<string>();

        // Get all assemblies loaded in the current application domain
        var assemblies = AppDomain.CurrentDomain.GetAssemblies();

        foreach (var assembly in assemblies)
        {
            IEnumerable<Type> types;

            try
            {
                // Get all public types defined in the assembly
                types = assembly.ExportedTypes;
            }
            catch (ReflectionTypeLoadException ex)
            {
                // Handle exceptions for types that can't be loaded
                types = (IEnumerable<Type>)ex.Types.Where(t => t != null);
            }
            catch
            {
                // Skip assemblies that can't be loaded
                continue;
            }

            foreach (var type in types)
            {
                // Check if the type is a Blazor component
                if (typeof(ComponentBase).IsAssignableFrom(type))
                {
                    // Get all RouteAttributes applied to the component
                    var routeAttributes = type.GetCustomAttributes<RouteAttribute>(inherit: false);

                    foreach (var routeAttribute in routeAttributes)
                    {
                        // Original route template
                        var route = routeAttribute.Template;

                        // Add the modified route template to the list
                        routeTemplates.Add(route);
                    }
                }
            }
        }

        // Return an array of distinct route templates
        return routeTemplates.Distinct().ToArray();
    }
}