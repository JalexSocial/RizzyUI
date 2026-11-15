using System.Text.RegularExpressions;
using System.Xml.Linq;

namespace RizzyUI.Tests.Localization;

/// <summary>
/// Guards against resource keys that are used by components but missing from the English
/// resources. A missing key renders the raw key (for example <c>aria-label="RzSheet.CloseButtonAriaLabel"</c>)
/// to assistive technology.
/// </summary>
public partial class LocalizationKeyCoverageTests
{
    [GeneratedRegex("""Localizer\["(?<key>[^"]+)"\]""")]
    private static partial Regex LocalizerKeyRegex();

    [Fact]
    public void EveryLocalizerKeyUsedByTheLibrary_ExistsInEnglishResources()
    {
        var libraryRoot = FindLibraryRoot();
        var englishKeys = ReadResourceKeys(Path.Combine(libraryRoot, "Resources", "RizzyLocalization.en.resx"));

        var usedKeys = Directory
            .EnumerateFiles(libraryRoot, "*.*", SearchOption.AllDirectories)
            .Where(path => path.EndsWith(".razor", StringComparison.Ordinal) || path.EndsWith(".cs", StringComparison.Ordinal))
            .Where(path => !IsBuildOutput(path))
            .SelectMany(path => LocalizerKeyRegex().Matches(File.ReadAllText(path))
                .Select(match => (Key: match.Groups["key"].Value, File: Path.GetRelativePath(libraryRoot, path))))
            .ToList();

        Assert.NotEmpty(usedKeys);

        var missing = usedKeys
            .Where(usage => !englishKeys.Contains(usage.Key))
            .Select(usage => $"{usage.Key} ({usage.File})")
            .Distinct()
            .OrderBy(entry => entry, StringComparer.Ordinal)
            .ToList();

        Assert.True(missing.Count == 0, "Keys used by components but missing from RizzyLocalization.en.resx:\n" + string.Join("\n", missing));
    }

    [Fact]
    public void LibraryDeclaresEnglishAsNeutralResourcesLanguage()
    {
        // Partial translations fall back to English instead of rendering raw keys.
        var attribute = typeof(RizzyLocalization).Assembly
            .GetCustomAttributes(typeof(System.Resources.NeutralResourcesLanguageAttribute), false)
            .Cast<System.Resources.NeutralResourcesLanguageAttribute>()
            .SingleOrDefault();

        Assert.NotNull(attribute);
        Assert.Equal("en", attribute!.CultureName);
        Assert.Equal(System.Resources.UltimateResourceFallbackLocation.Satellite, attribute.Location);
    }

    private static HashSet<string> ReadResourceKeys(string resxPath)
    {
        var document = XDocument.Load(resxPath);
        return document.Root!
            .Elements("data")
            .Select(element => (string?)element.Attribute("name"))
            .Where(name => !string.IsNullOrEmpty(name))
            .Select(name => name!)
            .ToHashSet(StringComparer.Ordinal);
    }

    private static bool IsBuildOutput(string path)
    {
        var separators = new[] { Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar };
        var segments = path.Split(separators, StringSplitOptions.RemoveEmptyEntries);
        return segments.Contains("obj") || segments.Contains("bin") || segments.Contains("node_modules") || segments.Contains("wwwroot");
    }

    private static string FindLibraryRoot()
    {
        var directory = new DirectoryInfo(AppContext.BaseDirectory);
        while (directory is not null)
        {
            var candidate = Path.Combine(directory.FullName, "src", "RizzyUI", "RizzyUI.csproj");
            if (File.Exists(candidate))
                return Path.GetDirectoryName(candidate)!;

            var sibling = Path.Combine(directory.FullName, "RizzyUI", "RizzyUI.csproj");
            if (File.Exists(sibling))
                return Path.GetDirectoryName(sibling)!;

            directory = directory.Parent;
        }

        throw new InvalidOperationException("Could not locate src/RizzyUI from the test output directory.");
    }
}
