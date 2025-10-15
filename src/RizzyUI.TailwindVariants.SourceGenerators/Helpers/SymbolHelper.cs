    using Microsoft.CodeAnalysis;
    using System.Text;

    namespace RizzyUI.TailwindVariants.SourceGenerators;

    internal static class SymbolHelper
    {
        /// <summary>
        /// A SymbolDisplayFormat that produces a fully qualified name without the "global::" prefix,
        /// suitable for use in diagnostics and unique key generation.
        /// </summary>
        public static readonly SymbolDisplayFormat FullyQualifiedFormat = new(
            typeQualificationStyle: SymbolDisplayTypeQualificationStyle.NameAndContainingTypesAndNamespaces,
            globalNamespaceStyle: SymbolDisplayGlobalNamespaceStyle.Omitted,
            genericsOptions: SymbolDisplayGenericsOptions.IncludeTypeParameters,
            miscellaneousOptions: SymbolDisplayMiscellaneousOptions.IncludeNotNullableReferenceTypeModifier);
            
        /// <summary>
        /// A SymbolDisplayFormat for creating a full type declaration, including accessibility, modifiers,
        /// generics, and constraints.
        /// </summary>
        public static readonly SymbolDisplayFormat FullDeclarationFormat = new(
            typeQualificationStyle: SymbolDisplayTypeQualificationStyle.NameAndContainingTypes,
            genericsOptions: SymbolDisplayGenericsOptions.IncludeTypeParameters | SymbolDisplayGenericsOptions.IncludeTypeConstraints,
            memberOptions: SymbolDisplayMemberOptions.IncludeAccessibility | SymbolDisplayMemberOptions.IncludeModifiers,
            miscellaneousOptions: SymbolDisplayMiscellaneousOptions.IncludeNotNullableReferenceTypeModifier);

        /// <summary>
        /// Creates a short, stable, and unique hash from a string.
        /// Used to generate collision-resistant filenames from long, fully-qualified type names.
        /// </summary>
        public static string Hash(string s)
        {
            using var md5 = System.Security.Cryptography.MD5.Create();
            var bytes = md5.ComputeHash(System.Text.Encoding.UTF8.GetBytes(s));
            return BitConverter.ToString(bytes).Replace("-", "").ToLowerInvariant();
        }

        public static string MakeSafeIdentifier(string name)
        {
            if (string.IsNullOrEmpty(name)) return "_";
            var sb = new StringBuilder(name.Length);
            for (int i = 0; i < name.Length; i++)
            {
                var ch = name[i];
                if (i == 0)
                {
                    sb.Append(char.IsLetter(ch) || ch == '_' ? ch : '_');
                }
                else
                {
                    sb.Append(char.IsLetterOrDigit(ch) || ch == '_' ? ch : '_');
                }
            }
            return sb.ToString();
        }

        public static string QuoteLiteral(string value) => $"\"{value.Replace("\"", "\\\"")}\"";
    }