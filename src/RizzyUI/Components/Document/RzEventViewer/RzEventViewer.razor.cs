using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using System.Text.Json;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders a compact, scrollable event console that listens for one or more JavaScript events and prints each event payload.
/// </summary>
public partial class RzEventViewer : RzComponent<RzEventViewer.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzEventViewer component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "mt-4 overflow-hidden rounded-lg border border-outline bg-card text-card-foreground",
        slots: new()
        {
            [s => s.Container] = "flex flex-col",
            [s => s.Header] = "flex items-center justify-between gap-3 border-b border-outline/70 bg-secondary px-3 py-2 text-sm text-secondary-foreground",
            [s => s.Title] = "text-foreground font-medium",
            [s => s.Controls] = "flex items-center gap-1.5 py-0.5",
            [s => s.IconButton] = "my-auto overflow-hidden rounded-full p-1.5 hover:bg-background/20 focus:outline-none focus:outline-offset-0 focus-visible:outline-2 active:-outline-offset-2",
            [s => s.ActionIcon] = "text-foreground font-bold size-5 cursor-pointer",
            [s => s.StatusBadge] = "rounded-full border border-outline/70 bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
            [s => s.EntryCount] = "rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
            [s => s.Error] = "border-b border-destructive/30 bg-destructive/10 px-4 py-2 font-mono text-xs text-destructive",
            [s => s.Console] = "max-h-64 overflow-y-auto bg-background p-2",
            [s => s.Entry] = "border-b border-outline/50 py-1.5 text-foreground last:border-b-0",
            [s => s.RowHeader] = "grid w-full grid-cols-[minmax(0,18rem)_minmax(0,1fr)_auto] items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            [s => s.RowMeta] = "flex min-w-0 items-center gap-2",
            [s => s.RowPreview] = "truncate text-xs text-muted-foreground",
            [s => s.RowToggle] = "inline-flex size-6 items-center justify-center rounded transition-transform duration-150",
            [s => s.RowExpanded] = "mx-2 mt-1 rounded-md border border-outline/70 bg-muted/30 p-2",
            [s => s.PayloadPre] = "overflow-x-auto whitespace-pre text-xs font-mono text-foreground m-0",
            [s => s.Timestamp] = "shrink-0 text-xs text-muted-foreground/90",
            [s => s.EventName] = "truncate rounded-full border border-outline/70 bg-card px-2 py-0.5 text-xs font-semibold text-foreground",
            [s => s.EntryBody] = "hidden"
        }
    );

    private string _assets = "[]";

    [Inject]
    private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    /// <summary>
    /// Gets or sets the event name to subscribe to.
    /// </summary>
    [Parameter] public string EventName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets additional event names as a JSON array string or CSV value.
    /// </summary>
    [Parameter] public string EventNames { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the binding target for event listeners. Supported values are window, document, or a CSS selector.
    /// </summary>
    [Parameter] public string Target { get; set; } = "window";

    /// <summary>
    /// Gets or sets the maximum number of entries retained in the console.
    /// </summary>
    [Parameter] public int MaxEntries { get; set; } = 200;

    /// <summary>
    /// Gets or sets a value indicating whether the console should auto-scroll after each append.
    /// </summary>
    [Parameter] public bool AutoScroll { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether object payloads should be pretty printed.
    /// </summary>
    [Parameter] public bool Pretty { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether a timestamp prefix should be included in each entry.
    /// </summary>
    [Parameter] public bool ShowTimestamp { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether event metadata should be included in each entry.
    /// </summary>
    [Parameter] public bool ShowEventMeta { get; set; }

    /// <summary>
    /// Gets or sets an optional log level label for entry output.
    /// </summary>
    [Parameter] public string Level { get; set; } = "info";

    /// <summary>
    /// Gets or sets an optional dot-path filter applied to each event detail payload.
    /// </summary>
    [Parameter] public string Filter { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the visible title for the event viewer header.
    /// </summary>
    [Parameter] public string? ViewerTitle { get; set; }

    /// <summary>
    /// Gets or sets the clear button text.
    /// </summary>
    [Parameter] public string? ClearButtonText { get; set; }

    /// <summary>
    /// Gets or sets the copy button text.
    /// </summary>
    [Parameter] public string? CopyButtonText { get; set; }

    /// <summary>
    /// Gets the copy tooltip title before content is copied.
    /// </summary>
    protected string CopyButtonTitle => Localizer["RzEventViewer.CopyButtonTitleCopy"];

    /// <summary>
    /// Gets the copy tooltip title after content is copied.
    /// </summary>
    protected string CopiedButtonTitle => Localizer["RzEventViewer.CopyButtonTitleCopied"];

    /// <summary>
    /// Gets or sets the pause button text.
    /// </summary>
    [Parameter] public string? PauseButtonText { get; set; }

    /// <summary>
    /// Gets or sets the resume button text.
    /// </summary>
    [Parameter] public string? ResumeButtonText { get; set; }

    /// <summary>
    /// Gets or sets the status badge text shown while listening.
    /// </summary>
    [Parameter] public string? ListeningStatusText { get; set; }

    /// <summary>
    /// Gets or sets the status badge text shown while paused.
    /// </summary>
    [Parameter] public string? PausedStatusText { get; set; }

    /// <summary>
    /// Gets or sets the label used for expanding an event row.
    /// </summary>
    [Parameter] public string? ExpandEntryDetailsText { get; set; }

    /// <summary>
    /// Gets or sets the label used for collapsing an event row.
    /// </summary>
    [Parameter] public string? CollapseEntryDetailsText { get; set; }

    /// <summary>
    /// Gets or sets optional component asset keys resolved through <see cref="RizzyUIConfig"/>.
    /// </summary>
    [Parameter] public string[] ComponentAssetKeys { get; set; } = [];

    /// <summary>
    /// Gets a comma-delimited event list for debugging and style hooks.
    /// </summary>
    protected string ResolvedEventNamesAttribute => string.Join(',', ResolveEventNames());

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        SetDefaults();
        UpdateAssets();
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        SetDefaults();
        UpdateAssets();
    }

    private void SetDefaults()
    {
        ViewerTitle ??= Localizer["RzEventViewer.DefaultViewerTitle"];
        ClearButtonText ??= Localizer["RzEventViewer.ClearButtonText"];
        CopyButtonText ??= Localizer["RzEventViewer.CopyButtonText"];
        PauseButtonText ??= Localizer["RzEventViewer.PauseButtonText"];
        ResumeButtonText ??= Localizer["RzEventViewer.ResumeButtonText"];
        ListeningStatusText ??= Localizer["RzEventViewer.ListeningStatusText"];
        PausedStatusText ??= Localizer["RzEventViewer.PausedStatusText"];
        ExpandEntryDetailsText ??= Localizer["RzEventViewer.ExpandEntryDetailsText"];
        CollapseEntryDetailsText ??= Localizer["RzEventViewer.CollapseEntryDetailsText"];
    }

    private IReadOnlyList<string> ResolveEventNames()
    {
        var names = new List<string>();

        if (!string.IsNullOrWhiteSpace(EventName))
            names.Add(EventName.Trim());

        if (!string.IsNullOrWhiteSpace(EventNames))
        {
            var source = EventNames.Trim();
            if (source.StartsWith('['))
            {
                try
                {
                    var parsed = JsonSerializer.Deserialize<List<string>>(source) ?? [];
                    names.AddRange(parsed.Where(name => !string.IsNullOrWhiteSpace(name)).Select(name => name.Trim()));
                }
                catch
                {
                    names.AddRange(source.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(name => name.Trim()));
                }
            }
            else
            {
                names.AddRange(source.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(name => name.Trim()));
            }
        }

        return names.Distinct().ToList();
    }

    private void UpdateAssets()
    {
        var assetUrls = ComponentAssetKeys
            .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
            .Where(url => !string.IsNullOrEmpty(url))
            .ToList();

        _assets = JsonSerializer.Serialize(assetUrls);
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzEventViewer;

    /// <summary>
    /// Defines the slots available for styling in the RzEventViewer component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>The root slot.</summary>
        [Slot("event-viewer")] public string? Base { get; set; }
        /// <summary>The alpine container slot.</summary>
        [Slot("event-viewer-container")] public string? Container { get; set; }
        /// <summary>The header slot.</summary>
        [Slot("header")] public string? Header { get; set; }
        /// <summary>The title slot.</summary>
        [Slot("title")] public string? Title { get; set; }
        /// <summary>The controls container slot.</summary>
        [Slot("controls")] public string? Controls { get; set; }
        /// <summary>The icon button slot.</summary>
        [Slot("icon-button")] public string? IconButton { get; set; }
        /// <summary>The action icon slot.</summary>
        [Slot("action-icon")] public string? ActionIcon { get; set; }
        /// <summary>The status badge slot.</summary>
        [Slot("status-badge")] public string? StatusBadge { get; set; }
        /// <summary>The entry count slot.</summary>
        [Slot("entry-count")] public string? EntryCount { get; set; }
        /// <summary>The error message slot.</summary>
        [Slot("error")] public string? Error { get; set; }
        /// <summary>The scrollable console slot.</summary>
        [Slot("console")] public string? Console { get; set; }
        /// <summary>The entry wrapper slot.</summary>
        [Slot("entry")] public string? Entry { get; set; }
        /// <summary>The collapsed row header slot.</summary>
        [Slot("row-header")] public string? RowHeader { get; set; }
        /// <summary>The row metadata slot.</summary>
        [Slot("row-meta")] public string? RowMeta { get; set; }
        /// <summary>The row preview slot.</summary>
        [Slot("row-preview")] public string? RowPreview { get; set; }
        /// <summary>The row toggle slot.</summary>
        [Slot("row-toggle")] public string? RowToggle { get; set; }
        /// <summary>The expanded panel slot.</summary>
        [Slot("row-expanded")] public string? RowExpanded { get; set; }
        /// <summary>The full payload preformatted text slot.</summary>
        [Slot("payload-pre")] public string? PayloadPre { get; set; }
        /// <summary>The timestamp slot.</summary>
        [Slot("timestamp")] public string? Timestamp { get; set; }
        /// <summary>The event name slot.</summary>
        [Slot("event-name")] public string? EventName { get; set; }
        /// <summary>The legacy entry body slot.</summary>
        [Slot("entry-body")] public string? EntryBody { get; set; }
    }
}
