using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;

namespace RizzyUI.Tests.Components;

/// <summary>
/// Checks the class strings in the component sources for two class names run together without a
/// space. Tailwind reads <c>truncate[&amp;&gt;svg]:size-4</c> as one unknown class and drops both, which
/// is easy to miss in review: SidebarMenuButton's icons rendered at 24px instead of 16px, so the labels
/// of a collapsed (icon) sidebar showed at its edge.
/// </summary>
public partial class ThemeClassStringTests
{
    // An arbitrary variant ("[&>svg]:") starts a class, or follows ":" (md:[&>svg]:), "-" (has-[&...]) or
    // "!". Directly after a letter, digit, "]" or ")" it is glued to the class before it.
    [GeneratedRegex(@"\S*(?<=[A-Za-z0-9\]\)])\[&\S*")]
    private static partial Regex GluedArbitraryVariant();

    [Fact]
    public void No_class_runs_into_an_arbitrary_variant()
    {
        var components = Path.GetFullPath(Path.Combine(SourceDirectory(), "..", "..", "RizzyUI", "Components"));
        var problems = new List<string>();
        foreach (var file in Directory.EnumerateFiles(components, "*.*", SearchOption.AllDirectories)
                     .Where(f => f.EndsWith(".cs", StringComparison.Ordinal) || f.EndsWith(".razor", StringComparison.Ordinal)))
        {
            var lines = File.ReadAllLines(file);
            for (var i = 0; i < lines.Length; i++)
            {
                foreach (Match match in GluedArbitraryVariant().Matches(lines[i]))
                    problems.Add($"{Path.GetRelativePath(components, file)}:{i + 1}: {match.Value}");
            }
        }

        Assert.True(problems.Count == 0, "Classes run together (missing space):" + Environment.NewLine + string.Join(Environment.NewLine, problems));
    }

    private static string SourceDirectory([CallerFilePath] string path = "") => Path.GetDirectoryName(path)!;
}
