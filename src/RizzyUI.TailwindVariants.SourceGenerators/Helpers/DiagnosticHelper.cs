using Microsoft.CodeAnalysis;

namespace RizzyUI.TailwindVariants.SourceGenerators;

/// <summary>
/// Provides descriptors for diagnostics that can be reported by the source generator.
/// </summary>
internal static class DiagnosticHelper
{
    /// <summary>
    /// Diagnostic for when a slots type contains no public, instance, string properties.
    /// </summary>
    public static readonly DiagnosticDescriptor NoPropertiesDescriptor = new(
        id: "TVSG001",
        title: "Slots type contains no public instance properties",
        messageFormat: "The slots type '{0}' contains no public instance string properties. No accessors will be generated.",
        category: "TailwindVariants.SourceGenerators",
        defaultSeverity: DiagnosticSeverity.Info,
        isEnabledByDefault: true);

    /// <summary>
    /// Diagnostic for when a type that needs to be augmented is not declared 'partial'.
    /// </summary>
    public static readonly DiagnosticDescriptor MustBePartial = new(
        id: "TVSG002",
        title: "Target type must be declared partial",
        messageFormat: "The type '{0}' must be declared 'partial' for the source generator to extend it",
        category: "TailwindVariants",
        DiagnosticSeverity.Error,
        isEnabledByDefault: true);

    /// <summary>
    /// Diagnostic for when a type containing a component is not declared 'partial'.
    /// </summary>
    public static readonly DiagnosticDescriptor ContainingTypeMustBePartial = new(
        id: "TVSG003",
        title: "Containing type must be declared partial",
        messageFormat: "The containing type '{0}' (of component '{1}') must be declared 'partial' for the source generator to extend it",
        category: "TailwindVariants",
        DiagnosticSeverity.Error,
        isEnabledByDefault: true);

    /// <summary>
    /// Diagnostic for when a containing type is not a class or struct.
    /// </summary>
    public static readonly DiagnosticDescriptor ContainingTypeMustBeClassOrStruct = new(
        id: "TVSG004",
        title: "Containing type must be a class or struct",
        messageFormat: "The containing type '{0}' must be a 'class' or a 'struct', interfaces and other type kinds are not supported",
        category: "TailwindVariants",
        DiagnosticSeverity.Error,
        isEnabledByDefault: true);
}