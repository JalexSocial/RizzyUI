using System.Text;
using TailwindMerge;

namespace RizzyUI.Utility.Parser;

internal static class HtmlUtils
{
    public enum AttrConflictPolicy
    {
        Replace,
        AppendSpaceSeparated,
        PrependSpaceSeparated
    }

    public sealed class MergeOptions
    {
        public StringComparer Comparer { get; init; } = StringComparer.OrdinalIgnoreCase;
        public bool PreserveUnquotedOnReplace { get; init; } = true;

        /// <summary>
        /// Optional policy resolver for non-"class" attributes.
        /// </summary>
        public Func<string, AttrConflictPolicy>? ConflictPolicyResolver { get; init; }
    }

    private enum QuoteKind : byte { None, Single, Double }

    public static string MergeRootElementAttributes(
        TwMerge merge,
        string htmlFragment,
        IDictionary<string, object?> parameters,
        MergeOptions? options = null)
    {
        options ??= new MergeOptions();

        if (string.IsNullOrWhiteSpace(htmlFragment))
            throw new ArgumentException("HTML fragment cannot be null or empty.", nameof(htmlFragment));

        if (parameters.Count == 0)
            return htmlFragment; // fast path

        // Build index map + arrays for bitmap tracking
        var indexMap = new Dictionary<string, int>(parameters.Count, options.Comparer);
        var keys   = new string[parameters.Count];
        var values = new string?[parameters.Count];
        var used   = new bool[parameters.Count];

        {
            int idx = 0;
            foreach (var kvp in parameters)
            {
                indexMap[kvp.Key] = idx;
                keys[idx] = kvp.Key;
                values[idx] = kvp.Value?.ToString();
                idx++;
            }
        }

        ReadOnlySpan<char> s = htmlFragment.AsSpan();
        int len = s.Length;
        int i = 0;

        // Skip leading whitespace
        while (i < len && char.IsWhiteSpace(s[i])) i++;
        if (i >= len || s[i] != '<')
            throw new ArgumentException("Fragment must start with an HTML element.");

        i++; // '<'

        // Tag name
        int tagNameStart = i;
        while (i < len && (char.IsLetterOrDigit(s[i]) || s[i] is ':' or '-' or '_' or '.')) i++;
        if (i == tagNameStart)
            throw new ArgumentException("No tag name found.");

        string tagName = new string(s.Slice(tagNameStart, i - tagNameStart));

        var sb = new StringBuilder(htmlFragment.Length + parameters.Count * 16);
        sb.Append('<').Append(tagName);

        bool selfClosing = false;

        // Parse attributes
        while (i < len)
        {
            while (i < len && char.IsWhiteSpace(s[i])) i++;
            if (i >= len) throw new ArgumentException("Unexpected end of input while parsing attributes.");

            char c = s[i];

            if (c == '>')
            {
                i++;
                break;
            }

            if (c == '/' && i + 1 < len && s[i + 1] == '>')
            {
                selfClosing = true;
                i += 2;
                break;
            }

            // Attribute name
            int attrNameStart = i;
            while (i < len)
            {
                c = s[i];
                if (c == '=' || char.IsWhiteSpace(c) || c == '>' || c == '/') break;
                i++;
            }
            if (i == attrNameStart) throw new ArgumentException("Malformed attribute name.");

            string attrName = new string(s.Slice(attrNameStart, i - attrNameStart));

            while (i < len && char.IsWhiteSpace(s[i])) i++;

            bool hasValue = false;
            QuoteKind quoteKind = QuoteKind.None;
            ReadOnlySpan<char> valueSpan = default;

            if (i < len && s[i] == '=')
            {
                hasValue = true;
                i++;

                while (i < len && char.IsWhiteSpace(s[i])) i++;
                if (i >= len) throw new ArgumentException("Unexpected end after '='.");

                char q = s[i];
                if (q == '"' || q == '\'')
                {
                    quoteKind = q == '"' ? QuoteKind.Double : QuoteKind.Single;
                    i++;
                    int valStart = i;
                    while (i < len && s[i] != q) i++;
                    if (i >= len) throw new ArgumentException($"Unterminated attribute value for '{attrName}'.");
                    valueSpan = s.Slice(valStart, i - valStart);
                    i++;
                }
                else
                {
                    int valStart = i;
                    while (i < len)
                    {
                        c = s[i];
                        if (char.IsWhiteSpace(c) || c == '>' || (c == '/' && i + 1 < len && s[i + 1] == '>'))
                            break;
                        i++;
                    }
                    valueSpan = s.Slice(valStart, i - valStart);
                    quoteKind = QuoteKind.None;
                }
            }

            if (indexMap.TryGetValue(attrName, out var idx))
            {
                used[idx] = true;
                string? newValue = values[idx];

                // Rule: null => remove attribute
                if (newValue is null)
                {
                    continue;
                }

                // Special case: class => TwMerge.Merge(existing, new)
                if (IsClassAttr(attrName, options.Comparer))
                {
                    var existing = valueSpan.IsEmpty ? string.Empty : valueSpan.ToString();
                    string merged = merge.Merge( [existing, newValue]) ?? string.Empty;
                    EmitAttr(sb, "class", merged, quoteKind, options.PreserveUnquotedOnReplace);
                }
                else
                {
                    var policy = options.ConflictPolicyResolver?.Invoke(attrName) ?? AttrConflictPolicy.Replace;

                    switch (policy)
                    {
                        case AttrConflictPolicy.Replace:
                            EmitAttr(sb, attrName, newValue, quoteKind, options.PreserveUnquotedOnReplace);
                            break;

                        case AttrConflictPolicy.AppendSpaceSeparated:
                        {
                            var existing = valueSpan.IsEmpty ? string.Empty : valueSpan.ToString();
                            var merged = existing.Length == 0 ? newValue : existing + " " + newValue;
                            EmitAttr(sb, attrName, merged, quoteKind, options.PreserveUnquotedOnReplace);
                            break;
                        }

                        case AttrConflictPolicy.PrependSpaceSeparated:
                        {
                            var existing = valueSpan.IsEmpty ? string.Empty : valueSpan.ToString();
                            var merged = existing.Length == 0 ? newValue : newValue + " " + existing;
                            EmitAttr(sb, attrName, merged, quoteKind, options.PreserveUnquotedOnReplace);
                            break;
                        }
                    }
                }
            }
            else
            {
                // Emit original
                if (!hasValue)
                {
                    sb.Append(' ').Append(attrName);
                }
                else
                {
                    sb.Append(' ').Append(attrName).Append('=');
                    switch (quoteKind)
                    {
                        case QuoteKind.Double: sb.Append('"').Append(valueSpan).Append('"'); break;
                        case QuoteKind.Single: sb.Append('\'').Append(valueSpan).Append('\''); break;
                        default: sb.Append(valueSpan); break;
                    }
                }
            }
        }

        // Add remaining dictionary parameters (skip nulls), with special handling for class
        for (int k = 0; k < keys.Length; k++)
        {
            if (used[k]) continue;

            var key = keys[k];
            var v = values[k];
            if (v is null) continue; // null => remove / don't add

            if (IsClassAttr(key, options.Comparer))
            {
                // No original class present => merge with empty string
                EmitAttrAlwaysQuoted(sb, "class", v);
            }
            else
            {
                EmitAttrAlwaysQuoted(sb, key, v);
            }
        }

        if (selfClosing)
        {
            sb.Append("/>");
            return sb.ToString();
        }

        sb.Append('>');

        if (i < len)
        {
            sb.Append(s.Slice(i));
        }

        return sb.ToString();
    }

    private static bool IsClassAttr(string name, StringComparer comparer)
        => comparer.Equals(name, "class");

    private static void EmitAttrAlwaysQuoted(StringBuilder sb, string name, string value)
    {
        sb.Append(' ').Append(name).Append('=').Append('"').Append(value).Append('"');
    }

    private static void EmitAttr(
        StringBuilder sb,
        string name,
        string value,
        QuoteKind originalQuote,
        bool preserveUnquotedOnReplace)
    {
        sb.Append(' ').Append(name).Append('=');

        if (originalQuote == QuoteKind.None && preserveUnquotedOnReplace && IsUnquotedSafe(value))
        {
            sb.Append(value);
            return;
        }

        char q = originalQuote switch
        {
            QuoteKind.Single => '\'',
            QuoteKind.Double => '"',
            _ => '"'
        };

        if (q == '\'' && value.IndexOf('\'') >= 0)
            q = '"';

        sb.Append(q).Append(value).Append(q);
    }

    // HTML5: unquoted value must not contain whitespace or: " ' ` = < >
    private static bool IsUnquotedSafe(string value)
    {
        for (int j = 0; j < value.Length; j++)
        {
            char ch = value[j];
            if (char.IsWhiteSpace(ch)) return false;
            switch (ch)
            {
                case '"':
                case '\'':
                case '`':
                case '=':
                case '<':
                case '>':
                    return false;
            }
        }
        return true;
    }
}