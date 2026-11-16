using System.Text;

namespace RizzyUI;

/// <summary>
/// Converts Flatpickr date format strings (for example <c>Y-m-d</c> or <c>d/m/Y H:i</c>) to the
/// equivalent .NET custom date and time format, so the server renders and parses the input value
/// the way Flatpickr writes it.
/// </summary>
internal static class FlatpickrDateFormat
{
    private static readonly Dictionary<char, string> Tokens = new()
    {
        ['d'] = "dd",
        ['D'] = "ddd",
        ['l'] = "dddd",
        ['j'] = "d",
        ['F'] = "MMMM",
        ['m'] = "MM",
        ['n'] = "M",
        ['M'] = "MMM",
        ['y'] = "yy",
        ['Y'] = "yyyy",
        ['H'] = "HH",
        ['h'] = "h",
        ['G'] = "hh",
        ['i'] = "mm",
        ['S'] = "ss",
        ['s'] = "s",
        ['K'] = "tt",
    };

    // Flatpickr tokens with no .NET custom format equivalent.
    private const string Unsupported = "JwWUZ";

    /// <summary>
    /// Returns the .NET format for <paramref name="flatpickrFormat"/>, or <c>null</c> when it uses a
    /// token .NET cannot format (ordinal day <c>J</c>, weekday number <c>w</c>, week <c>W</c>,
    /// Unix time <c>U</c> or ISO <c>Z</c>).
    /// </summary>
    public static string? ToDotNet(string flatpickrFormat)
    {
        var result = new StringBuilder();
        for (var i = 0; i < flatpickrFormat.Length; i++)
        {
            var c = flatpickrFormat[i];
            if (c == '\\' && i + 1 < flatpickrFormat.Length)
            {
                result.Append('\\').Append(flatpickrFormat[++i]);
            }
            else if (Tokens.TryGetValue(c, out var token))
            {
                result.Append(token);
            }
            else if (Unsupported.Contains(c))
            {
                return null;
            }
            else
            {
                result.Append('\\').Append(c);
            }
        }

        // A single-character pattern would be read as a .NET standard format ("d" = short date).
        return result.Length == 1 ? "%" + result : result.ToString();
    }
}
