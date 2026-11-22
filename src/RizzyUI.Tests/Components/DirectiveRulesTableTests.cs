using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;

namespace RizzyUI.Tests.Components;

/// <summary>
/// RzDirectiveRules.g.cs is generated from the components' Razor markup by
/// eng/generate-directive-rules.py. This test derives the same facts and fails when the file is stale.
/// </summary>
public partial class DirectiveRulesTableTests
{
    [GeneratedRegex(@"<[A-Za-z][^<>]*?(?:/>|>)", RegexOptions.Singleline)]
    private static partial Regex Tag();

    [GeneratedRegex(@"\sx-show[=\s]|\sx-transition")]
    private static partial Regex Visibility();

    [GeneratedRegex(@"\s(?:x-bind:|:)([a-zA-Z][\w-]*)=")]
    private static partial Regex Binding();

    [GeneratedRegex(@"\sx-ref=""([A-Za-z_][\w]*)""")]
    private static partial Regex Ref();

    private static readonly HashSet<string> Overridable = ["role", "data-slot", "type"];

    [Fact]
    public void The_generated_table_matches_the_markup()
    {
        var components = Path.GetFullPath(Path.Combine(SourceDirectory(), "..", "..", "RizzyUI", "Components"));
        var expected = new SortedDictionary<string, string>(StringComparer.Ordinal);
        foreach (var file in Directory.EnumerateFiles(components, "*.razor", SearchOption.AllDirectories))
        {
            var source = File.ReadAllText(file);
            var roots = Tag().Matches(source).Select(m => m.Value).Where(t => t.Contains("@attributes")).ToList();
            var visibility = roots.Any(t => Visibility().IsMatch(t));
            var computed = roots.SelectMany(t => Binding().Matches(t).Select(m => m.Groups[1].Value))
                .Where(a => !Overridable.Contains(a)).Distinct().Order(StringComparer.Ordinal).ToArray();
            var refs = Ref().Matches(source).Select(m => m.Groups[1].Value).Distinct().Order(StringComparer.Ordinal).ToArray();
            if (visibility || computed.Length > 0 || refs.Length > 0)
                expected[Path.GetFileNameWithoutExtension(file)] = $"{visibility}|{string.Join(',', computed)}|{string.Join(',', refs)}";
        }

        foreach (var (name, facts) in expected)
        {
            var rule = RzDirectiveRules.ForName(name);
            Assert.True(rule is not null, $"{name} is missing from RzDirectiveRules.g.cs; run python eng/generate-directive-rules.py");
            Assert.Equal(facts, $"{rule!.ManagesVisibility}|{string.Join(',', rule.Computed)}|{string.Join(',', rule.Refs)}");
        }
        Assert.Equal(expected.Count, RzDirectiveRules.Count);
    }

    private static string SourceDirectory([CallerFilePath] string path = "") => Path.GetDirectoryName(path)!;
}
