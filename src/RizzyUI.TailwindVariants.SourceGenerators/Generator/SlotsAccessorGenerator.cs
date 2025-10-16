
    using Microsoft.CodeAnalysis;
    using Microsoft.CodeAnalysis.CSharp;
    using Microsoft.CodeAnalysis.CSharp.Syntax;
    using Microsoft.CodeAnalysis.Text;
    using System.Collections.Immutable;
    using System.Text;

    namespace RizzyUI.TailwindVariants.SourceGenerators;

    /// <summary>
    /// An incremental source generator that creates strongly-typed accessors for ISlots implementations.
    /// It automatically generates:
    /// 1. An implementation of `EnumerateOverrides` with correct `virtual`/`override` modifiers.
    /// 2. A static `GetName` method for mapping C# property names to final slot names.
    /// 3. A `SlotsTypes` enum for compile-time safe access to slots.
    /// 4. A `SlotNames` helper class with constants for final slot names and enumeration helpers.
    /// 5. Extension methods (e.g., `GetBase()`, `GetIcon()`) for convenient access to slot values from a SlotsMap.
    /// </summary>
    [Generator]
    public class SlotsAccessorGenerator : IIncrementalGenerator
    {
        private const string ISlotsInterfaceName = "RizzyUI.TailwindVariants.ISlots";
        private const string SlotAttributeName = "RizzyUI.TailwindVariants.SlotAttribute";
        private const string SlotTupleType = "global::System.Collections.Generic.IEnumerable<(string Slot, string Value)>";

        public void Initialize(IncrementalGeneratorInitializationContext context)
        {
            // Set up a shared provider for compilation-level symbols that will be used across multiple steps.
            // We rely on the single public SlotAttribute from the runtime package to avoid type identity splits.
            var sharedStateProvider = context.CompilationProvider.Select((comp, _) =>
            {
                var iSlotsSymbol = comp.GetTypeByMetadataName(ISlotsInterfaceName);
                var slotAttributeSymbol = comp.GetTypeByMetadataName(SlotAttributeName); // This may be null if the runtime library is not referenced.
                return new SharedGeneratorState(iSlotsSymbol, slotAttributeSymbol, comp);
            });

            // Find all partial type declarations with a base list, as these are potential candidates for generation.
            var syntaxProvider = context.SyntaxProvider
                .CreateSyntaxProvider(
                    predicate: static (node, _) => node is TypeDeclarationSyntax { Modifiers: var modifiers, BaseList: not null } &&
                                                   modifiers.Any(SyntaxKind.PartialKeyword),
                    transform: static (ctx, _) => (TypeDeclarationSyntax)ctx.Node
                );

            var combinedProvider = syntaxProvider.Combine(sharedStateProvider);

            // Filter down to only valid semantic targets: ISlots implementations nested within another type.
            var candidates = combinedProvider.Select((tuple, ct) =>
                {
                    var (typeDeclaration, state) = tuple;
                    return GetSemanticTargetForGeneration(typeDeclaration, state, ct);
                })
                .Where(static s => s is not null);

            // Register the final source output step.
            context.RegisterSourceOutput(candidates, GenerateForSlotsType);
        }

        /// <summary>
        /// The main generation logic for a valid ISlots implementation.
        /// </summary>
        private static void GenerateForSlotsType(SourceProductionContext spc, SlotsAccessorToGenerate? gen)
        {
            if (gen is not { } accessor) return;

            // Validate that the entire containing type hierarchy (for both the component and the slots class)
            // is 'partial' and consists of supported kinds (class/struct).
            var validationDiagnostics = ValidateHierarchy(accessor.ComponentSymbol);
            validationDiagnostics.AddRange(ValidateHierarchy(accessor.SlotsSymbol));
            if (validationDiagnostics.Count > 0)
            {
                foreach (var diagnostic in validationDiagnostics) spc.ReportDiagnostic(diagnostic);
                return;
            }

            // Disallow struct Slots: the generator relies on class inheritance (virtual/override), which structs do not support.
            if (accessor.SlotsSymbol.TypeKind != TypeKind.Class)
            {
                spc.ReportDiagnostic(Diagnostic.Create(
                    DiagnosticHelper.SlotsMustBeClass,
                    accessor.SlotsSymbol.Locations.FirstOrDefault(),
                    accessor.SlotsSymbol.Name));
                return;
            }

            if (accessor.Properties.IsEmpty)
            {
                spc.ReportDiagnostic(Diagnostic.Create(DiagnosticHelper.NoPropertiesDescriptor, accessor.Location, accessor.Name));
                return;
            }

            // Analyze the inheritance of the Slots class to determine if we need 'virtual' or 'override'.
            var inheritanceInfo = AnalyzeInheritance(accessor.SlotsSymbol, accessor.SharedState.Compilation);

            var sb = new Indenter();
            WritePreamble(sb, accessor.NamespaceName);
            WriteNestedOpenings(sb, accessor.ComponentSymbol);
            WriteISlotsClass(sb, accessor.SlotsSymbol, accessor.Properties, inheritanceInfo);
            WriteEnum(sb, "SlotsTypes", accessor.Properties);
            WriteNamesHelper(sb, "SlotNames", "SlotsTypes", accessor.Properties, slotsTypeSimple: accessor.SlotsSymbol.Name);
            WriteNestedClosings(sb, accessor.ComponentSymbol);
            WriteExtensions(sb, accessor.TypeName, accessor.ComponentFullName, accessor.FullName, accessor.Properties);
            WritePragmaClosing(sb);

            // Use a hash of the fully qualified name to ensure a unique filename and avoid path length issues.
            var hintName = $"{accessor.ComponentSymbol.Name}.{SymbolHelper.Hash(accessor.ComponentFullName)}.g.cs";
            spc.AddSource(hintName, SourceText.From(sb.ToString(), Encoding.UTF8));
        }

        /// <summary>
        /// Performs semantic analysis to determine if a syntax node is a valid target for code generation.
        /// </summary>
        /// <returns>A data record for generation if valid, otherwise null.</returns>
        private static SlotsAccessorToGenerate? GetSemanticTargetForGeneration(TypeDeclarationSyntax typeDeclaration, SharedGeneratorState state, CancellationToken ct)
        {
            if (state.ISlotsSymbol is null) return null;

            var semanticModel = state.Compilation.GetSemanticModel(typeDeclaration.SyntaxTree);
            if (semanticModel.GetDeclaredSymbol(typeDeclaration, ct) is not INamedTypeSymbol symbol) return null;

            // Generation is only triggered for ISlots implementations that are nested within a component class.
            bool implementsISlots = symbol.AllInterfaces.Contains(state.ISlotsSymbol, SymbolEqualityComparer.Default);
            if (!implementsISlots || symbol.ContainingType is null) return null;

            var componentType = symbol.ContainingType;
            var properties = CollectSlotProperties(symbol, state.SlotAttributeSymbol);

            return new SlotsAccessorToGenerate(
                Name: symbol.Name,
                FullName: symbol.ToDisplayString(SymbolHelper.FullyQualifiedFormat),
                TypeName: componentType.Name,
                NamespaceName: symbol.ContainingNamespace?.ToDisplayString() ?? string.Empty,
                Properties: properties,
                ComponentFullName: componentType.ToDisplayString(SymbolHelper.FullyQualifiedFormat),
                SlotsSymbol: symbol,
                ComponentSymbol: componentType,
                SharedState: state)
            {
                Location = symbol.Locations.FirstOrDefault()
            };
        }

        #region Helpers

        /// <summary>
        /// Analyzes the inheritance of an ISlots implementation to determine if it overrides a base method.
        /// </summary>
        /// <returns>InheritanceInfo indicating if `EnumerateOverrides` should be an override.</returns>
        private static InheritanceInfo AnalyzeInheritance(INamedTypeSymbol symbol, Compilation compilation)
        {
            var iSlotsSymbol = compilation.GetTypeByMetadataName(ISlotsInterfaceName);
            if (iSlotsSymbol is null) return new InheritanceInfo(false);

            // To determine if `EnumerateOverrides` should be `override`, we check if any base type
            // also implements ISlots. If so, we can infer that the source generator will have created a
            // virtual `EnumerateOverrides` method on that base type, which we must then override.
            for (var baseType = symbol.BaseType; baseType is not null && baseType.SpecialType != SpecialType.System_Object; baseType = baseType.BaseType)
            {
                if (baseType.AllInterfaces.Contains(iSlotsSymbol, SymbolEqualityComparer.Default))
                {
                    return new InheritanceInfo(true);
                }
            }

            return new InheritanceInfo(false);
        }

        /// <summary>
        /// Collects all public, instance, string properties from the given type and its base types,
        /// resolving the final slot name for each. If the attribute is absent, property names are used.
        /// The order is guaranteed to be stable: base class properties first, then derived, with declaration
        /// order preserved within each type.
        /// </summary>
        /// <returns>An equatable array of (PropertyName, SlotName) tuples.</returns>
        private static EquatableArray<(string, string)> CollectSlotProperties(INamedTypeSymbol type, INamedTypeSymbol? slotAttributeSymbol)
        {
            // Build inheritance chain base->derived
            var chain = new Stack<INamedTypeSymbol>();
            for (var t = type; t is not null && t.SpecialType != SpecialType.System_Object; t = t.BaseType)
                chain.Push(t);

            // Use a dictionary to handle overrides: derived properties replace base properties.
            // The final list will be ordered by the stable chain.
            var finalProperties = new Dictionary<string, IPropertySymbol>(StringComparer.Ordinal);
            var order = new List<string>();

            while (chain.Count > 0)
            {
                var t = chain.Pop();
                var propsInDeclOrder = t.GetMembers()
                    .OfType<IPropertySymbol>()
                    .Where(p =>
                        !p.IsStatic &&
                        p.DeclaredAccessibility == Accessibility.Public &&
                        p.Type.SpecialType == SpecialType.System_String &&
                        p.GetMethod is not null)
                    .OrderBy(p => p.DeclaringSyntaxReferences.FirstOrDefault()?.Span.Start ?? int.MaxValue)
                    .ToList();

                foreach (var p in propsInDeclOrder)
                {
                    if (!finalProperties.ContainsKey(p.Name))
                    {
                        order.Add(p.Name);
                    }
                    finalProperties[p.Name] = p; // Derived overrides base
                }
            }

            var builder = ImmutableArray.CreateBuilder<(string, string)>(order.Count);
            foreach (var propertyName in order)
            {
                var p = finalProperties[propertyName];
                string slotName = propertyName; // Default slot name

                // Check for [Slot("...")] attribute to override the slot name.
                var attr = slotAttributeSymbol is null ? null
                    : p.GetAttributes().FirstOrDefault(a => SymbolEqualityComparer.Default.Equals(a.AttributeClass, slotAttributeSymbol));

                if (attr?.ConstructorArguments.Length > 0 && attr.ConstructorArguments[0].Value is string s && !string.IsNullOrEmpty(s))
                {
                    slotName = s;
                }
                builder.Add((propertyName, slotName));
            }
            return new EquatableArray<(string, string)>(builder.ToImmutable());
        }

        /// <summary>
        /// Generates the full text of a type declaration (e.g., "public partial class MyClass<T> where T : new()").
        /// </summary>
        private static string GetTypeDeclaration(INamedTypeSymbol typeSymbol)
        {
            // We find the syntax declaration with the most information (modifiers, constraints) to create the most accurate signature.
            var decl = typeSymbol.DeclaringSyntaxReferences
                .Select(r => r.GetSyntax())
                .OfType<TypeDeclarationSyntax>()
                .OrderByDescending(t => t.Modifiers.Count + t.ConstraintClauses.Count)
                .FirstOrDefault();

            if (decl is null)
            {
                // Fallback for types without a rich declaration in the current compilation.
                return typeSymbol.ToDisplayString(SymbolHelper.FullDeclarationFormat).Replace(typeSymbol.Name, "partial " + typeSymbol.Name);
            }

            var hasPartial = decl.Modifiers.Any(m => m.IsKind(SyntaxKind.PartialKeyword));
            var modifiers = hasPartial ? decl.Modifiers : decl.Modifiers.Add(SyntaxFactory.Token(SyntaxKind.PartialKeyword));

            var modsText = string.Join(" ", modifiers.Select(m => m.Text)).Trim();
            if (!string.IsNullOrEmpty(modsText)) modsText += " ";

            var identifier = decl.Identifier.Text;
            var typeParams = decl.TypeParameterList?.ToFullString() ?? string.Empty;
            var constraints = decl.ConstraintClauses.Count > 0
                ? " " + string.Concat(decl.ConstraintClauses.Select(c => c.ToFullString()))
                : string.Empty;

            if (decl is RecordDeclarationSyntax rds)
            {
                var ks = rds.ClassOrStructKeyword.RawKind != 0 ? " " + rds.ClassOrStructKeyword.Text : "";
                return $"{modsText}{rds.Keyword.Text}{ks} {identifier}{typeParams}{constraints}".TrimEnd();
            }

            return $"{modsText}{decl.Keyword.Text} {identifier}{typeParams}{constraints}".TrimEnd();
        }

        /// <summary>
        /// Validates that a type and all its containing types are declared as 'partial' and are of a supported kind.
        /// </summary>
        private static List<Diagnostic> ValidateHierarchy(INamedTypeSymbol typeSymbol)
        {
            var diagnostics = new List<Diagnostic>();
            var current = typeSymbol;
            while (current != null)
            {
                bool isPartial = current.DeclaringSyntaxReferences.Any(r => r.GetSyntax() is TypeDeclarationSyntax tds && tds.Modifiers.Any(SyntaxKind.PartialKeyword));

                if (!isPartial)
                {
                    if (current.Equals(typeSymbol, SymbolEqualityComparer.Default))
                    {
                        // TVSG002: "{0}" = the type that must be partial
                        diagnostics.Add(Diagnostic.Create(
                            DiagnosticHelper.MustBePartial,
                            current.Locations.FirstOrDefault(),
                            current.Name));
                    }
                    else
                    {
                        // TVSG003: "{0}" = containing type, "{1}" = component/slots type
                        diagnostics.Add(Diagnostic.Create(
                            DiagnosticHelper.ContainingTypeMustBePartial,
                            current.Locations.FirstOrDefault(),
                            current.Name,
                            typeSymbol.Name));
                    }
                }

                // Guard against unsupported kind (interfaces, etc.)
                if (current.TypeKind is not (TypeKind.Class or TypeKind.Struct))
                {
                    diagnostics.Add(Diagnostic.Create(
                        DiagnosticHelper.ContainingTypeMustBeClassOrStruct,
                        current.Locations.FirstOrDefault(),
                        current.Name,
                        typeSymbol.Name));
                }
                current = current.ContainingType;
            }
            return diagnostics;
        }

        #endregion

        #region Code Writing

        private static void WriteEnum(Indenter sb, string enumName, EquatableArray<(string, string)> properties)
        {
            sb.AppendLine("/// <summary>");
            sb.AppendLine("/// Provides a strongly-typed enumeration of all available slots.");
            sb.AppendLine("/// Note: The order is stable (base class slots first, then derived, preserving declaration order).");
            sb.AppendLine("/// </summary>");
            sb.AppendLine($"public enum {enumName}");
            sb.AppendLine("{");
            sb.Indent();
            foreach (var (propertyName, _) in properties)
            {
                sb.AppendLine($"/// <summary>The slot corresponding to the <c>{propertyName}</c> property.</summary>");
                sb.AppendLine($"{SymbolHelper.MakeSafeIdentifier(propertyName)},");
            }
            sb.Dedent();
            sb.AppendLine("}");
            sb.AppendLine();
        }

        private static void WriteExtensions(Indenter sb, string typeName, string componentFullName, string slotsFullName, EquatableArray<(string, string)> properties)
        {
            var extClassName = SymbolHelper.MakeSafeIdentifier($"{typeName}SlotsExtensions");
            var enumFullName = $"{componentFullName}.SlotsTypes";
            var namesClassFullName = $"{componentFullName}.SlotNames";
            var slotsMapName = $"SlotsMap<{slotsFullName}>";

            sb.AppendMultiline($"/// <summary>Provides extension methods for strongly-typed access to <see cref=\"{slotsFullName}\"/> via a <see cref=\"SlotsMap{{T}}\"/>.</summary>");
            sb.AppendLine($"public static class {extClassName}");
            sb.AppendLine("{");
            sb.Indent();
            sb.AppendMultiline($"/// <summary>Gets the final slot name for the specified <see cref=\"{enumFullName}\"/> key.</summary>");
            sb.AppendLine($"public static string GetName(this {slotsMapName} slots, {enumFullName} key) => {slotsFullName}.GetName({namesClassFullName}.NameOf(key));");
            sb.AppendLine();
            sb.AppendMultiline($"/// <summary>Gets the value of the slot identified by the specified <see cref=\"{enumFullName}\"/> key.</summary>");
            sb.AppendLine($"public static string? Get(this {slotsMapName} slots, {enumFullName} key) => slots[{namesClassFullName}.NameOf(key)];");
            foreach (var (propertyName, _) in properties)
            {
                var safe = SymbolHelper.MakeSafeIdentifier(propertyName);
                sb.AppendLine();
                sb.AppendMultiline($"/// <summary>Gets the value of the <c>{propertyName}</c> slot.</summary>");
                sb.AppendLine($"public static string? Get{safe}(this {slotsMapName} slots) => slots.Get({enumFullName}.{safe});");
            }
            sb.Dedent();
            sb.AppendLine("}");
        }

        private static void WriteISlotsClass(Indenter sb, INamedTypeSymbol slotsSymbol, EquatableArray<(string, string)> properties, InheritanceInfo inheritanceInfo)
        {
            sb.AppendLine(GetTypeDeclaration(slotsSymbol));
            sb.AppendLine("{");
            sb.Indent();

            // Determine the correct modifier for the EnumerateOverrides method.
            // If the base class implements ISlots, we must override its (virtual) method.
            // If this is the first in the chain, we make it virtual unless the class is sealed.
            string methodModifier = inheritanceInfo.HasBaseISlotsImplementation ? "public override" : "public virtual";
            if (slotsSymbol.IsSealed)
            {
                methodModifier = inheritanceInfo.HasBaseISlotsImplementation ? "public override" : "public";
            }

            sb.AppendLine("/// <inheritdoc/>");
            sb.AppendLine($"{methodModifier} {SlotTupleType} EnumerateOverrides()");
            sb.AppendLine("{");
            sb.Indent();

            // If overriding, chain up to the base implementation first to include its properties.
            if (inheritanceInfo.HasBaseISlotsImplementation)
            {
                sb.AppendLine("foreach (var item in base.EnumerateOverrides())");
                sb.AppendLine("{");
                sb.Indent();
                sb.AppendLine("yield return item;");
                sb.Dedent();
                sb.AppendLine("}");
                sb.AppendLine();
            }

            // Get the set of properties declared *only* on the current type, ensuring they match our collection criteria.
            var declaredProperties = slotsSymbol.GetMembers()
                .OfType<IPropertySymbol>()
                .Where(p =>
                    !p.IsStatic &&
                    p.DeclaredAccessibility == Accessibility.Public &&
                    p.Type.SpecialType == SpecialType.System_String &&
                    p.GetMethod is not null)
                .Select(p => p.Name)
                .ToImmutableHashSet();

            foreach (var (propertyName, _) in properties)
            {
                // Only yield properties declared on this specific class to avoid duplicating base class properties.
                if (declaredProperties.Contains(propertyName))
                {
                    sb.AppendLine($"var __v_{propertyName} = {propertyName};");
                    sb.AppendLine($"if (!string.IsNullOrWhiteSpace(__v_{propertyName}))");
                    sb.AppendLine("{");
                    sb.Indent();
                    sb.AppendLine($"yield return (GetName(nameof({propertyName})), __v_{propertyName});");
                    sb.Dedent();
                    sb.AppendLine("}");
                }
            }

            sb.Dedent();
            sb.AppendLine("}");
            sb.AppendLine();

            // The GetName method is always static. If a base class has one, we hide it with `new`.
            string getNameModifier = inheritanceInfo.HasBaseISlotsImplementation ? "public static new" : "public static";
            sb.AppendLine("/// <inheritdoc/>");
            sb.AppendLine($"{getNameModifier} string GetName(string propertyName)");
            sb.AppendLine("{");
            sb.Indent();
            sb.AppendLine("return propertyName switch");
            sb.AppendLine("{");
            sb.Indent();
            foreach (var (propertyName, slotName) in properties) sb.AppendLine($"nameof({propertyName}) => {SymbolHelper.QuoteLiteral(slotName)},");
            sb.AppendLine("_ => propertyName");
            sb.Dedent();
            sb.AppendLine("};");
            sb.Dedent();
            sb.AppendLine("}");
            sb.Dedent();
            sb.AppendLine("}");
            sb.AppendLine();
        }

        private static void WriteNamesHelper(Indenter sb, string namesClass, string enumName, EquatableArray<(string, string)> properties, string slotsTypeSimple = "Slots")
        {
            sb.AppendLine("/// <summary>");
            sb.AppendLine("/// Provides compile-time constants and helper methods for slot names.");
            sb.AppendLine("/// </summary>");
            sb.AppendLine($"public static class {namesClass}");
            sb.AppendLine("{");
            sb.Indent();
            foreach (var (propertyName, slotName) in properties)
            {
                sb.AppendLine($"/// <summary>The final slot name for the <c>{propertyName}</c> property: \"{slotName}\".</summary>");
                sb.AppendLine($"public const string {SymbolHelper.MakeSafeIdentifier(propertyName)} = {SymbolHelper.QuoteLiteral(slotName)};");
                sb.AppendLine();
            }

            // Property-name array (C# identifiers), in declaration order
            sb.AppendLine("/// <summary>An array of C# property names for all slots, in declaration order.</summary>");
            var propertyNames = string.Join(", ", properties.Select(p => $"nameof({slotsTypeSimple}.{p.Item1})"));
            sb.AppendLine($"private static readonly string[] _names = new[] {{ {propertyNames} }};");
            sb.AppendLine();
            sb.AppendLine("/// <summary>Gets a read-only list of all C# property names for the slots.</summary>");
            sb.AppendLine("public static global::System.Collections.Generic.IReadOnlyList<string> AllNames => global::System.Array.AsReadOnly(_names);");
            sb.AppendLine();
            sb.AppendLine($"/// <summary>Returns the C# property name corresponding to the given <see cref=\"{enumName}\"/> key.</summary>");
            sb.AppendLine($"public static string NameOf({enumName} key) => _names[(int)key];");
            sb.AppendLine();

            // Final slot-name array (after [Slot] renames), in the same order
            var slotNames = string.Join(", ", properties.Select(p => SymbolHelper.QuoteLiteral(p.Item2)));
            sb.AppendLine("/// <summary>An array of final slot names (after [Slot] mapping), in declaration order.</summary>");
            sb.AppendLine($"private static readonly string[] _slotNames = new[] {{ {slotNames} }};");
            sb.AppendLine();
            sb.AppendLine("/// <summary>Gets a read-only list of all final slot names.</summary>");
            sb.AppendLine("public static global::System.Collections.Generic.IReadOnlyList<string> AllSlotNames => global::System.Array.AsReadOnly(_slotNames);");
            sb.AppendLine();

            // Pairs view (property -> slot)
            sb.AppendLine("/// <summary>Pairs of (C# property name, final slot name), in declaration order.</summary>");
            sb.AppendLine("public static global::System.Collections.Generic.IEnumerable<(string Property, string Slot)> AllPairs");
            sb.AppendLine("{");
            sb.Indent();
            sb.AppendLine("get");
            sb.AppendLine("{");
            sb.Indent();
            sb.AppendLine("for (int i = 0; i < _names.Length; i++)");
            sb.AppendLine("{");
            sb.Indent();
            sb.AppendLine("yield return (_names[i], _slotNames[i]);");
            sb.Dedent();
            sb.AppendLine("}");
            sb.Dedent();
            sb.AppendLine("}");
            sb.Dedent();
            sb.AppendLine("}");
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
            sb.AppendLine("#pragma warning restore CS1591");
            sb.AppendLine("#pragma warning restore CS8618");
        }

        #endregion

        private readonly record struct InheritanceInfo(bool HasBaseISlotsImplementation);

        private readonly record struct SharedGeneratorState(INamedTypeSymbol? ISlotsSymbol, INamedTypeSymbol? SlotAttributeSymbol, Compilation Compilation);

        private readonly record struct SlotsAccessorToGenerate(
            string Name,
            string FullName,
            string TypeName,
            string NamespaceName,
            EquatableArray<(string, string)> Properties,
            string ComponentFullName,
            INamedTypeSymbol SlotsSymbol,
            INamedTypeSymbol ComponentSymbol,
            SharedGeneratorState SharedState)
        {
            public Location? Location { get; init; }
        };
    }