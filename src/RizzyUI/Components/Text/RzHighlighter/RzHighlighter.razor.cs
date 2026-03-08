using System.Globalization;
using System.Text.Json;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Wraps inline content and applies a rough-style animated text annotation using Alpine.js on the client.
/// </summary>
public partial class RzHighlighter : RzComponent<RzHighlighter.Slots>
{
    private const string DefaultColor = "var(--highlight-1)";
    private const double DefaultStrokeWidth = 1.5;
    private const int DefaultAnimationDuration = 600;
    private const int DefaultIterations = 2;
    private const int DefaultPadding = 2;
    private const string DefaultViewMargin = "-10%";

    /// <summary>
    /// Defines the default styling for the RzHighlighter component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative inline-block align-baseline bg-transparent",
        slots: new()
        {
            [s => s.Content] = "relative inline"
        },
        variants: new()
        {
            [c => ((RzHighlighter)c).Action] = new Variant<HighlighterAction, Slots>
            {
                [HighlighterAction.Highlight] = new() { [s => s.Content] = "px-[0.02em]" },
                [HighlighterAction.Underline] = new() { [s => s.Content] = "pb-[0.05em]" }
            }
        }
    );

    private string _assets = "[]";

    [Inject]
    private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    /// <summary>
    /// Gets or sets the content to annotate.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the annotation style.
    /// </summary>
    [Parameter] public HighlighterAction Action { get; set; } = HighlighterAction.Highlight;

    /// <summary>
    /// Gets or sets the annotation color.
    /// </summary>
    [Parameter] public string? Color { get; set; } = DefaultColor;

    /// <summary>
    /// Gets or sets the stroke width used by the annotation.
    /// </summary>
    [Parameter] public double StrokeWidth { get; set; } = DefaultStrokeWidth;

    /// <summary>
    /// Gets or sets the annotation animation duration in milliseconds.
    /// </summary>
    [Parameter] public int AnimationDuration { get; set; } = DefaultAnimationDuration;

    /// <summary>
    /// Gets or sets the number of animation iterations.
    /// </summary>
    [Parameter] public int Iterations { get; set; } = DefaultIterations;

    /// <summary>
    /// Gets or sets the annotation padding in pixels.
    /// </summary>
    [Parameter] public int Padding { get; set; } = DefaultPadding;

    /// <summary>
    /// Gets or sets a value indicating whether annotation should span wrapped lines.
    /// </summary>
    [Parameter] public bool Multiline { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether the annotation should start only when the target is in view.
    /// </summary>
    [Parameter] public bool StartOnView { get; set; }

    /// <summary>
    /// Gets or sets the intersection observer root margin used when <see cref="StartOnView"/> is true.
    /// </summary>
    [Parameter] public string? ViewMargin { get; set; } = DefaultViewMargin;

    /// <summary>
    /// Gets or sets the logical keys used to resolve required client-side assets.
    /// </summary>
    [Parameter] public string[] ComponentAssetKeys { get; set; } = ["RzHighlighterCoreScript"];

    /// <summary>
    /// Gets the kebab-case annotation action value for data attributes.
    /// </summary>
    protected string EffectiveAction => Action.ToString().ToKebabCase();

    /// <summary>
    /// Gets the normalized color for data attributes.
    /// </summary>
    protected string EffectiveColor => string.IsNullOrWhiteSpace(Color) ? DefaultColor : Color;

    /// <summary>
    /// Gets the normalized stroke width for data attributes.
    /// </summary>
    protected string EffectiveStrokeWidth => Math.Max(0.1, StrokeWidth).ToString("0.###", CultureInfo.InvariantCulture);

    /// <summary>
    /// Gets the normalized animation duration for data attributes.
    /// </summary>
    protected int EffectiveAnimationDuration => Math.Max(0, AnimationDuration);

    /// <summary>
    /// Gets the normalized iteration count for data attributes.
    /// </summary>
    protected int EffectiveIterations => Math.Max(1, Iterations);

    /// <summary>
    /// Gets the normalized padding value for data attributes.
    /// </summary>
    protected int EffectivePadding => Math.Max(0, Padding);

    /// <summary>
    /// Gets the normalized view margin for data attributes.
    /// </summary>
    protected string EffectiveViewMargin => string.IsNullOrWhiteSpace(ViewMargin) ? DefaultViewMargin : ViewMargin;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "span";

        UpdateAssets();
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        UpdateAssets();
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzHighlighter;

    private void UpdateAssets()
    {
        var assetUrls = ComponentAssetKeys
            .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
            .Where(url => !string.IsNullOrWhiteSpace(url))
            .ToList();

        _assets = JsonSerializer.Serialize(assetUrls);
    }

    /// <summary>
    /// Defines the slots available for styling in the RzHighlighter component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("highlighter")]
        public string? Base { get; set; }

        /// <summary>
        /// The slot for the annotation target content.
        /// </summary>
        [Slot("content")]
        public string? Content { get; set; }
    }
}
