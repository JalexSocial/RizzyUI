
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using Rizzy.Utility;
using RizzyUI.Extensions;
using System.Text.Json;
using System.Web;

namespace RizzyUI;

/// <xmldoc>
///     Displays code snippets with syntax highlighting (using Highlight.js), copy-to-clipboard functionality,
///     and an expand/collapse feature. Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzCodeViewer : RzComponent
{
    private string _assets = string.Empty;
    private string CodeId { get; } = IdGenerator.UniqueId("rzcode");
    private string CodeContent { get; set; } = string.Empty;

    [Inject]
    private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    /// <summary>
    ///     Optional array of asset keys (from <see cref="RizzyUIConfig.AssetUrls"/>) to load, primarily for Highlight.js and themes.
    ///     Defaults to keys for Highlight.js core and the Razor plugin.
    /// </summary>
    [Parameter] public string[] ComponentAssetKeys { get; set; } = ["HighlightJsCore", "HighlightJsRazor"];

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
        base.OnInitialized();
        ViewerTitle ??= Localizer["RzCodeViewer.DefaultViewerTitle"];
        UpdateAssets();
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        ViewerTitle ??= Localizer["RzCodeViewer.DefaultViewerTitle"];
        SetCodeContent();
        UpdateAssets();
    }

    private void UpdateAssets()
    {
        var assetUrls = ComponentAssetKeys
            .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
            .Where(url => !string.IsNullOrEmpty(url))
            .ToList();
        _assets = JsonSerializer.Serialize(assetUrls);
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
            rawContent = ChildContent.AsMarkupString();
            rawContent = HttpUtility.HtmlDecode(rawContent);
        }
        else
        {
            rawContent = string.Empty;
        }

        CodeContent = rawContent.TrimEmptyLines().Outdent();
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzCodeViewer.Container);
    }
}