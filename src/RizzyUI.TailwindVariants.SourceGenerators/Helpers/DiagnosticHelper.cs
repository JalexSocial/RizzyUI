using Microsoft.CodeAnalysis;

namespace RizzyUI.TailwindVariants.SourceGenerators;

internal class DiagnosticHelper
{
    public static readonly DiagnosticDescriptor NoPropertiesDescriptor = new(
        id: "TVSG001",
        title: "Slots type contains no public instance properties",
        messageFormat: "The slots type '{0}' contains no public instance properties",
        category: "TailwindVariants.SourceGenerators",
        defaultSeverity: DiagnosticSeverity.Info,
        isEnabledByDefault: true);

    public static readonly DiagnosticDescriptor MustBePartial = new(
        id: "TVSG002",
        title: "ISlots types must be declared partial",
        messageFormat: "The ISlots implementation '{0}' must be declared partial",
        category: "TailwindVariants",
        DiagnosticSeverity.Error,
        isEnabledByDefault: true);
}