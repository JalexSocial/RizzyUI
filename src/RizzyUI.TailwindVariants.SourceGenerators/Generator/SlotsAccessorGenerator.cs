using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Text;
using System.Collections.Immutable;
using System.Text;

namespace RizzyUI.TailwindVariants.SourceGenerators;

[Generator]
public class SlotsAccessorGenerator : IIncrementalGenerator
{
    private const string ISlotsInterfaceName = "RizzyUI.TailwindVariants.ISlots";
    private const string SlotAttributeName = "RizzyUI.TailwindVariants.SlotAttribute";

    public void Initialize(IncrementalGeneratorInitializationContext context)
    {
        var sharedStateProvider = context.CompilationProvider.Select((comp, _) =>
        {
            var iSlotsSymbol = comp.GetTypeByMetadataName(ISlotsInterfaceName);
            var slotAttributeSymbol = comp.GetTypeByMetadataName(SlotAttributeName);
            return new SharedGeneratorState(iSlotsSymbol, slotAttributeSymbol);
        });

        var syntaxProvider = context.SyntaxProvider
            .CreateSyntaxProvider(
                predicate: static (node, _) => node is TypeDeclarationSyntax tds && tds.Identifier.Text.Contains("Slots"),
                transform: static (ctx, _) => ctx
            );

        var combinedProvider = syntaxProvider.Combine(sharedStateProvider);

        var candidates = combinedProvider.Select((tuple, ct) =>
            {
                var (syntaxContext, state) = tuple;
                return GetSemanticTargetForGeneration(syntaxContext, ct, state);
            })
            .Where(static s => s is not null);

        context.RegisterSourceOutput(candidates, GenerateForSlotsType);
    }

    private static void GenerateForSlotsType(SourceProductionContext spc, SlotsAccessorToGenerate? gen)
    {
        if (gen is not SlotsAccessorToGenerate accessor) return;

        // CORRECTED: Re-added explicit validation for the Slots class itself.
        if (!IsPartial(accessor.SlotsSymbol))
        {
            spc.ReportDiagnostic(Diagnostic.Create(DiagnosticHelper.MustBePartial, accessor.Location, accessor.Name));
            return;
        }

        var validationDiagnostic = ValidateHierarchy(accessor.ComponentSymbol);
        if (validationDiagnostic is not null)
        {
            spc.ReportDiagnostic(validationDiagnostic);
            return;
        }

        if (accessor.Properties.IsEmpty)
        {
            spc.ReportDiagnostic(Diagnostic.Create(DiagnosticHelper.NoPropertiesDescriptor, accessor.Location, accessor.Name));
            return;
        }

        var componentFullName = accessor.ComponentFullName;
        var slotsFullName = accessor.FullName;
        var slotsMapName = $"SlotsMap<{slotsFullName}>";
        var extClassName = SymbolHelper.MakeSafeIdentifier($"{accessor.TypeName}SlotsExtensions");
        var filename = SymbolHelper.MakeSafeFileName($"{componentFullName}.g.cs");

        var sb = new Indenter();
        WritePreamble(sb, accessor.NamespaceName);
        WriteNestedOpenings(sb, accessor.ComponentSymbol);
        WriteISlotsClass(sb, accessor.SlotsSymbol, accessor.Properties, accessor.Slots);
        WriteEnum(sb, "SlotsTypes", accessor.Properties);
        WriteNamesHelper(sb, "SlotNames", "SlotsTypes", accessor.Properties, accessor.Slots);
        WriteNestedClosings(sb, accessor.ComponentSymbol);
        WriteExtensions(sb, extClassName, $"{componentFullName}.SlotsTypes", $"{componentFullName}.SlotNames", slotsMapName, slotsFullName, accessor.Properties);
        WritePragmaClosing(sb);

        spc.AddSource(filename, SourceText.From(sb.ToString(), Encoding.UTF8));
    }

    private static SlotsAccessorToGenerate? GetSemanticTargetForGeneration(GeneratorSyntaxContext ctx, CancellationToken ct, SharedGeneratorState state)
    {
        if (state.ISlotsSymbol is null || state.SlotAttributeSymbol is null) return null;

        var typeDeclaration = (TypeDeclarationSyntax)ctx.Node;
        if (ctx.SemanticModel.GetDeclaredSymbol(typeDeclaration, ct) is not INamedTypeSymbol symbol) return null;

        bool implementsISlots = symbol.AllInterfaces.Contains(state.ISlotsSymbol, SymbolEqualityComparer.Default);
        if (!implementsISlots || symbol.ContainingType is null) return null;

        var componentType = symbol.ContainingType;
        var (properties, slotNames) = CollectSlotProperties(symbol, state.SlotAttributeSymbol);

        var qualifiedFormat = new SymbolDisplayFormat(
            typeQualificationStyle: SymbolDisplayTypeQualificationStyle.NameAndContainingTypesAndNamespaces,
            globalNamespaceStyle: SymbolDisplayGlobalNamespaceStyle.Omitted);

        return new SlotsAccessorToGenerate(
            Name: symbol.Name,
            FullName: symbol.ToDisplayString(qualifiedFormat),
            TypeName: componentType.Name,
            NamespaceName: symbol.ContainingNamespace?.ToDisplayString() ?? string.Empty,
            Properties: properties,
            Slots: slotNames,
            ComponentFullName: componentType.ToDisplayString(qualifiedFormat),
            SlotsSymbol: symbol,
            ComponentSymbol: componentType)
        {
            Location = symbol.Locations.FirstOrDefault()
        };
    }

    #region Helpers

    private static (ImmutableArray<string> properties, ImmutableArray<string> slotNames) CollectSlotProperties(INamedTypeSymbol type, INamedTypeSymbol slotAttributeSymbol)
    {
        var properties = type.GetMembers()
            .OfType<IPropertySymbol>()
            .Where(p => !p.IsStatic && p.DeclaredAccessibility == Accessibility.Public && p.Type.SpecialType == SpecialType.System_String && p.SetMethod is not null)
            .OrderBy(p => p.Locations.FirstOrDefault()?.SourceSpan.Start ?? int.MaxValue)
            .ThenBy(p => p.Name, StringComparer.Ordinal)
            .ToList();

        var propertyNamesBuilder = ImmutableArray.CreateBuilder<string>(properties.Count);
        var slotNamesBuilder = ImmutableArray.CreateBuilder<string>(properties.Count);

        foreach (var p in properties)
        {
            propertyNamesBuilder.Add(p.Name);
            string slotName = p.Name;

            var attr = p.GetAttributes().FirstOrDefault(a => SymbolEqualityComparer.Default.Equals(a.AttributeClass, slotAttributeSymbol));
            if (attr?.ConstructorArguments.Length > 0 && attr.ConstructorArguments[0].Value is string s && !string.IsNullOrEmpty(s))
            {
                slotName = s;
            }
            slotNamesBuilder.Add(slotName);
        }
        return (propertyNamesBuilder.ToImmutable(), slotNamesBuilder.ToImmutable());
    }

    private static string GetTypeDeclaration(INamedTypeSymbol typeSymbol)
    {
        var mods = typeSymbol.DeclaredAccessibility switch
        {
            Accessibility.Public => "public ",
            Accessibility.Internal => "internal ",
            _ => ""
        };
        if (typeSymbol.IsSealed) mods += "sealed ";
        if (typeSymbol.IsRecord) mods += "record ";
        mods += typeSymbol.TypeKind switch
        {
            TypeKind.Struct => "partial struct",
            _ => "partial class",
        };
        return $"{mods} {typeSymbol.Name}";
    }

    private static bool IsPartial(INamedTypeSymbol typeSymbol) =>
        typeSymbol.DeclaringSyntaxReferences.Any(r => r.GetSyntax() is TypeDeclarationSyntax tds && tds.Modifiers.Any(SyntaxKind.PartialKeyword));

    private static Diagnostic? ValidateHierarchy(INamedTypeSymbol componentSymbol)
    {
        var current = componentSymbol;
        while (current != null)
        {
            if (current.TypeKind != TypeKind.Class && current.TypeKind != TypeKind.Struct)
            {
                return Diagnostic.Create(DiagnosticHelper.ContainingTypeMustBeClassOrStruct, current.Locations.FirstOrDefault(), current.Name);
            }

            if (!IsPartial(current))
            {
                var diagnostic = current.Equals(componentSymbol, SymbolEqualityComparer.Default)
                    ? DiagnosticHelper.MustBePartial
                    : DiagnosticHelper.ContainingTypeMustBePartial;
                return Diagnostic.Create(diagnostic, current.Locations.FirstOrDefault(), current.Name, componentSymbol.Name);
            }
            current = current.ContainingType;
        }
        return null;
    }

    #endregion

    #region Code Writing

    private static void WriteEnum(Indenter sb, string enumName, ImmutableArray<string> properties)
    {
        sb.AppendLine("/// <summary>");
        sb.AppendLine("/// Provides a strongly-typed enumeration of all available slots.");
        sb.AppendLine("/// </summary>");
        sb.AppendLine($"public enum {enumName}");
        sb.AppendLine("{");
        sb.Indent();
        foreach (var property in properties)
        {
            sb.AppendLine($"/// <summary>The slot corresponding to the <c>{property}</c> property.</summary>");
            sb.AppendLine($"{SymbolHelper.MakeSafeIdentifier(property)},");
        }
        sb.Dedent();
        sb.AppendLine("}");
        sb.AppendLine();
    }

    private static void WriteExtensions(Indenter sb, string extClassName, string enumFullName, string namesClassFullName, string slotsMapName, string slotsName, ImmutableArray<string> properties)
    {
        sb.AppendMultiline($"/// <summary>Provides extension methods for strongly-typed access to <see cref=\"{slotsName}\"/> via a <see cref=\"SlotsMap{{T}}\"/>.</summary>");
        sb.AppendLine($"public static class {extClassName}");
        sb.AppendLine("{");
        sb.Indent();
        sb.AppendMultiline($"/// <summary>Gets the final slot name for the specified <see cref=\"{enumFullName}\"/> key.</summary>");
        sb.AppendLine($"public static string GetName(this {slotsMapName} slots, {enumFullName} key) => {slotsName}.GetName({namesClassFullName}.NameOf(key));");
        sb.AppendLine();
        sb.AppendMultiline($"/// <summary>Gets the value of the slot identified by the specified <see cref=\"{enumFullName}\"/> key.</summary>");
        sb.AppendLine($"public static string? Get(this {slotsMapName} slots, {enumFullName} key) => slots[{namesClassFullName}.NameOf(key)];");
        foreach (var property in properties)
        {
            var safe = SymbolHelper.MakeSafeIdentifier(property);
            sb.AppendLine();
            sb.AppendMultiline($"/// <summary>Gets the value of the <c>{property}</c> slot.</summary>");
            sb.AppendLine($"public static string? Get{safe}(this {slotsMapName} slots) => slots.Get({enumFullName}.{safe});");
        }
        sb.Dedent();
        sb.AppendLine("}");
    }

    private static void WriteISlotsClass(Indenter sb, INamedTypeSymbol slotsSymbol, ImmutableArray<string> properties, ImmutableArray<string> slots)
    {
        sb.AppendLine(GetTypeDeclaration(slotsSymbol));
        sb.AppendLine("{");
        sb.Indent();
        sb.AppendLine("/// <summary>");
        sb.AppendLine("/// Enumerates all user-provided, non-empty slot overrides for runtime processing.");
        sb.AppendLine("/// </summary>");
        sb.AppendLine("/// <returns>An enumerable of (slotName, slotValue) tuples.</returns>");
        sb.AppendLine("public IEnumerable<(string Slot, string Value)> EnumerateOverrides()");
        sb.AppendLine("{");
        sb.Indent();
        foreach (var property in properties)
        {
            sb.AppendLine($"if (!string.IsNullOrWhiteSpace({property}))");
            sb.Indent();
            sb.AppendLine($"yield return (GetName(nameof({property})), {property}!);");
            sb.Dedent();
        }
        sb.Dedent();
        sb.AppendLine("}");
        sb.AppendLine();
        sb.AppendLine("/// <summary>");
        sb.AppendLine("/// Maps a C# property name to its final slot name, respecting any [Slot] attributes.");
        sb.AppendLine("/// </summary>");
        sb.AppendLine("/// <param name=\"propertyName\">The name of the property to map.</param>");
        sb.AppendLine("/// <returns>The final slot name.</returns>");
        sb.AppendLine("public static string GetName(string propertyName)");
        sb.AppendLine("{");
        sb.Indent();
        sb.AppendLine("return propertyName switch");
        sb.AppendLine("{");
        sb.Indent();
        foreach (var (property, slot) in properties.Zip(slots, (p, s) => (p, s))) sb.AppendLine($"nameof({property}) => {SymbolHelper.QuoteLiteral(slot)},");
        sb.AppendLine("_ => propertyName");
        sb.Dedent();
        sb.AppendLine("};");
        sb.Dedent();
        sb.AppendLine("}");
        sb.Dedent();
        sb.AppendLine("}");
        sb.AppendLine();
    }

    private static void WriteNamesHelper(Indenter sb, string namesClass, string enumName, ImmutableArray<string> properties, ImmutableArray<string> slots)
    {
        sb.AppendLine("/// <summary>");
        sb.AppendLine("/// Provides compile-time constants and helper methods for slot names.");
        sb.AppendLine("/// </summary>");
        sb.AppendLine($"public static class {namesClass}");
        sb.AppendLine("{");
        sb.Indent();
        foreach (var (property, slot) in properties.Zip(slots, (p, s) => (p, s)))
        {
            sb.AppendLine($"/// <summary>The final slot name for the <c>{property}</c> property: \"{slot}\".</summary>");
            sb.AppendLine($"public const string {SymbolHelper.MakeSafeIdentifier(property)} = {SymbolHelper.QuoteLiteral(slot)};");
            sb.AppendLine();
        }
        sb.AppendLine("/// <summary>An array of C# property names for all slots, in declaration order.</summary>");
        sb.AppendLine("private static readonly string[] _names = new[] { " + string.Join(", ", properties.Select(p => $"nameof({p})")) + " };");
        sb.AppendLine();
        sb.AppendLine("/// <summary>Gets a read-only list of all C# property names for the slots.</summary>");
        sb.AppendLine("public static IReadOnlyList<string> AllNames => _names;");
        sb.AppendLine();
        sb.AppendLine("/// <summary>An array of the final slot names, in declaration order.</summary>");
        sb.AppendLine("private static readonly string[] _slotNames = new[] { " + string.Join(", ", slots.Select(SymbolHelper.QuoteLiteral)) + " };");
        sb.AppendLine();
        sb.AppendLine("/// <summary>Gets a read-only list of all final slot names.</summary>");
        sb.AppendLine("public static IReadOnlyList<string> AllSlotNames => _slotNames;");
        sb.AppendLine();
        sb.AppendLine("/// <summary>Gets an enumeration of all (PropertyName, SlotName) pairs.</summary>");
        sb.AppendLine("public static IEnumerable<(string PropertyName, string SlotName)> AllPairs => _names.Zip(_slotNames, (p, s) => (p, s));");
        sb.AppendLine();
        sb.AppendLine($"/// <summary>Returns the C# property name corresponding to the given <see cref=\"{enumName}\"/> key.</summary>");
        sb.AppendLine($"public static string NameOf({enumName} key) => _names[(int)key];");
        sb.Dedent();
        sb.AppendLine("}");
        sb.AppendLine();
    }

    private static void WriteNestedClosings(Indenter sb, INamedTypeSymbol typeSymbol)
    {
        for (var current = typeSymbol; current != null; current = current.ContainingType)
        {
            sb.Dedent();
            sb.AppendLine("}");
        }
        sb.AppendLine();
    }

    private static void WriteNestedOpenings(Indenter sb, INamedTypeSymbol typeSymbol)
    {
        var typeStack = new Stack<INamedTypeSymbol>();
        for (var current = typeSymbol; current != null; current = current.ContainingType) typeStack.Push(current);
        foreach (var container in typeStack)
        {
            sb.AppendLine(GetTypeDeclaration(container));
            sb.AppendLine("{");
            sb.Indent();
        }
    }

    private static void WritePreamble(Indenter sb, string namespaceName)
    {
        sb.AppendLine("// <auto-generated />");
        sb.AppendLine();
        sb.AppendLine("#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member");
        sb.AppendLine("#pragma warning disable CS8618 // Non-nullable field is uninitialized");
        sb.AppendLine();
        sb.AppendLine("using RizzyUI.TailwindVariants;");
        sb.AppendLine("using System.Collections.Generic;");
        sb.AppendLine("using System.Linq;");
        sb.AppendLine();
        sb.AppendLine("#nullable enable");
        sb.AppendLine();
        if (!string.IsNullOrEmpty(namespaceName) && namespaceName != "<global namespace>")
        {
            sb.AppendLine($"namespace {namespaceName};");
            sb.AppendLine();
        }
    }

    private static void WritePragmaClosing(Indenter sb)
    {
        sb.AppendLine();
        sb.AppendLine("#pragma warning restore CS1591");
        sb.AppendLine("#pragma warning restore CS8618");
    }

    #endregion

    private readonly record struct SharedGeneratorState(INamedTypeSymbol? ISlotsSymbol, INamedTypeSymbol? SlotAttributeSymbol);

    private readonly record struct SlotsAccessorToGenerate(
        string Name,
        string FullName,
        string TypeName,
        string NamespaceName,
        EquatableArray<string> Properties,
        EquatableArray<string> Slots,
        string ComponentFullName,
        INamedTypeSymbol SlotsSymbol,
        INamedTypeSymbol ComponentSymbol)
    {
        public Location? Location { get; init; }
    };
}