using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;
using System.Text.Json;
using System.Text.Json.Serialization;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Represents a decorative Alpine.js confetti wrapper that augments child content in SSR workflows.
/// </summary>
public partial class RzConfetti : RzComponent<RzConfetti.Slots>
{
    /// <summary>
    /// Defines the default styling for the <see cref="RzConfetti"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: string.Empty,
        slots: new()
        {
            [s => s.AlpineRoot] = "block",
            [s => s.Canvas] = "absolute inset-0 pointer-events-none h-full w-full",
            [s => s.Content] = "relative"
        },
        variants: new()
        {
            [c => ((RzConfetti)c).Mode] = new Variant<ConfettiMode, Slots>
            {
                [ConfettiMode.Scoped] = new() { [s => s.Base] = "relative" },
                [ConfettiMode.Overlay] = new() { [s => s.Base] = string.Empty },
                [ConfettiMode.ElementOrigin] = new() { [s => s.Base] = string.Empty }
            },
            [c => ((RzConfetti)c).Disabled] = new Variant<bool, Slots>
            {
                [true] = new() { [s => s.AlpineRoot] = "opacity-100" }
            }
        }
    );

    private string _assets = "[]";
    private string _optionsJson = "{}";

    [Inject]
    private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    /// <summary>
    /// Gets the effective browser event name used for custom-event mode.
    /// </summary>
    protected string EffectiveEventName => string.IsNullOrWhiteSpace(EventName) ? "rz:confetti" : EventName;

    /// <summary>
    /// Gets or sets child content enhanced by confetti behavior.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the confetti trigger mode.
    /// </summary>
    [Parameter]
    public ConfettiTrigger Trigger { get; set; } = ConfettiTrigger.Click;

    /// <summary>
    /// Gets or sets whether confetti behavior is disabled.
    /// </summary>
    [Parameter]
    public bool Disabled { get; set; }

    /// <summary>
    /// Gets or sets whether the confetti effect should only fire once.
    /// </summary>
    [Parameter]
    public bool Once { get; set; }

    /// <summary>
    /// Gets or sets the cooldown time in milliseconds between trigger firings.
    /// </summary>
    [Parameter]
    public int CooldownMs { get; set; }

    /// <summary>
    /// Gets or sets the custom event name for <see cref="ConfettiTrigger.CustomEvent"/>.
    /// </summary>
    [Parameter]
    public string? EventName { get; set; }

    /// <summary>
    /// Gets or sets the preset used to shape confetti behavior.
    /// </summary>
    [Parameter]
    public ConfettiPreset Preset { get; set; } = ConfettiPreset.DefaultBurst;

    /// <summary>
    /// Gets or sets the number of bursts fired in a sequence.
    /// </summary>
    [Parameter]
    public int BurstCount { get; set; } = 1;

    /// <summary>
    /// Gets or sets the delay in milliseconds between sequence bursts.
    /// </summary>
    [Parameter]
    public int BurstIntervalMs { get; set; } = 150;

    /// <summary>
    /// Gets or sets the rendering mode used for confetti canvases and origins.
    /// </summary>
    [Parameter]
    public ConfettiMode Mode { get; set; } = ConfettiMode.ElementOrigin;

    /// <summary>
    /// Gets or sets whether element-origin mode should launch from the host center.
    /// </summary>
    [Parameter]
    public bool LaunchFromElementCenter { get; set; } = true;

    /// <summary>
    /// Gets or sets whether pointer coordinates should be used when available.
    /// </summary>
    [Parameter]
    public bool LaunchFromPointer { get; set; }

    /// <summary>
    /// Gets or sets whether confetti canvases should auto-resize with the viewport.
    /// </summary>
    [Parameter]
    public bool ResizeCanvas { get; set; } = true;

    /// <summary>
    /// Gets or sets whether canvas-confetti should use workers when supported.
    /// </summary>
    [Parameter]
    public bool UseWorker { get; set; }

    /// <summary>
    /// Gets or sets the stacking order used for confetti rendering.
    /// </summary>
    [Parameter]
    public int ZIndex { get; set; } = 100;

    /// <summary>
    /// Gets or sets an optional particle count override.
    /// </summary>
    [Parameter]
    public int? ParticleCount { get; set; }

    /// <summary>
    /// Gets or sets an optional angle override.
    /// </summary>
    [Parameter]
    public double? Angle { get; set; }

    /// <summary>
    /// Gets or sets an optional spread override.
    /// </summary>
    [Parameter]
    public double? Spread { get; set; }

    /// <summary>
    /// Gets or sets an optional start velocity override.
    /// </summary>
    [Parameter]
    public double? StartVelocity { get; set; }

    /// <summary>
    /// Gets or sets an optional decay override.
    /// </summary>
    [Parameter]
    public double? Decay { get; set; }

    /// <summary>
    /// Gets or sets an optional gravity override.
    /// </summary>
    [Parameter]
    public double? Gravity { get; set; }

    /// <summary>
    /// Gets or sets an optional drift override.
    /// </summary>
    [Parameter]
    public double? Drift { get; set; }

    /// <summary>
    /// Gets or sets an optional ticks override.
    /// </summary>
    [Parameter]
    public int? Ticks { get; set; }

    /// <summary>
    /// Gets or sets an optional scalar override.
    /// </summary>
    [Parameter]
    public double? Scalar { get; set; }

    /// <summary>
    /// Gets or sets an optional flat-mode override.
    /// </summary>
    [Parameter]
    public bool? Flat { get; set; }

    /// <summary>
    /// Gets or sets optional confetti colors.
    /// </summary>
    [Parameter]
    public string[]? Colors { get; set; }

    /// <summary>
    /// Gets or sets optional confetti shapes.
    /// </summary>
    [Parameter]
    public string[]? Shapes { get; set; }

    /// <summary>
    /// Gets or sets an optional normalized origin X coordinate.
    /// </summary>
    [Parameter]
    public double? OriginX { get; set; }

    /// <summary>
    /// Gets or sets an optional normalized origin Y coordinate.
    /// </summary>
    [Parameter]
    public double? OriginY { get; set; }

    /// <summary>
    /// Gets or sets whether confetti should be suppressed when reduced motion is preferred.
    /// </summary>
    [Parameter]
    public bool DisableForReducedMotion { get; set; } = true;

    /// <summary>
    /// Gets or sets the logical keys used to resolve optional assets from <see cref="RizzyUIConfig"/>.
    /// </summary>
    [Parameter]
    public string[] ComponentAssetKeys { get; set; } = ["CanvasConfetti"];

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        UpdateAssets();
        UpdateOptions();
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        UpdateAssets();
        UpdateOptions();
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzConfetti;

    private void UpdateAssets()
    {
        var assetUrls = ComponentAssetKeys
            .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
            .Where(url => !string.IsNullOrEmpty(url))
            .ToList();

        _assets = JsonSerializer.Serialize(assetUrls);
    }

    private void UpdateOptions()
    {
        var options = new ConfettiOptions
        {
            ParticleCount = ParticleCount,
            Angle = Angle,
            Spread = Spread,
            StartVelocity = StartVelocity,
            Decay = Decay,
            Gravity = Gravity,
            Drift = Drift,
            Ticks = Ticks,
            Scalar = Scalar,
            Flat = Flat,
            Colors = Colors,
            Shapes = Shapes,
            OriginX = OriginX,
            OriginY = OriginY,
            DisableForReducedMotion = DisableForReducedMotion
        };

        _optionsJson = JsonSerializer.Serialize(options, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        });
    }

    /// <summary>
    /// Defines the slots available for styling in the <see cref="RzConfetti"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets classes for the root element.
        /// </summary>
        [Slot("confetti")]
        public string? Base { get; set; }

        /// <summary>
        /// Gets or sets classes for the Alpine root container.
        /// </summary>
        [Slot("confetti-root")]
        public string? AlpineRoot { get; set; }

        /// <summary>
        /// Gets or sets classes for the scoped confetti canvas.
        /// </summary>
        [Slot("confetti-canvas")]
        public string? Canvas { get; set; }

        /// <summary>
        /// Gets or sets classes for the child content wrapper.
        /// </summary>
        [Slot("confetti-content")]
        public string? Content { get; set; }
    }

    private sealed record ConfettiOptions
    {
        public int? ParticleCount { get; init; }
        public double? Angle { get; init; }
        public double? Spread { get; init; }
        public double? StartVelocity { get; init; }
        public double? Decay { get; init; }
        public double? Gravity { get; init; }
        public double? Drift { get; init; }
        public int? Ticks { get; init; }
        public double? Scalar { get; init; }
        public bool? Flat { get; init; }
        public string[]? Colors { get; init; }
        public string[]? Shapes { get; init; }
        public double? OriginX { get; init; }
        public double? OriginY { get; init; }
        public bool DisableForReducedMotion { get; init; }
    }
}

/// <summary>
/// Defines supported confetti trigger strategies.
/// </summary>
public enum ConfettiTrigger
{
    /// <summary>Fires when the wrapped element is clicked.</summary>
    Click,
    /// <summary>Fires when a pointer enters the wrapped element.</summary>
    Hover,
    /// <summary>Fires once during Alpine initialization.</summary>
    Load,
    /// <summary>Fires when the wrapped region becomes visible in the viewport.</summary>
    Visible,
    /// <summary>Fires when a configured browser event is observed.</summary>
    CustomEvent,
    /// <summary>Disables automatic trigger binding for manual orchestration.</summary>
    Manual
}

/// <summary>
/// Defines confetti rendering modes.
/// </summary>
public enum ConfettiMode
{
    /// <summary>Uses a viewport-level overlay confetti canvas.</summary>
    Overlay,
    /// <summary>Uses a local scoped canvas rendered inside the component.</summary>
    Scoped,
    /// <summary>Uses a viewport canvas while deriving origin from the wrapped element.</summary>
    ElementOrigin
}

/// <summary>
/// Defines built-in confetti effect presets.
/// </summary>
public enum ConfettiPreset
{
    /// <summary>A balanced center burst.</summary>
    DefaultBurst,
    /// <summary>A left-side celebratory cannon.</summary>
    CannonLeft,
    /// <summary>A right-side celebratory cannon.</summary>
    CannonRight,
    /// <summary>Two mirrored cannon bursts.</summary>
    DualCannons,
    /// <summary>A multi-burst celebratory sequence.</summary>
    Victory,
    /// <summary>A subtle low-noise confetti effect.</summary>
    Subtle,
    /// <summary>A star-emphasized confetti effect.</summary>
    Stars
}
