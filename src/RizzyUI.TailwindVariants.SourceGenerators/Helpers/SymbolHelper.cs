using System.Text;

namespace RizzyUI.TailwindVariants.SourceGenerators;

internal static class SymbolHelper
{
    public const string SlotsMapTypeName = "RizzyUI.TailwindVariants.SlotsMap`1";

    public static string MakeSafeFileName(string input)
    {
        var sb = new StringBuilder(input.Length);
        foreach (var ch in input)
        {
            if (char.IsLetterOrDigit(ch) || ch == '_' || ch == '.' || ch == '-') sb.Append(ch);
            else sb.Append('_');
        }
        return sb.ToString();
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