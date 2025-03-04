using System.Text;

namespace RizzyUI.Extensions;

internal static class StringExtensions
{
    private static Random _random = new(System.Environment.TickCount);

    /// <summary>
    /// Removes the minimum shared run of leading whitespace characters
    /// (spaces, tabs, etc.) from each non-empty line in the given text.
    /// </summary>
    /// <param name="text">Multi-line string input.</param>
    /// <returns>A new string with each non-empty line outdented by the
    /// minimal number of leading whitespace characters found.</returns>
    public static string Outdent(this string text)
    {
        // Early exit for null or empty input
        if (string.IsNullOrEmpty(text))
            return text;

        // Split the input text into lines, preserving empty lines
        var lines = text.Split(new[] { "\r\n", "\n" }, StringSplitOptions.None);

        int minLeadingWhitespace = int.MaxValue;

        // 1st pass: Determine the minimum number of consecutive leading whitespace chars on non-whitespace lines
        foreach (string line in lines)
        {
            // Skip lines that are blank or entirely whitespace
            if (string.IsNullOrWhiteSpace(line))
                continue;

            int count = 0;
            while (count < line.Length && char.IsWhiteSpace(line[count]))
            {
                count++;
            }

            if (count < minLeadingWhitespace)
            {
                minLeadingWhitespace = count;
                if (minLeadingWhitespace == 0)
                {
                    // Can't do better than zero; break early
                    break;
                }
            }
        }

        // If no non-whitespace lines were found, or minLeadingWhitespace is zero, no outdent needed
        if (minLeadingWhitespace == int.MaxValue || minLeadingWhitespace == 0)
            return text;

        // 2nd pass: Build a new string with the computed leading whitespace removed
        var sb = new StringBuilder(text.Length);

        for (int i = 0; i < lines.Length; i++)
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
    /// Shuffle the characters in a string
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
        if (string.IsNullOrWhiteSpace(input))
        {
            return string.Empty;
        }

        // Split the string into lines
        var lines = input.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);

        // Find the first non-empty line
        int start = 0;
        while (start < lines.Length && string.IsNullOrWhiteSpace(lines[start]))
        {
            start++;
        }

        // Find the last non-empty line
        int end = lines.Length - 1;
        while (end >= start && string.IsNullOrWhiteSpace(lines[end]))
        {
            end--;
        }

        // Join the lines back together, trimming the empty ones
        return string.Join(Environment.NewLine, lines[start..(end + 1)]);
    }
}