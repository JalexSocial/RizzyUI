
using System.Text.Json;
using System.Web;
using Microsoft.AspNetCore.Components;
using Rizzy.Utility;
using RizzyUI.Extensions;
// For HttpUtility

namespace RizzyUI;

/// <xmldoc>
///     Displays code snippets with syntax highlighting (using Highlight.js), copy-to-clipboard functionality,
///     and an expand/collapse feature. Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzCodeViewer : RzComponent
{
    /// <summary> Default assets loaded for RzCodeViewer (Highlight.js core and Razor plugin). </summary>
    public static string[] DefaultAssets =
    [
        Constants.ContentUrl("vendor/highlightjs/highlight.js"),
        Constants.ContentUrl("js/lib/highlightjs-plugin/cshtml-razor.min.js")
    ];

    private string _assets = string.Empty;
    // Theme is inherited from RzComponent

    private string CodeId { get; } = IdGenerator.UniqueId("rzcode");
    private string CodeContent { get; set; } = string.Empty;

    /// <summary>
    ///     Optional array of asset URLs (JS/CSS) to load, primarily for Highlight.js and themes. Defaults to
    ///     <see cref="DefaultAssets" />.
    /// </summary>
    [Parameter] public string[] ComponentAssets { get; set; } = DefaultAssets;

    /// <summary>
    ///     The language alias for Highlight.js syntax highlighting (e.g., "csharp", "html", "css"). See
    ///     <see cref="CodeLanguage" /> constants. Defaults to "html".
    /// </summary>
    [Parameter] public string Language { get; set; } = CodeLanguage.Html;

    /// <summary> The code content provided as a RenderFragment. Used if <see cref="Source" /> is null or empty. </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary> The code content provided as a string. Takes precedence over <see cref="ChildContent" />. </summary>
    [Parameter] public string? Source { get; set; }

    /// <summary> The title displayed in the header of the code viewer card. Defaults to localized "Source". </summary>
    [Parameter] public string? ViewerTitle { get; set; }

    /// <summary> Gets the title text for the copy button before copying. </summary>
    protected string CopyButtonTitle => Localizer["RzCodeViewer.CopyButtonTitleCopy"];

    /// <summary> Gets the title text for the copy button after copying. </summary>
    protected string CopiedButtonTitle => Localizer["RzCodeViewer.CopyButtonTitleCopied"];

    /// <summary> Gets the full language class name for Highlight.js. </summary>
    protected string LanguageClass => CodeLanguage.GetLanguageClass(Language);

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        // Base class handles Theme initialization
        base.OnInitialized();
        _assets = JsonSerializer.Serialize(ComponentAssets);
        ViewerTitle ??= Localizer["RzCodeViewer.DefaultViewerTitle"];
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        ViewerTitle ??= Localizer["RzCodeViewer.DefaultViewerTitle"]; // Ensure default if becomes null
        SetCodeContent();
    }

    private void SetCodeContent()
    {
        string rawContent;
        if (!string.IsNullOrEmpty(Source))
        {
            rawContent = Source;
        }
        else if (ChildContent != null)
        {
            rawContent = ChildContent.AsMarkupString(); // Assumes AsMarkupString extension exists
            rawContent = HttpUtility.HtmlDecode(rawContent); // Decode entities
        }
        else
        {
            rawContent = string.Empty;
        }

        CodeContent = rawContent.TrimEmptyLines().Outdent(); // Trim and outdent
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzCodeViewer.Container);
    }
}