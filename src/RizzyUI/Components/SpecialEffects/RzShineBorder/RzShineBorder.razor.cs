using System.Globalization;
using System.Text.Json;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders a decorative animated shine overlay that can be layered over a relatively positioned container.
/// </summary>
public partial class RzShineBorder : RzComponent<RzShineBorder.Slots>
{
    /// <summary>
    /// Defines the default styling for the <see cref="RzShineBorder"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "pointer-events-none absolute inset-0 size-full",
        slots: new()
        {
            [s => s.Overlay] = "size-full rounded-[inherit] will-change-[background-position]"
        },
        variants: new()
        {
            [c => ((RzShineBorder)c).RespectReducedMotion] = new Variant<bool, Slots>
            {
                [true] = new() { [s => s.Overlay] = "motion-safe:animate-shine" },
                [false] = new() { [s => s.Overlay] = "animate-shine" }
            }
        }
    );

    /// <summary>
    /// Gets or sets the border width, in pixels.
    /// </summary>
    [Parameter]
    public double BorderWidth { get; set; } = 1;

    /// <summary>
    /// Gets or sets the animation duration, in seconds.
    /// </summary>
    [Parameter]
    public double Duration { get; set; } = 14;

    /// <summary>
    /// Gets or sets a single CSS color used by the shine effect.
    /// </summary>
    [Parameter]
    public string? ShineColor { get; set; }

    /// <summary>
    /// Gets or sets a sequence of CSS colors used for a multi-color shine effect.
    /// When provided with at least one value, this takes precedence over <see cref="ShineColor"/>.
    /// </summary>
    [Parameter]
    public IEnumerable<string>? ShineColors { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether motion-safe animation utility classes should be used.
    /// </summary>
    [Parameter]
    public bool RespectReducedMotion { get; set; } = true;

    /// <summary>
    /// Gets or sets the logical asset keys required by this component.
    /// </summary>
    [Parameter]
    public string[] ComponentAssetKeys { get; set; } = [];

    [Inject]
    private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    private string _assets = "[]";
    private string _serializedShineColors = "[]";

    /// <summary>
    /// Gets the root style declarations required for root-level animation variables.
    /// </summary>
    public string RootStyle { get; private set; } = string.Empty;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        UpdateAlpinePayload();
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        UpdateAlpinePayload();
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzShineBorder;

    private void UpdateAlpinePayload()
    {
        var assetUrls = ComponentAssetKeys
            .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
            .Where(url => !string.IsNullOrWhiteSpace(url))
            .ToList();

        _assets = JsonSerializer.Serialize(assetUrls);

        var nonEmptyColors = ShineColors?
            .Where(color => !string.IsNullOrWhiteSpace(color))
            .ToArray() ?? [];

        _serializedShineColors = JsonSerializer.Serialize(nonEmptyColors);

        var normalizedDuration = Duration > 0 ? Duration : 14;
        var rootStyle = $"--duration:{normalizedDuration.ToString(CultureInfo.InvariantCulture)}s";

        var userStyle = AdditionalAttributes?.TryGetValue("style", out var styleValue) == true
            ? styleValue?.ToString()
            : null;

        RootStyle = string.IsNullOrWhiteSpace(userStyle)
            ? rootStyle
            : $"{rootStyle};{userStyle}";
    }

    /// <summary>
    /// Defines the slots available for styling in the <see cref="RzShineBorder"/> component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("shine-border")]
        public string? Base { get; set; }

        /// <summary>
        /// The overlay slot that receives the computed shine style and animation classes.
        /// </summary>
        [Slot("shine-border-overlay")]
        public string? Overlay { get; set; }
    }
}
