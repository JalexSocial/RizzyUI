using System.Globalization;
using System.Text;

namespace RizzyUI.Extensions;

internal static class StringExtensions
{
    private static readonly Random _random = new(Environment.TickCount);

    /// <summary>
    ///     Removes the minimum shared run of leading whitespace characters
    ///     (spaces, tabs, etc.) from each non-empty line in the given text.
    /// </summary>
    /// <param name="text">Multi-line string input.</param>
    /// <returns>
    ///     A new string with each non-empty line outdented by the
    ///     minimal number of leading whitespace characters found.
    /// </returns>
    public static string Outdent(this string text)
    {
        // Early exit for null or empty input
        if (string.IsNullOrEmpty(text))
            return text;

        // Split the input text into lines, preserving empty lines
        var lines = text.Split(new[] { "\r\n", "\n" }, StringSplitOptions.None);

        var minLeadingWhitespace = int.MaxValue;

        // 1st pass: Determine the minimum number of consecutive leading whitespace chars on non-whitespace lines
        foreach (var line in lines)
        {
            // Skip lines that are blank or entirely whitespace
            if (string.IsNullOrWhiteSpace(line))
                continue;

            var count = 0;
            while (count < line.Length && char.IsWhiteSpace(line[count])) count++;

            if (count < minLeadingWhitespace)
            {
                minLeadingWhitespace = count;
                if (minLeadingWhitespace == 0)
                    // Can't do better than zero; break early
                    break;
            }
        }

        // If no non-whitespace lines were found, or minLeadingWhitespace is zero, no outdent needed
        if (minLeadingWhitespace == int.MaxValue || minLeadingWhitespace == 0)
            return text;

        // 2nd pass: Build a new string with the computed leading whitespace removed
        var sb = new StringBuilder(text.Length);

        for (var i = 0; i < lines.Length; i++)
        {
            var line = lines[i];

            if (string.IsNullOrEmpty(line))
            {
                // Preserve blank lines as-is (including whitespace-only lines)
                sb.AppendLine(line);
            }
            else
            {
                // Remove exactly minLeadingWhitespace characters from the start,
                // or use an empty string if the line is shorter.
                var outdentedLine = line.Length >= minLeadingWhitespace
                    ? line.Substring(minLeadingWhitespace)
                    : string.Empty;

                sb.AppendLine(outdentedLine);
            }
        }

        // Optionally remove the final newline if you prefer not to have one
        if (sb.Length > 0 && sb[sb.Length - 1] == '\n')
        {
            sb.Length--;
            // If the preceding char is '\r', remove that too
            if (sb.Length > 0 && sb[sb.Length - 1] == '\r')
                sb.Length--;
        }

        return sb.ToString();
    }

    /// <summary>
    ///     Shuffle the characters in a string
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    public static string Shuffle(this string input)
    {
        return new string(input.ToCharArray()
            .OrderBy(x => _random.Next())
            .ToArray());
    }

    public static string TrimEmptyLines(this string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;

        // Split the string into lines
        var lines = input.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);

        // Find the first non-empty line
        var start = 0;
        while (start < lines.Length && string.IsNullOrWhiteSpace(lines[start])) start++;

        // Find the last non-empty line
        var end = lines.Length - 1;
        while (end >= start && string.IsNullOrWhiteSpace(lines[end])) end--;

        // Join the lines back together, trimming the empty ones
        return string.Join(Environment.NewLine, lines[start..(end + 1)]);
    }
    
    /// <summary>
    /// Converts any delimited string (hyphens, underscores, spaces, etc.)
    /// into a space-separated Title Case string.
    /// <para>Examples:</para>
    /// <list type="bullet">
    ///   <item><description><c>"amber-vanilla".ToTitleCase()</c> → <c>"Amber Vanilla"</c></description></item>
    ///   <item><description><c>"amber_vanilla".ToTitleCase()</c> → <c>"Amber Vanilla"</c></description></item>
    ///   <item><description><c>"amber vanilla".ToTitleCase()</c> → <c>"Amber Vanilla"</c></description></item>
    /// </list>
    /// </summary>
    /// <param name="source">The original string.</param>
    /// <returns>Title-cased version, or the original string if it’s null/white-space.</returns>
    public static string ToTitleCase(this string? source)
    {
        if (string.IsNullOrWhiteSpace(source))
            return source ?? string.Empty;

        // Treat hyphens, underscores, and whitespace as word boundaries.
        char[] delimiters = ['-', '_', ' '];

        var textInfo = CultureInfo.CurrentCulture.TextInfo;

        return string.Join(' ',
            source
                .Split(delimiters, StringSplitOptions.RemoveEmptyEntries)
                .Select(w => textInfo.ToTitleCase(w.Trim())));
    }    
    
    /// <summary>
    /// Converts a string to kebab-case, with words separated by hyphens.
    /// </summary>
    /// <param name="text">The input string to be converted to kebab-case.</param>
    /// <returns>A kebab-case representation of the input string.</returns>
    public static string ToKebabCase(this string text)
    {
        // Return the input text if it's null or empty
        if (string.IsNullOrEmpty(text)) return text;

        // Initialize a StringBuilder to store the result
        StringBuilder result = new();
        // Define a flag to track whether the previous character is a separator
        bool previousCharacterIsSeparator = true;

        // Iterate through each character in the input text
        for (int i = 0; i < text.Length; i++)
        {
            char currentChar = text[i];

            // If the current character is an uppercase letter or a digit
            if (char.IsUpper(currentChar) || char.IsDigit(currentChar))
            {
                // Add a hyphen if the previous character is not a separator and
                // the current character is preceded by a lowercase letter or followed by a lowercase letter
                if (!previousCharacterIsSeparator && (i > 0 && (char.IsLower(text[i - 1]) || (i < text.Length - 1 && char.IsLower(text[i + 1])))))
                {
                    result.Append("-");
                }

                // Append the lowercase version of the current character to the result
                result.Append(char.ToLowerInvariant(currentChar));
                // Update the flag to indicate that the current character is not a separator
                previousCharacterIsSeparator = false;
            }
            // If the current character is a lowercase letter
            else if (char.IsLower(currentChar))
            {
                // Append the current character to the result
                result.Append(currentChar);
                // Update the flag to indicate that the current character is not a separator
                previousCharacterIsSeparator = false;
            }
            // If the current character is a space, underscore, or hyphen
            else if (currentChar == ' ' || currentChar == '_' || currentChar == '-')
            {
                // Add a hyphen if the previous character is not a separator
                if (!previousCharacterIsSeparator)
                {
                    result.Append("-");
                }
                // Update the flag to indicate that the current character is a separator
                previousCharacterIsSeparator = true;
            }
        }

        // Return the kebab-case representation of the input string
        return result.ToString();
    }
    
}