
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using Rizzy.Utility;
using RizzyUI.Extensions;
using System.Text.Json;
using System.Web;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Displays code snippets with syntax highlighting (using Highlight.js), copy-to-clipboard functionality,
///     and an expand/collapse feature. Styling is determined by the active &lt;see cref="RzTheme" /&gt;.
/// </xmldoc>
public partial class RzCodeViewer : RzComponent<RzCodeViewer.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzCodeViewer component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "mt-2 overflow-auto card p-0 rounded-lg",
        slots: new()
        {
            [s => s.Header] = "border-b-0 border-outline bg-secondary flex flex-col items-start justify-between gap-4 rounded-md rounded-b-none border px-4 py-1 text-sm text-secondary-foreground md:flex-row md:items-center md:gap-2",
            [s => s.HeaderTitle] = "text-foreground",
            [s => s.CodeContainer] = "border-outline w-full overflow-y-auto transition-all !rounded-b-none rounded-b-xl border",
            [s => s.CopyButtonContainer] = "flex justify-between",
            [s => s.CopyButton] = "my-auto ml-auto mr-2 overflow-hidden rounded-full p-1 hover:bg-background/10 focus:outline-none focus:outline-offset-0 focus-visible:outline-2 active:-outline-offset-2",
            [s => s.CopyIconDefault] = "text-foreground font-bold size-6 cursor-pointer",
            [s => s.CopyIconCopied] = "size-6 text-success",
            [s => s.PreWrapper] = "relative overflow-y-auto",
            [s => s.PreElement] = "not-prose text-sm overflow-x-auto p-8 m-0 border-none",
            [s => s.ExpandButton] = "border-t-0 border-outline bg-secondary text-foreground flex w-full items-center justify-center gap-2 rounded-md rounded-t-none border p-2 focus:outline-none focus-visible:rounded-t-none focus-visible:border-2 focus-visible:border-primary dark:focus-visible:border-primary",
            [s => s.ExpandIcon] = "rotate-0 h-5 w-5 transition"
        }
    );

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
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCodeViewer;

    /// <summary>
    /// Defines the slots available for styling in the RzCodeViewer component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the header section.
        /// </summary>
        public string? Header { get; set; }
        /// <summary>
        /// The slot for the title in the header.
        /// </summary>
        public string? HeaderTitle { get; set; }
        /// <summary>
        /// The slot for the container of the code block.
        /// </summary>
        public string? CodeContainer { get; set; }
        /// <summary>
        /// The slot for the container of the copy button.
        /// </summary>
        public string? CopyButtonContainer { get; set; }
        /// <summary>
        /// The slot for the copy button.
        /// </summary>
        public string? CopyButton { get; set; }
        /// <summary>
        /// The slot for the default copy icon.
        /// </summary>
        public string? CopyIconDefault { get; set; }
        /// <summary>
        /// The slot for the "copied" state icon.
        /// </summary>
        public string? CopyIconCopied { get; set; }
        /// <summary>
        /// The slot for the wrapper around the `pre` element.
        /// </summary>
        public string? PreWrapper { get; set; }
        /// <summary>
        /// The slot for the `pre` element itself.
        /// </summary>
        public string? PreElement { get; set; }
        /// <summary>
        /// The slot for the expand/collapse button.
        /// </summary>
        public string? ExpandButton { get; set; }
        /// <summary>
        /// The slot for the icon inside the expand/collapse button.
        /// </summary>
        public string? ExpandIcon { get; set; }
    }
}