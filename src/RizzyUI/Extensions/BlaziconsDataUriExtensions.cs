using Blazicons;
using System.Text;

namespace RizzyUI;

/// <summary>
/// Extension methods for converting <see cref="SvgIcon"/> instances into string formats
/// that can be embedded directly in HTML, such as <c>data:</c> URIs.
/// </summary>
public static class BlaziconsDataUriExtensions
{
    /// <summary>
    /// Converts a <see cref="SvgIcon"/> into a Base64-encoded SVG <c>data:</c> URI string.
    /// </summary>
    /// <param name="icon">
    /// The icon to convert. The resulting data URI is based on the icon's rendered SVG markup
    /// (for example, after applying modifications such as size or color).
    /// </param>
    /// <returns>
    /// A string in the form <c>data:image/svg+xml;base64,&lt;base64&gt;</c> where the Base64 payload
    /// is the UTF-8 encoding of the icon's complete <c>&lt;svg&gt;...&lt;/svg&gt;</c> markup.
    /// </returns>
    /// <exception cref="ArgumentNullException">
    /// Thrown when <paramref name="icon"/> is <c>null</c>.
    /// </exception>
    /// <remarks>
    /// <para>
    /// The produced string is suitable for assignment to an <c>&lt;img src="..."&gt;</c> attribute
    /// or CSS properties that accept a URL value.
    /// </para>
    /// <para>
    /// This method Base64-encodes the SVG text to avoid issues with quoting and reserved characters
    /// that can arise when embedding raw SVG XML directly in a <c>data:</c> URI.
    /// </para>
    /// </remarks>
    /// <example>
    /// <code language="csharp">
    /// var uri = MdiIcon.Information
    ///                 .WithColor("#0f172a")
    ///                 .ToSvgBase64DataUri();
    ///
    /// // e.g. &lt;img src="@uri" /&gt;
    /// </code>
    /// </example>
    public static string ToSvgBase64DataUri(this SvgIcon icon)
    {
        ArgumentNullException.ThrowIfNull(icon);

        var svgMarkup = icon.Markup.Trim();

        var bytes = Encoding.UTF8.GetBytes(svgMarkup);
        var base64 = Convert.ToBase64String(bytes);

        return $"data:image/svg+xml;base64,{base64}";
    }
}

