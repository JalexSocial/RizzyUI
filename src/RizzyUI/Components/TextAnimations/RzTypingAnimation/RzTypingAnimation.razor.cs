using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;
using System.Text.Json;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders typewriter-style text animation for a single string or a sequence of words.
/// </summary>
public partial class RzTypingAnimation : RzComponent<RzTypingAnimation.Slots>
{
    /// <summary>
    /// Defines the default styling for the <see cref="RzTypingAnimation"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "whitespace-pre-wrap align-baseline",
        slots: new()
        {
            [s => s.AlpineRoot] = "inline-flex items-baseline whitespace-pre-wrap",
            [s => s.Source] = "hidden",
            [s => s.Text] = "whitespace-pre-wrap",
            [s => s.Cursor] = "inline-block ml-px select-none",
            [s => s.NoScript] = "whitespace-pre-wrap"
        }
    );

    private static readonly JsonSerializerOptions ConfigSerializerOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    private string _assets = "[]";
    private string _configJson = "{}";

    [Inject]
    private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    /// <summary>
    /// Gets or sets optional text source content used when <see cref="Words"/> is not supplied.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the word sequence to animate.
    /// </summary>
    [Parameter]
    public IReadOnlyList<string>? Words { get; set; }

    /// <summary>
    /// Gets or sets the base typing speed, in milliseconds per character.
    /// </summary>
    [Parameter]
    public int Duration { get; set; } = 100;

    /// <summary>
    /// Gets or sets an explicit typing speed override, in milliseconds per character.
    /// </summary>
    [Parameter]
    public int? TypeSpeed { get; set; }

    /// <summary>
    /// Gets or sets an explicit deleting speed override, in milliseconds per character.
    /// </summary>
    [Parameter]
    public int? DeleteSpeed { get; set; }

    /// <summary>
    /// Gets or sets the initial delay before typing starts, in milliseconds.
    /// </summary>
    [Parameter]
    public int Delay { get; set; }

    /// <summary>
    /// Gets or sets the pause delay after a word is fully typed, in milliseconds.
    /// </summary>
    [Parameter]
    public int PauseDelay { get; set; } = 1000;

    /// <summary>
    /// Gets or sets whether the typing sequence loops.
    /// </summary>
    [Parameter]
    public bool Loop { get; set; }

    /// <summary>
    /// Gets or sets whether animation should wait until entering the viewport.
    /// </summary>
    [Parameter]
    public bool StartOnView { get; set; } = true;

    /// <summary>
    /// Gets or sets whether the cursor should be shown.
    /// </summary>
    [Parameter]
    public bool ShowCursor { get; set; } = true;

    /// <summary>
    /// Gets or sets whether the cursor should blink while visible.
    /// </summary>
    [Parameter]
    public bool BlinkCursor { get; set; } = true;

    /// <summary>
    /// Gets or sets the cursor glyph style.
    /// </summary>
    [Parameter]
    public TypingAnimationCursorStyle CursorStyle { get; set; } = TypingAnimationCursorStyle.Line;

    /// <summary>
    /// Gets or sets logical asset keys resolved from <see cref="RizzyUIConfig"/>.
    /// </summary>
    [Parameter]
    public string[] ComponentAssetKeys { get; set; } = [];

    private bool HasWordSource => ResolvedWords.Count > 0;

    private IReadOnlyList<string> ResolvedWords => Words?
        .Where(word => word is not null)
        .ToArray() ?? [];

    private bool ShouldRenderSourceSlot => !HasWordSource && ChildContent is not null;

    private bool ShouldRenderCursor => ShowCursor && (HasWordSource || ChildContent is not null);

    private string? NoScriptFallbackWord => HasWordSource ? ResolvedWords[0] : null;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (string.IsNullOrEmpty(Element))
            Element = "span";

        UpdateAssets();
        UpdateSerializedConfig();
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        UpdateAssets();
        UpdateSerializedConfig();
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzTypingAnimation;

    private void UpdateAssets()
    {
        var assetUrls = ComponentAssetKeys
            .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
            .Where(url => !string.IsNullOrEmpty(url))
            .ToList();

        _assets = JsonSerializer.Serialize(assetUrls);
    }

    private void UpdateSerializedConfig()
    {
        var effectiveTypeSpeed = Math.Max(TypeSpeed ?? Duration, 1);
        var effectiveDeleteSpeed = Math.Max(DeleteSpeed ?? (effectiveTypeSpeed / 2), 1);

        var config = new
        {
            words = HasWordSource ? ResolvedWords : null,
            duration = Math.Max(Duration, 1),
            typeSpeed = effectiveTypeSpeed,
            deleteSpeed = effectiveDeleteSpeed,
            delay = Math.Max(Delay, 0),
            pauseDelay = Math.Max(PauseDelay, 0),
            loop = Loop,
            startOnView = StartOnView,
            showCursor = ShowCursor,
            blinkCursor = BlinkCursor,
            cursorStyle = CursorStyle.ToString().ToKebabCase()
        };

        _configJson = JsonSerializer.Serialize(config, ConfigSerializerOptions);
    }

    /// <summary>
    /// Defines the slots available for styling in the <see cref="RzTypingAnimation"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the root element.
        /// </summary>
        [Slot("typing-animation")]
        public string? Base { get; set; }

        /// <summary>
        /// Gets or sets classes for the Alpine root container.
        /// </summary>
        [Slot("typing-animation-root")]
        public string? AlpineRoot { get; set; }

        /// <summary>
        /// Gets or sets classes for the hidden source element.
        /// </summary>
        [Slot("source")]
        public string? Source { get; set; }

        /// <summary>
        /// Gets or sets classes for the visible text element.
        /// </summary>
        [Slot("text")]
        public string? Text { get; set; }

        /// <summary>
        /// Gets or sets classes for the cursor element.
        /// </summary>
        [Slot("cursor")]
        public string? Cursor { get; set; }

        /// <summary>
        /// Gets or sets classes for the noscript fallback element.
        /// </summary>
        [Slot("noscript")]
        public string? NoScript { get; set; }
    }
}
