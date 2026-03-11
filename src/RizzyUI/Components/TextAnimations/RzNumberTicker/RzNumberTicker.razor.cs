using System.Globalization;
using System.Text.Json;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders an SSR-first numeric value that can progressively animate on the client with Alpine.js.
/// </summary>
public partial class RzNumberTicker : RzComponent<RzNumberTicker.Slots>
{
    /// <summary>
    /// Defines the default styling for the <see cref="RzNumberTicker"/> component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "inline-block align-baseline",
        slots: new()
        {
            [s => s.Body] = "inline-block",
            [s => s.Value] = "inline-block tabular-nums tracking-wider text-foreground"
        }
    );

    /// <summary>
    /// Gets or sets the final number displayed by the ticker.
    /// </summary>
    [Parameter]
    public decimal Value { get; set; }

    /// <summary>
    /// Gets or sets the animation origin when counting up and destination when counting down.
    /// </summary>
    [Parameter]
    public decimal StartValue { get; set; }

    /// <summary>
    /// Gets or sets the animation direction.
    /// </summary>
    [Parameter]
    public NumberTickerDirection Direction { get; set; } = NumberTickerDirection.Up;

    /// <summary>
    /// Gets or sets the animation delay in seconds.
    /// </summary>
    [Parameter]
    public double Delay { get; set; }

    /// <summary>
    /// Gets or sets the number of decimal places used for formatting.
    /// </summary>
    [Parameter]
    public int DecimalPlaces { get; set; }

    /// <summary>
    /// Gets or sets the culture name used for number formatting.
    /// </summary>
    [Parameter]
    public string? Culture { get; set; }

    /// <summary>
    /// Gets or sets whether group separators are used during number formatting.
    /// </summary>
    [Parameter]
    public bool UseGrouping { get; set; } = true;

    /// <summary>
    /// Gets or sets whether animation starts when the component enters the viewport.
    /// </summary>
    [Parameter]
    public bool TriggerOnView { get; set; } = true;

    /// <summary>
    /// Gets or sets whether viewport-triggered animation only runs once.
    /// </summary>
    [Parameter]
    public bool AnimateOnce { get; set; } = true;

    /// <summary>
    /// Gets or sets whether animation is disabled and only server-rendered text is shown.
    /// </summary>
    [Parameter]
    public bool DisableAnimation { get; set; }

    /// <summary>
    /// Gets or sets an optional accessible label applied to the root element.
    /// </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary>
    /// Gets or sets the logical asset keys to resolve into runtime URLs.
    /// </summary>
    [Parameter]
    public string[] ComponentAssetKeys { get; set; } = [];

    [Inject]
    private IOptions<RizzyUIConfig> RizzyUIConfig { get; set; } = default!;

    private string _assets = "[]";
    private string EffectiveCultureName { get; set; } = CultureInfo.CurrentCulture.Name;
    private CultureInfo EffectiveCultureInfo { get; set; } = CultureInfo.CurrentCulture;

    private int EffectiveDecimalPlaces => Math.Max(0, DecimalPlaces);
    private double EffectiveDelay => Math.Max(0, Delay);

    private string FormattedValue => FormatValue(Value);

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        UpdateFormattingCulture();
        UpdateAssets();
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        UpdateFormattingCulture();
        UpdateAssets();
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzNumberTicker;

    private string FormatValue(decimal number)
    {
        var format = $"N{EffectiveDecimalPlaces}";
        var formatted = number.ToString(format, EffectiveCultureInfo);
        return UseGrouping ? formatted : formatted.Replace(EffectiveCultureInfo.NumberFormat.NumberGroupSeparator, string.Empty);
    }

    private void UpdateFormattingCulture()
    {
        if (!string.IsNullOrWhiteSpace(Culture))
        {
            try
            {
                EffectiveCultureInfo = CultureInfo.GetCultureInfo(Culture);
                EffectiveCultureName = EffectiveCultureInfo.Name;
                return;
            }
            catch (CultureNotFoundException)
            {
            }
        }

        EffectiveCultureInfo = CultureInfo.CurrentCulture;
        EffectiveCultureName = EffectiveCultureInfo.Name;
    }

    private void UpdateAssets()
    {
        var assetUrls = ComponentAssetKeys
            .Select(key => RizzyUIConfig.Value.AssetUrls.TryGetValue(key, out var url) ? url : null)
            .Where(url => !string.IsNullOrWhiteSpace(url))
            .ToList();

        _assets = JsonSerializer.Serialize(assetUrls);
    }

    /// <summary>
    /// Defines the slots available for styling in <see cref="RzNumberTicker"/>.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// Gets or sets the root element classes.
        /// </summary>
        [Slot("number-ticker")]
        public string? Base { get; set; }

        /// <summary>
        /// Gets or sets the Alpine host container classes.
        /// </summary>
        [Slot("body")]
        public string? Body { get; set; }

        /// <summary>
        /// Gets or sets the numeric value text classes.
        /// </summary>
        [Slot("value")]
        public string? Value { get; set; }
    }
}
