using System.Diagnostics.CodeAnalysis;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.AspNetCore.Components.RenderTree;

namespace RizzyUI.Utility;

/// <summary>
/// Reads the source text of child content that components such as <see cref="RzMarkdown"/>,
/// <see cref="RzCodeViewer"/> and <see cref="RzHeading"/> process themselves.
/// </summary>
/// <remarks>
/// Rizzy's <c>AsMarkupString()</c> keeps only markup frames, so content produced by a Razor
/// expression (<c>&lt;RzMarkdown&gt;@model.Text&lt;/RzMarkdown&gt;</c>, a text frame) was dropped
/// (RZUI-050). This helper keeps both. Text frames are HTML-encoded, so the result is encoded the
/// same way as Razor's literal markup and callers decode it once.
/// </remarks>
[SuppressMessage("Usage", "BL0006:Do not use RenderTree types")]
internal static partial class RenderFragmentSource
{
    public static string GetSourceText(this RenderFragment? fragment)
    {
        if (fragment is null)
            return string.Empty;

        var builder = new RenderTreeBuilder();
        fragment(builder);
        var frames = builder.GetFrames();

        var source = new StringBuilder();
        for (var i = 0; i < frames.Count; i++)
        {
            var frame = frames.Array[i];
            switch (frame.FrameType)
            {
                case RenderTreeFrameType.Markup:
                    source.Append(frame.MarkupContent);
                    break;
                case RenderTreeFrameType.Text:
                    source.Append(WebUtility.HtmlEncode(frame.TextContent));
                    break;
            }
        }

        // Like AsMarkupString: drop a blank first line (the line break after the opening tag) and
        // the whitespace before the closing tag.
        return LeadingBlankLine().Replace(source.ToString(), string.Empty, 1).TrimEnd();
    }

    [GeneratedRegex(@"\A[ \t]*\r?\n")]
    private static partial Regex LeadingBlankLine();
}
