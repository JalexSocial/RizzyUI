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
        AddVirtualResources(provider, env, "/_content/Rizzy/js");

        return provider;
    }

    // Every file under wwwroot (and the package static assets) is copied byte for byte as a
    // BinResource, scripts and stylesheets included. As a CssResource or JsResource the generator
    // minifies the file again and writes it back as UTF-8 with a byte-order mark: its minifier cut
    // rizzyui.min.js off inside a template string containing "https://", and any change to
    // htmx.min.js breaks the integrity (SRI) hash the page declares for it, so no script ran.
    // These files are already built and minified; HTML pages are still minified by the generator.
    private static void AddVirtualResources(StaticResourcesInfoProvider provider, IWebHostEnvironment env, string virtualPathPrefix)
    {
        var contents = env.WebRootFileProvider.GetDirectoryContents(virtualPathPrefix);

        foreach (var directory in contents.Where(f => f.IsDirectory))
        {
            AddVirtualResources(provider, env, $"{virtualPathPrefix}/{directory.Name}");
        }

        var files = contents
            .Where(f => f is { IsDirectory: false, Exists: true })
            .Select(f => f.Name)
            .Where(name => !string.IsNullOrEmpty(name) && Path.GetExtension(name) != ".gz")
            .Select(name => $"{virtualPathPrefix}/{name}")
            .ToList();

        foreach (var file in files)
        {
            Debug.WriteLine($"Processing {file}");
        }

        provider.Add(files.Select(route => new BinResource(route) { Route = route }));
    }

    private static void AddWebResources(StaticResourcesInfoProvider provider, string path, string virtualPathPrefix)
    {
        var files = Directory
            .GetFiles(path, "*.*", SearchOption.AllDirectories)
            .Select(f => f
                .Replace(path, string.Empty)
                .Replace(Path.DirectorySeparatorChar, '/'))
            .ToList();

        foreach (var file in files)
        {
            Debug.WriteLine($"Processing {file}");
        }

        provider.Add(files.Select(r => new BinResource(r) { Route = $"{virtualPathPrefix}{r}" }));
    }

    public static StaticResourcesInfoProvider AddAllBlazorPages(
        this StaticResourcesInfoProvider provider)
    {
        var routes = GetAllRoutes();

        provider.Add(GetPageResources(routes));
        provider.Add(GetAllCodeBehinds());

        return provider;
    }

    private static IEnumerable<PageResource> GetPageResources(string[] routes) =>
                routes.Select(route => route.EndsWith("/") ? new PageResource(route) { OutFile = "index.html" } : new PageResource(route));

    private static Type[] GetAllComponentTypes()
    {
        var components = new List<Type>();

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
                    components.Add(type);
                }
            }
        }

        // Return an array of distinct components
        return components.ToArray();
    }

    private static string[] GetAllRoutes()
    {
        var routeTemplates = new List<string>();

        IEnumerable<Type> types = GetAllComponentTypes();

        foreach (var type in types)
        {
            // Get all RouteAttributes applied to the component
            var routeAttributes = type.GetCustomAttributes<RouteAttribute>(inherit: false);

            foreach (var routeAttribute in routeAttributes)
            {
                var route = routeAttribute.Template;

                if (IsGeneratedRoute(route))
                {
                    routeTemplates.Add(route);
                }
            }
        }

        // Return an array of distinct route templates
        return routeTemplates.Distinct().ToArray();
    }

    /// <summary>
    /// Whether a route becomes a static page. Two kinds are skipped: route templates with
    /// parameters (for example <c>/_tests/a11y/{Family}</c>), which the generator cannot turn into
    /// a file and which made it throw, leaving the app running instead of exiting; and the
    /// integration test harness under <c>/_tests</c>, which exists only for the browser tests and
    /// must not be published.
    /// </summary>
    internal static bool IsGeneratedRoute(string route) =>
        !route.Contains('{') &&
        !route.Equals("/_tests", StringComparison.OrdinalIgnoreCase) &&
        !route.StartsWith("/_tests/", StringComparison.OrdinalIgnoreCase);

    private static IEnumerable<BinResource> GetAllCodeBehinds()
    {
        var resources = new List<BinResource>();
        var types = GetAllComponentTypes();

        foreach (var type in types)
        {
            if (type.GetCustomAttribute<RzAlpineCodeBehindAttribute>() is not null)
            {
                Debug.WriteLine($"Found code-behind component: {type.FullName}");

                string? path = RzAlpineComponent.GetComponentModulePath(type);

                if (path != null)
                {
                    resources.Add(new BinResource(path));
                }
            }
        }

        return resources;
    }
}