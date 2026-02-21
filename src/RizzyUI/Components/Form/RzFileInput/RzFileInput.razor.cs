using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.Extensions.Options;
using System.Linq.Expressions;
using System.Text.Json;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Provides an SSR-friendly file input with Alpine-enhanced drag-and-drop and preview behavior.
/// </summary>
public partial class RzFileInput : RzComponent<RzFileInput.Slots>, IHasFormInputStylingProperties
{
    /// <summary>
    /// Defines the default styling for the <see cref="RzFileInput"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "w-full",
        slots: new()
        {
            [s => s.Container] = "w-full space-y-3",
            [s => s.NativeInput] = "sr-only",
            [s => s.Trigger] = "inline-flex min-h-9 cursor-pointer items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            [s => s.TriggerContent] = "text-sm leading-none",
            [s => s.List] = "mt-2 space-y-2",
            [s => s.Item] = "flex items-center gap-3 rounded-md border border-border bg-background p-2",
            [s => s.PreviewImage] = "size-10 rounded-md border border-border object-cover",
            [s => s.Info] = "min-w-0 flex-1",
            [s => s.FileName] = "block truncate text-sm font-medium",
            [s => s.FileSize] = "block text-xs text-muted-foreground",
            [s => s.RemoveButton] = "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        },
        variants: new()
        {
            [c => ((RzFileInput)c).Variant] = new Variant<FileInputVariant, Slots>
            {
                [FileInputVariant.Default] = new()
                {
                    [s => s.Trigger] = "inline-flex w-auto"
                },
                [FileInputVariant.Button] = new()
                {
                    [s => s.Trigger] = "inline-flex w-auto"
                },
                [FileInputVariant.Dropzone] = new()
                {
                    [s => s.Trigger] = "flex min-h-36 w-full flex-col justify-center border-2 border-dashed bg-muted/20 px-6 py-6 text-center hover:bg-muted/50 data-[dragging=true]:border-primary data-[dragging=true]:bg-accent"
                }
            },
            [c => ((RzFileInput)c).Disabled] = new Variant<bool, Slots>
            {
                [true] = new()
                {
                    [s => s.Trigger] = "cursor-not-allowed opacity-60"
                }
            },
            [c => ((RzFileInput)c).IsInvalid] = new Variant<bool, Slots>
            {
                [true] = new()
                {
                    [s => s.Trigger] = "border-destructive ring-1 ring-destructive/40"
                }
            }
        }
    );

    private string _assets = "[]";

    [Inject]
    private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    /// <summary>
    /// Gets or sets custom trigger content.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the posted field name for multipart form submissions.
    /// </summary>
    [Parameter] public string? Name { get; set; }

    /// <summary>
    /// Gets or sets whether the input accepts multiple files.
    /// </summary>
    [Parameter] public bool Multiple { get; set; }

    /// <summary>
    /// Gets or sets accepted MIME types or file extensions.
    /// </summary>
    [Parameter] public string? Accept { get; set; }

    /// <summary>
    /// Gets or sets whether the input is disabled.
    /// </summary>
    [Parameter] public bool Disabled { get; set; }

    /// <summary>
    /// Gets or sets the visual variant for the component.
    /// </summary>
    [Parameter] public FileInputVariant Variant { get; set; } = FileInputVariant.Default;

    /// <summary>
    /// Gets or sets the accessible name for trigger and input elements.
    /// </summary>
    [Parameter] public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets or sets the model expression used for optional validation tracking.
    /// </summary>
    [Parameter] public Expression<Func<object?>>? For { get; set; }

    /// <summary>
    /// Gets or sets logical keys used to resolve optional assets from <see cref="RizzyUIConfig"/>.
    /// </summary>
    [Parameter] public string[] ComponentAssetKeys { get; set; } = [];

    /// <summary>
    /// Gets the generated identifier for the hidden native input.
    /// </summary>
    public string InputId => $"{Id}-input";

    /// <summary>
    /// Gets the generated identifier for the rendered file list.
    /// </summary>
    public string ListId => $"{Id}-list";

    /// <summary>
    /// Gets the name value rendered onto the native input.
    /// </summary>
    public string NameAttributeValue => Name ?? FieldName ?? Id;

    /// <summary>
    /// Gets a value indicating whether the associated field currently has validation errors.
    /// </summary>
    public bool IsInvalid { get; private set; }

    private string? FieldName => For is null ? null : FieldIdentifier.Create(For).FieldName;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
            Element = "div";

        AriaLabel ??= Localizer["RzFileInput.DefaultAriaLabel"];
        UpdateValidationState();
        UpdateAssets();
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzFileInput.DefaultAriaLabel"];
        UpdateValidationState();
        UpdateAssets();
    }

    private void UpdateValidationState()
    {
        if (For is null || EditContext is null)
        {
            IsInvalid = false;
            return;
        }

        var fieldIdentifier = FieldIdentifier.Create(For);
        IsInvalid = EditContext.GetValidationMessages(fieldIdentifier).Any();
    }

    private void UpdateAssets()
    {
        var assetUrls = ComponentAssetKeys
            .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
            .Where(url => !string.IsNullOrEmpty(url))
            .ToList();
        _assets = JsonSerializer.Serialize(assetUrls);
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzFileInput;

    /// <summary>
    /// Defines the slots available for styling in the <see cref="RzFileInput"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the root element.
        /// </summary>
        [Slot("file-input")]
        public string? Base { get; set; }

        /// <summary>
        /// Gets or sets classes for the Alpine container.
        /// </summary>
        [Slot("container")]
        public string? Container { get; set; }

        /// <summary>
        /// Gets or sets classes for the native file input.
        /// </summary>
        [Slot("native-input")]
        public string? NativeInput { get; set; }

        /// <summary>
        /// Gets or sets classes for the visible trigger.
        /// </summary>
        [Slot("trigger")]
        public string? Trigger { get; set; }

        /// <summary>
        /// Gets or sets classes for trigger text content.
        /// </summary>
        [Slot("trigger-content")]
        public string? TriggerContent { get; set; }

        /// <summary>
        /// Gets or sets classes for the selected-files list.
        /// </summary>
        [Slot("list")]
        public string? List { get; set; }

        /// <summary>
        /// Gets or sets classes for each file row.
        /// </summary>
        [Slot("item")]
        public string? Item { get; set; }

        /// <summary>
        /// Gets or sets classes for image previews.
        /// </summary>
        [Slot("preview-image")]
        public string? PreviewImage { get; set; }

        /// <summary>
        /// Gets or sets classes for file metadata container.
        /// </summary>
        [Slot("info")]
        public string? Info { get; set; }

        /// <summary>
        /// Gets or sets classes for file names.
        /// </summary>
        [Slot("file-name")]
        public string? FileName { get; set; }

        /// <summary>
        /// Gets or sets classes for formatted file sizes.
        /// </summary>
        [Slot("file-size")]
        public string? FileSize { get; set; }

        /// <summary>
        /// Gets or sets classes for file remove buttons.
        /// </summary>
        [Slot("remove-button")]
        public string? RemoveButton { get; set; }
    }
}
