
using System.Net;
using System.Text;
using TailwindMerge;

namespace RizzyUI.Utility.Parser;

/// <summary>
/// Provides utility methods for parsing and manipulating HTML.
/// </summary>
internal static class HtmlUtils
{
    /// <summary>
    /// Defines the policy for resolving attribute conflicts during merging.
    /// </summary>
    public enum AttrConflictPolicy
    {
        /// <summary>
        /// Replace the existing attribute value with the new one.
        /// </summary>
        Replace,
        /// <summary>
        /// Append the new attribute value to the existing one, separated by a space.
        /// </summary>
        AppendSpaceSeparated,
        /// <summary>
        /// Prepend the new attribute value to the existing one, separated by a space.
        /// </summary>
        PrependSpaceSeparated
    }

    /// <summary>
    /// Defines options for the attribute merging process.
    /// </summary>
    public sealed class MergeOptions
    {
        /// <summary>
        /// Gets or sets the comparer for attribute names. Defaults to OrdinalIgnoreCase.
        /// </summary>
        public StringComparer Comparer { get; init; } = StringComparer.OrdinalIgnoreCase;
        /// <summary>
        /// Gets or sets a value indicating whether to preserve unquoted attributes when replacing values.
        /// </summary>
        public bool PreserveUnquotedOnReplace { get; init; } = true;

        /// <summary>
        /// Optional policy resolver for non-"class" attributes.
        /// </summary>
        public Func<string, AttrConflictPolicy>? ConflictPolicyResolver { get; init; }
    }

    private enum QuoteKind : byte { None, Single, Double }

    /// <summary>
    /// Merges a dictionary of attributes into the root element of an HTML fragment.
    /// </summary>
    /// <param name="merge">The TwMerge instance for merging CSS classes.</param>
    /// <param name="htmlFragment">The HTML fragment to modify.</param>
    /// <param name="parameters">The attributes to merge.</param>
    /// <param name="options">Options for the merge process.</param>
    /// <returns>The modified HTML fragment string.</returns>
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
        var keys = new string[parameters.Count];
        var values = new string?[parameters.Count];
        var used = new bool[parameters.Count];

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

                // Special case: class => TwMerge, where the element's own classes win conflicts with
                // the merged-in classes (the same precedence as the element path of asChild).
                if (IsClassAttr(attrName, options.Comparer))
                {
                    var existing = DecodeMarkupValue(valueSpan);
                    string merged = merge.Merge([newValue, existing]) ?? string.Empty;
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
                                var existing = DecodeMarkupValue(valueSpan);
                                var merged = existing.Length == 0 ? newValue : existing + " " + newValue;
                                EmitAttr(sb, attrName, merged, quoteKind, options.PreserveUnquotedOnReplace);
                                break;
                            }

                        case AttrConflictPolicy.PrependSpaceSeparated:
                            {
                                var existing = DecodeMarkupValue(valueSpan);
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
        sb.Append(' ').Append(name).Append('=').Append('"').Append(EncodeAttributeValue(value)).Append('"');
    }

    // Values merged into the markup are plain text: caller values (component parameters and
    // additional attributes) are not HTML, and values read from the child's markup are decoded first
    // (DecodeMarkupValue). Every value written is then encoded once, so a caller's "a &amp; b" is shown
    // as typed, a quote cannot end the attribute, and a markup value such as a Tailwind arbitrary
    // variant ([&_svg]) round-trips unchanged (RZUI-015). Attributes that are not merged are copied
    // as they were written.
    private static string DecodeMarkupValue(ReadOnlySpan<char> value)
        => value.IsEmpty ? string.Empty : WebUtility.HtmlDecode(value.ToString());

    private static string EncodeAttributeValue(string value)
    {
        if (value.AsSpan().IndexOfAny("&\"'<>") < 0)
        {
            return value;
        }

        var sb = new StringBuilder(value.Length + 16);
        foreach (var ch in value)
        {
            switch (ch)
            {
                case '&': sb.Append("&amp;"); break;
                case '"': sb.Append("&quot;"); break;
                case '\'': sb.Append("&#39;"); break;
                case '<': sb.Append("&lt;"); break;
                case '>': sb.Append("&gt;"); break;
                default: sb.Append(ch); break;
            }
        }

        return sb.ToString();
    }

    private static void EmitAttr(
        StringBuilder sb,
        string name,
        string value,
        QuoteKind originalQuote,
        bool preserveUnquotedOnReplace)
    {
        sb.Append(' ').Append(name).Append('=');
        var encoded = EncodeAttributeValue(value);

        if (originalQuote == QuoteKind.None && preserveUnquotedOnReplace && IsUnquotedSafe(encoded))
        {
            sb.Append(encoded);
            return;
        }

        char q = originalQuote switch
        {
            QuoteKind.Single => '\'',
            QuoteKind.Double => '"',
            _ => '"'
        };

        sb.Append(q).Append(encoded).Append(q);
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