using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Text;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Text;
using RizzyUI.TailwindVariants.SourceGenerators;
using Shouldly;

namespace RizzyUI.TailwindVariants.Tests;

public class SlotsAccessorGeneratorTests
{
    private const string CommonRuntimeTypes = """
        namespace RizzyUI.TailwindVariants
        {
            public interface ISlots { 
                string? Base { get; } 
                System.Collections.Generic.IEnumerable<(string Slot, string Value)> EnumerateOverrides();
                static abstract string GetName(string slot);
            }
            public class SlotsMap<T>
            {
                public string? this[string key] => null;
            }
        }
        """;

    [Fact]
    public void Generates_Nested_Enum_Names_And_TopLevel_Extensions_For_Simple_Slots()
    {
        var input = """
            namespace Demo.Components
            {
                public partial class MyComponent
                {
                    public sealed partial class Slots : RizzyUI.TailwindVariants.ISlots
                    {
                        public string? Base { get; set; }
                        public string? Header { get; set; }
                    }
                }
            }
            """;

        var (generated, diags) = RunGenerator(input);

        diags.ShouldNotContain(d => d.Severity == DiagnosticSeverity.Error);
        generated.Length.ShouldBe(2); // Attribute + Component file

        var combined = string.Join("\n---GEN---\n", generated.Select(gs => gs.SourceText.ToString()));

        combined.ShouldContain("partial class MyComponent");
        combined.ShouldContain("public enum SlotsTypes");
        combined.ShouldContain("public static class SlotNames");
        combined.ShouldContain("public static class MyComponentSlotsExtensions");
        combined.ShouldContain("public static string? GetHeader(this SlotsMap<Demo.Components.MyComponent.Slots> slots)");
    }

    [Fact]
    public void Handles_Nested_Component_Types_Correctly()
    {
        var input = """
            namespace Demo.NestedSample
            {
                public partial class Outer
                {
                    public partial class Inner
                    {
                        public sealed partial class Slots : RizzyUI.TailwindVariants.ISlots
                        {
                            public string? Base { get; set; }
                            public string? Footer { get; set; }
                        }
                    }
                }
            }
            """;

        var (generated, diags) = RunGenerator(input);

        diags.ShouldNotContain(d => d.Severity == DiagnosticSeverity.Error);
        generated.Length.ShouldBe(2);

        var combined = string.Join("\n---GEN---\n", generated.Select(gs => gs.SourceText.ToString()));
        combined.ShouldContain("partial class Outer");
        combined.ShouldContain("partial class Inner");
        combined.ShouldContain("public static class InnerSlotsExtensions");
        combined.ShouldContain("GetFooter(this SlotsMap<Demo.NestedSample.Outer.Inner.Slots> slots)");
    }

    [Fact]
    public void Ignores_NonString_Properties()
    {
        var input = """
            namespace Demo.Components
            {
                public partial class MyComponent
                {
                    public sealed partial class Slots : RizzyUI.TailwindVariants.ISlots
                    {
                        public string? Base { get; set; }
                        public int Count { get; set; }
                    }
                }
            }
            """;

        var (generated, diags) = RunGenerator(input);

        generated.Length.ShouldBe(2);
        var combined = string.Join("\n---GEN---\n", generated.Select(gs => gs.SourceText.ToString()));

        combined.ShouldContain("GetBase");
        combined.ShouldNotContain("GetCount");
    }

    [Fact]
    public void Reports_Diagnostic_When_No_Public_Properties()
    {
        var input = """
            namespace Demo.Components
            {
                public partial class MyComponent
                {
                    public sealed partial class Slots : RizzyUI.TailwindVariants.ISlots
                    {
                        public string? Base => null; // Satisfy interface, but not a valid property for generation
                    }
                }
            }
            """;

        var (generated, diags) = RunGenerator(input);

        generated.Length.ShouldBe(1); // Only attribute gets generated
        diags.ShouldContain(d => d.Id == "TVSG001" && d.Severity == DiagnosticSeverity.Info);
    }

    [Fact]
    public void Reports_Diagnostic_When_Slots_Not_Partial()
    {
        var input = """
            namespace Demo.Components
            {
                public partial class MyComponent
                {
                    // This class is not partial, which should be an error.
                    public sealed class Slots : RizzyUI.TailwindVariants.ISlots
                    {
                        public string? Base { get; set; }
                    }
                }
            }
            """;

        var (generated, diags) = RunGenerator(input);

        generated.Length.ShouldBe(1); // Only attribute gets generated

        // CORRECTED: Call GetMessage(null) to explicitly provide the optional argument,
        // satisfying the expression tree compiler.
        diags.ShouldContain(d => d.Severity == DiagnosticSeverity.Error &&
            d.Id == "TVSG002" &&
            d.GetMessage(null).Contains("The type 'Slots' must be declared 'partial'"));
    }

    private static (ImmutableArray<GeneratedSourceResult> Generated, ImmutableArray<Diagnostic> Diagnostics) RunGenerator(params string[] sources)
    {
        var allSources = new List<SyntaxTree>
        {
            CSharpSyntaxTree.ParseText(SourceText.From(CommonRuntimeTypes, Encoding.UTF8),
                new CSharpParseOptions(LanguageVersion.Latest, kind: SourceCodeKind.Regular))
        };

        allSources.AddRange(sources.Select(s => CSharpSyntaxTree.ParseText(SourceText.From(s, Encoding.UTF8),
            new CSharpParseOptions(LanguageVersion.Latest, kind: SourceCodeKind.Regular))));

        var refs = AppDomain.CurrentDomain.GetAssemblies()
            .Where(a => !a.IsDynamic && !string.IsNullOrEmpty(a.Location))
            .Select(a => MetadataReference.CreateFromFile(a.Location))
            .Cast<MetadataReference>()
            .ToList();

        var compilation = CSharpCompilation.Create(
            assemblyName: "GeneratorTests_" + Guid.NewGuid().ToString("N"),
            syntaxTrees: allSources,
            references: refs,
            options: new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary));

        var generator = new SlotsAccessorGenerator();
        GeneratorDriver driver = CSharpGeneratorDriver.Create(generator);
        driver = driver.RunGeneratorsAndUpdateCompilation(compilation, out _, out _);

        var runResult = driver.GetRunResult();
        var result = runResult.Results.Single();
        return (result.GeneratedSources, result.Diagnostics);
    }
}