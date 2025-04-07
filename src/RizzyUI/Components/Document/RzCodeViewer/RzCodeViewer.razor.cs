// src/RizzyUI/Components/RzCodeViewer/RzCodeViewer.razor.cs
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Web; // For HttpUtility
using Rizzy.Utility;
using RizzyUI.Components.Document.RzCodeViewer;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
/// Displays code snippets with syntax highlighting (using Highlight.js), copy-to-clipboard functionality,
/// and an expand/collapse feature. Styling is determined by the active <see cref="RzTheme"/>.
/// </xmldoc>
public partial class RzCodeViewer : RzComponent
{
    // Theme is inherited from RzComponent

    private string CodeId { get; } = IdGenerator.UniqueId("rzcode");
    private string CodeContent { get; set; } = string.Empty;
    private string _assets = string.Empty;

    /// <summary> Default assets loaded for RzCodeViewer (Highlight.js core and Razor plugin). </summary>
    public static string[] DefaultAssets =
    [
        Constants.ContentUrl("js/vendor/highlightjs/highlight.js"),
        Constants.ContentUrl("js/vendor/highlightjs-plugin/cshtml-razor.min.js"),
    ];

    /// <summary> Optional array of asset URLs (JS/CSS) to load, primarily for Highlight.js and themes. Defaults to <see cref="DefaultAssets"/>. </summary>
    [Parameter] public string[] ComponentAssets { get; set; } = DefaultAssets;
    /// <summary> The language alias for Highlight.js syntax highlighting (e.g., "csharp", "html", "css"). See <see cref="CodeLanguage"/> constants. Defaults to "html". </summary>
    [Parameter] public string Language { get; set; } = CodeLanguage.Html;
    /// <summary> The code content provided as a RenderFragment. Used if <see cref="Source"/> is null or empty. </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }
    /// <summary> The code content provided as a string. Takes precedence over <see cref="ChildContent"/>. </summary>
    [Parameter] public string? Source { get; set; }
    /// <summary> The title displayed in the header of the code viewer card. Defaults to "Source". </summary>
    [Parameter] public string ViewerTitle { get; set; } = "Source";

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the header div. </summary>
    protected string HeaderClass => Theme.RzCodeViewer.Header;
    /// <summary> Gets the computed CSS classes for the header title span. </summary>
    protected string HeaderTitleClass => Theme.RzCodeViewer.HeaderTitle;
    /// <summary> Gets the computed CSS classes for the main code container div. </summary>
    protected string CodeContainerClass => Theme.RzCodeViewer.CodeContainer;
    /// <summary> Gets the computed CSS classes for the copy button container div. </summary>
    protected string CopyButtonContainerClass => Theme.RzCodeViewer.CopyButtonContainer;
    /// <summary> Gets the computed CSS classes for the copy button. </summary>
    protected string CopyButtonClass => Theme.RzCodeViewer.CopyButton;
    /// <summary> Gets the computed CSS classes for the default copy icon. </summary>
    protected string CopyIconDefaultClass => Theme.RzCodeViewer.CopyIconDefault;
    /// <summary> Gets the computed CSS classes for the copied state icon. </summary>
    protected string CopyIconCopiedClass => Theme.RzCodeViewer.CopyIconCopied;
    /// <summary> Gets the computed CSS classes for the pre element wrapper div. </summary>
    protected string PreWrapperClass => Theme.RzCodeViewer.PreWrapper;
    /// <summary> Gets the computed CSS classes for the pre element. </summary>
    protected string PreElementClass => Theme.RzCodeViewer.PreElement;
    /// <summary> Gets the computed CSS classes for the expand/collapse button. </summary>
    protected string ExpandButtonClass => Theme.RzCodeViewer.ExpandButton;
    /// <summary> Gets the computed CSS classes for the expand/collapse icon. </summary>
    protected string ExpandIconClass => Theme.RzCodeViewer.ExpandIcon;
    /// <summary> Gets the full language class name for Highlight.js. </summary>
    protected string LanguageClass => CodeLanguage.GetLanguageClass(Language);

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        // Base class handles Theme initialization
        base.OnInitialized();
        _assets = JsonSerializer.Serialize(ComponentAssets);
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
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

    /// <inheritdoc/>
    protected override string? RootClass() =>
        TwMerge.Merge(AdditionalAttributes, Theme.RzCodeViewer.Container);
}