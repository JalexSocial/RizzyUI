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
        private const string SlotTupleType = "global::System.Collections.Generic.IEnumerable<(string Slot, string Value)>";

        public void Initialize(IncrementalGeneratorInitializationContext context)
        {
            var sharedStateProvider = context.CompilationProvider.Select((comp, _) =>
            {
                var iSlotsSymbol = comp.GetTypeByMetadataName(ISlotsInterfaceName);
                var slotAttributeSymbol = comp.GetTypeByMetadataName(SlotAttributeName);
                return new SharedGeneratorState(iSlotsSymbol, slotAttributeSymbol, comp);
            });

            var syntaxProvider = context.SyntaxProvider
                .CreateSyntaxProvider(
                    predicate: static (node, _) =>
                    {
                        if (node is not TypeDeclarationSyntax tds) return false;
                        if (!tds.Modifiers.Any(SyntaxKind.PartialKeyword)) return false;
                        if (tds.BaseList is not { Types.Count: > 0 }) return false;

                        var nameLooksLikeSlots = tds.Identifier.Text.Contains("Slots");
                        var baseLooksLikeSlots = tds.BaseList.Types.Any(t => t.ToString().Contains("Slots"));
                        if (!(nameLooksLikeSlots || baseLooksLikeSlots)) return false;

                        var hasPublicStringProp = tds.Members.OfType<PropertyDeclarationSyntax>()
                            .Any(p => (p.Type is PredefinedTypeSyntax pts && pts.Keyword.IsKind(SyntaxKind.StringKeyword) || p.Type.ToString() == "string")
                                   && p.Modifiers.Any(SyntaxKind.PublicKeyword));
                        return hasPublicStringProp;
                    },
                    transform: static (ctx, _) => (TypeDeclarationSyntax)ctx.Node
                );

            var combinedProvider = syntaxProvider.Combine(sharedStateProvider);

            var candidates = combinedProvider.Select((tuple, ct) =>
                {
                    var (typeDeclaration, state) = tuple;
                    return GetSemanticTargetForGeneration(typeDeclaration, state, ct);
                })
                .Where(static s => s is not null);

            context.RegisterSourceOutput(candidates, GenerateForSlotsType);
        }

        private static void GenerateForSlotsType(SourceProductionContext spc, SlotsAccessorToGenerate? gen)
        {
            if (gen is not SlotsAccessorToGenerate accessor) return;

            var validationDiagnostics = ValidateHierarchy(accessor.ComponentSymbol);
            validationDiagnostics.AddRange(ValidateHierarchy(accessor.SlotsSymbol));
            if (validationDiagnostics.Count > 0)
            {
                foreach(var diagnostic in validationDiagnostics) spc.ReportDiagnostic(diagnostic);
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

            var bt = accessor.SlotsSymbol.BaseType;
            var inheritanceInfo = (bt is null || bt.SpecialType == SpecialType.System_Object)
                ? new InheritanceInfo(false)
                : AnalyzeInheritance(accessor.SlotsSymbol, accessor.SharedState.Compilation);

            var sb = new Indenter();
            WritePreamble(sb, accessor.NamespaceName);
            WriteNestedOpenings(sb, accessor.ComponentSymbol);
            WriteISlotsClass(sb, accessor.SlotsSymbol, accessor.Properties, accessor.Slots, inheritanceInfo);
            WriteEnum(sb, "SlotsTypes", accessor.Properties);
            WriteNamesHelper(sb, "SlotNames", "SlotsTypes", accessor.Properties, accessor.Slots);
            WriteNestedClosings(sb, accessor.ComponentSymbol);
            WriteExtensions(sb, extClassName, $"{componentFullName}.SlotsTypes", $"{componentFullName}.SlotNames", slotsMapName, slotsFullName, accessor.Properties);
            WritePragmaClosing(sb);

            spc.AddSource(filename, SourceText.From(sb.ToString(), Encoding.UTF8));
        }

        private static SlotsAccessorToGenerate? GetSemanticTargetForGeneration(TypeDeclarationSyntax typeDeclaration, SharedGeneratorState state, CancellationToken ct)
        {
            if (state.ISlotsSymbol is null || state.SlotAttributeSymbol is null) return null;

            var semanticModel = state.Compilation.GetSemanticModel(typeDeclaration.SyntaxTree);
            if (semanticModel.GetDeclaredSymbol(typeDeclaration, ct) is not INamedTypeSymbol symbol) return null;

            bool implementsISlots = symbol.AllInterfaces.Contains(state.ISlotsSymbol, SymbolEqualityComparer.Default);
            if (!implementsISlots || symbol.ContainingType is null) return null;

            var componentType = symbol.ContainingType;
            var (properties, slotNames) = CollectSlotProperties(symbol, state.SlotAttributeSymbol);

            return new SlotsAccessorToGenerate(
                Name: symbol.Name,
                FullName: symbol.ToDisplayString(SymbolDisplayFormat.FullyQualifiedFormat),
                TypeName: componentType.Name,
                NamespaceName: symbol.ContainingNamespace?.ToDisplayString() ?? string.Empty,
                Properties: properties,
                Slots: slotNames,
                ComponentFullName: componentType.ToDisplayString(SymbolDisplayFormat.FullyQualifiedFormat),
                SlotsSymbol: symbol,
                ComponentSymbol: componentType,
                SharedState: state)
            {
                Location = symbol.Locations.FirstOrDefault()
            };
        }

        #region Helpers

        private static InheritanceInfo AnalyzeInheritance(INamedTypeSymbol symbol, Compilation compilation)
        {
            var ienumDef = compilation.GetSpecialType(SpecialType.System_Collections_Generic_IEnumerable_T);
            var str = compilation.GetSpecialType(SpecialType.System_String);
            var vtupleDef = compilation.GetTypeByMetadataName("System.ValueTuple`2");

            if (ienumDef is null || str is null || vtupleDef is null)
            {
                return new InheritanceInfo(false);
            }

            var tupleOfStrings = vtupleDef.Construct(str, str);
            var ienumTuple = ienumDef.Construct(tupleOfStrings);

            for (var baseType = symbol.BaseType; baseType is not null; baseType = baseType.BaseType)
            {
                var match = baseType.GetMembers("EnumerateOverrides")
                    .OfType<IMethodSymbol>()
                    .FirstOrDefault(m =>
                        !m.IsStatic &&
                        m.Parameters.Length == 0 &&
                        (m.IsVirtual || m.IsAbstract || m.IsOverride) &&
                        SymbolEqualityComparer.Default.Equals(m.ReturnType, ienumTuple));

                if (match is not null)
                    return new InheritanceInfo(true);
            }

            return new InheritanceInfo(false);
        }

        private static (ImmutableArray<string> properties, ImmutableArray<string> slotNames) CollectSlotProperties(INamedTypeSymbol type, INamedTypeSymbol slotAttributeSymbol)
        {
            var allProperties = type.GetMembers()
                .OfType<IPropertySymbol>()
                .Where(p => !p.IsStatic && p.DeclaredAccessibility == Accessibility.Public && p.Type.SpecialType == SpecialType.System_String && p.GetMethod is not null);

            var uniqueProperties = allProperties
                .GroupBy(p => p.Name)
                .Select(g => g.Count() == 1 ? g.First() : g.OrderBy(p => IsSameOrBaseType(type, p.ContainingType) ? 0 : 1).First())
                .OrderBy(p => p.DeclaringSyntaxReferences.FirstOrDefault()?.Span.Start ?? int.MaxValue)
                .ThenBy(p => p.Name, StringComparer.Ordinal)
                .ToList();

            var propertyNamesBuilder = ImmutableArray.CreateBuilder<string>(uniqueProperties.Count);
            var slotNamesBuilder = ImmutableArray.CreateBuilder<string>(uniqueProperties.Count);

            foreach (var p in uniqueProperties)
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
        
        private static bool IsSameOrBaseType(INamedTypeSymbol startingType, INamedTypeSymbol typeToFind)
        {
            var current = startingType;
            while (current != null)
            {
                if (SymbolEqualityComparer.Default.Equals(current, typeToFind)) return true;
                current = current.BaseType;
            }
            return false;
        }

        private static string GetTypeDeclaration(INamedTypeSymbol typeSymbol)
        {
            var decl = PreferRichestDecl(typeSymbol);
            if (decl is null)
            {
                return typeSymbol.ToDisplayString(SymbolDisplayFormat.FullyQualifiedFormat).Replace(typeSymbol.Name, "partial " + typeSymbol.Name);
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

        private static TypeDeclarationSyntax? PreferRichestDecl(INamedTypeSymbol typeSymbol)
        {
            return typeSymbol.DeclaringSyntaxReferences
                .Select(r => r.GetSyntax())
                .OfType<TypeDeclarationSyntax>()
                .OrderByDescending(t => t.Modifiers.Count + t.ConstraintClauses.Count)
                .FirstOrDefault();
        }

        private static bool IsPartial(INamedTypeSymbol typeSymbol) =>
            typeSymbol.DeclaringSyntaxReferences.Any(r => r.GetSyntax() is TypeDeclarationSyntax tds && tds.Modifiers.Any(SyntaxKind.PartialKeyword));

        private static List<Diagnostic> ValidateHierarchy(INamedTypeSymbol typeSymbol)
        {
            var diagnostics = new List<Diagnostic>();
            var current = typeSymbol;
            while (current != null)
            {
                if (current.TypeKind != TypeKind.Class && current.TypeKind != TypeKind.Struct)
                {
                    diagnostics.Add(Diagnostic.Create(DiagnosticHelper.ContainingTypeMustBeClassOrStruct, current.Locations.FirstOrDefault(), current.Name));
                }

                if (!IsPartial(current))
                {
                    var diagnosticDescriptor = current.Equals(typeSymbol, SymbolEqualityComparer.Default)
                        ? DiagnosticHelper.MustBePartial
                        : DiagnosticHelper.ContainingTypeMustBePartial;
                    diagnostics.Add(Diagnostic.Create(diagnosticDescriptor, current.Locations.FirstOrDefault(), current.Name, typeSymbol.Name));
                }
                current = current.ContainingType;
            }
            return diagnostics;
        }

        #endregion

        #region Code Writing

        private static void WriteEnum(Indenter sb, string enumName, ImmutableArray<string> properties)
        {
            sb.AppendLine("/// <summary>");
            sb.AppendLine("/// Provides a strongly-typed enumeration of all available slots.");
            sb.AppendLine("/// Note: The order of these members is determined by their order in the source code.");
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

        private static void WriteISlotsClass(Indenter sb, INamedTypeSymbol slotsSymbol, ImmutableArray<string> properties, ImmutableArray<string> slots, InheritanceInfo inheritanceInfo)
        {
            sb.AppendLine(GetTypeDeclaration(slotsSymbol));
            sb.AppendLine("{");
            sb.Indent();

            const string methodModifier = "public";

            sb.AppendLine("/// <inheritdoc/>");
            sb.AppendLine($"{methodModifier} {SlotTupleType} EnumerateOverrides()");
            sb.AppendLine("{");
            sb.Indent();

            if (inheritanceInfo.HasConcreteBaseMethod)
            {
                sb.AppendLine("if (GetType().BaseType?.GetMethod(nameof(EnumerateOverrides)) != null)");
                sb.AppendLine("{");
                sb.Indent();
                sb.AppendLine("foreach (var item in base.EnumerateOverrides()) yield return item;");
                sb.Dedent();
                sb.AppendLine("}");
                sb.AppendLine();
            }

            foreach (var property in properties)
            {
                sb.AppendLine($"var __v_{property} = {property};");
                sb.AppendLine($"if (!string.IsNullOrWhiteSpace(__v_{property}))");
                sb.AppendLine("{");
                sb.Indent();
                sb.AppendLine($"yield return (GetName(nameof({property})), __v_{property});");
                sb.Dedent();
                sb.AppendLine("}");
            }

            sb.Dedent();
            sb.AppendLine("}");
            sb.AppendLine();
            sb.AppendLine("/// <inheritdoc/>");
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
            sb.AppendLine("public static global::System.Collections.Generic.IReadOnlyList<string> AllNames => global::System.Array.AsReadOnly(_names);");
            sb.AppendLine();
            sb.AppendLine("/// <summary>An array of the final slot names, in declaration order.</summary>");
            sb.AppendLine("private static readonly string[] _slotNames = new[] { " + string.Join(", ", slots.Select(SymbolHelper.QuoteLiteral)) + " };");
            sb.AppendLine();
            sb.AppendLine("/// <summary>Gets a read-only list of all final slot names.</summary>");
            sb.AppendLine("public static global::System.Collections.Generic.IReadOnlyList<string> AllSlotNames => global::System.Array.AsReadOnly(_slotNames);");
            sb.AppendLine();
            sb.AppendLine("/// <summary>Gets an enumeration of all (PropertyName, SlotName) pairs.</summary>");
            sb.AppendLine("/// <remarks>Duplicate slot names may appear if multiple properties share the same [Slot] attribute value.</remarks>");
            sb.AppendLine("public static global::System.Collections.Generic.IEnumerable<(string PropertyName, string SlotName)> AllPairs => _names.Zip(_slotNames, (p, s) => (p, s));");
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

        private readonly record struct InheritanceInfo(bool HasConcreteBaseMethod);

        private readonly record struct SharedGeneratorState(INamedTypeSymbol? ISlotsSymbol, INamedTypeSymbol? SlotAttributeSymbol, Compilation Compilation);

        private readonly record struct SlotsAccessorToGenerate(
            string Name,
            string FullName,
            string TypeName,
            string NamespaceName,
            EquatableArray<string> Properties,
            EquatableArray<string> Slots,
            string ComponentFullName,
            INamedTypeSymbol SlotsSymbol,
            INamedTypeSymbol ComponentSymbol,
            SharedGeneratorState SharedState)
        {
            public Location? Location { get; init; }
        };
    }