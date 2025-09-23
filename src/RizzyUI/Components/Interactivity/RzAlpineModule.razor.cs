
    using Microsoft.AspNetCore.Components;
    using System.Collections.Concurrent;
    using System.Reflection;

    namespace RizzyUI;

    public partial class RzAlpineModule : RzComponent
    {
        private static readonly ConcurrentDictionary<Type, string?> _pathCache = new();
        private string? _modulePath;

        [Parameter, EditorRequired]
        public object For { get; set; } = default!;

        [Parameter, EditorRequired]
        public string Name { get; set; } = string.Empty;

        protected override void OnParametersSet()
        {
            if (For is null) throw new InvalidOperationException("'For' is required.");
            if (string.IsNullOrWhiteSpace(Name)) throw new InvalidOperationException("'Name' is required.");

            _modulePath = _pathCache.GetOrAdd(For.GetType(), GetComponentModulePath);
        }

        private static string? GetComponentModulePath(Type componentType)
        {
            var assembly = componentType.Assembly;
            var assemblyAttr = assembly.GetCustomAttribute<AssemblyCollocatedJSAttribute>();

            if (assemblyAttr is null)
            {
                // This is the critical failure point. The consuming project MUST have our .targets file imported.
                throw new InvalidOperationException(
                    $"The required [AssemblyCollocatedJSAttribute] is missing from assembly '{assembly.FullName}'. " +
                    "Ensure the RizzyUI NuGet package is correctly referenced and that the RizzyUI.targets file is being imported into your project's build process.");
            }

            var componentAttr = componentType.GetCustomAttribute<DiscoverCollocatedJSAttribute>();
            if (componentAttr?.RazorFilePath is null)
            {
                // This component does not have a co-located script. Return null so we render nothing.
                return null;
            }

            var razorFilePath = componentAttr.RazorFilePath;
            var pathPrefix = assemblyAttr.CallerFileNamePathPrefix;

            if (!razorFilePath.StartsWith(pathPrefix, StringComparison.Ordinal))
            {
                // This indicates a build configuration mismatch, likely related to SourceLink.
                throw new InvalidOperationException(
                    $"Could not determine the relative path for the component '{componentType.FullName}'. " +
                    $"The file path '{razorFilePath}' did not start with the expected prefix '{pathPrefix}'.");
            }

            var relativeRazorPath = razorFilePath.Substring(pathPrefix.Length);
            var jsPath = Path.ChangeExtension(relativeRazorPath, ".razor.js");

            // Ensure consistent forward slashes for web paths
            var webPath = jsPath.Replace(Path.DirectorySeparatorChar, '/');

            return $"/{assemblyAttr.StaticWebAssetBasePath}{webPath}".Replace("//", "/");
        }
    }