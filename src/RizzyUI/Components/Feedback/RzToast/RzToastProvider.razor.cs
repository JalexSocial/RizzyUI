using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Localization;
using System.Text.Json;
using System.Text.Json.Serialization;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Renders the SSR-only provider, position stacks, and JSON class map for the RizzyUI toast runtime.
/// </summary>
public partial class RzToastProvider : RzComponent<RzToastProviderSlots>, IHasRzToastProviderStylingProperties
{
    private static readonly JsonSerializerOptions SerializerOptions = new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
    };

    private string _serializedConfig = "{}";
    private RzToastClassMap _classMap = new();

    [Inject]
    private TwVariants Tv { get; set; } = default!;

    /// <summary>Gets the canonical positions rendered by every toast provider.</summary>
    protected static readonly IReadOnlyList<ToastPosition> SupportedPositions =
    [
        ToastPosition.TopLeft,
        ToastPosition.TopCenter,
        ToastPosition.TopRight,
        ToastPosition.BottomLeft,
        ToastPosition.BottomCenter,
        ToastPosition.BottomRight,
        ToastPosition.Center,
        ToastPosition.LeftCenter,
        ToastPosition.RightCenter
    ];

    /// <summary>Gets or sets the default position used by new toast notifications.</summary>
    [Parameter]
    public ToastPosition Position { get; set; } = ToastPosition.TopRight;

    /// <summary>Gets or sets the default status used by new toast notifications.</summary>
    [Parameter]
    public ToastStatus DefaultStatus { get; set; } = ToastStatus.Info;

    /// <summary>Gets or sets the default visual tone used by new toast notifications.</summary>
    [Parameter]
    public ToastTone Tone { get; set; } = ToastTone.Subtle;

    /// <summary>Gets or sets the default animation preset used by toast notifications.</summary>
    [Parameter]
    public ToastAnimation Animation { get; set; } = ToastAnimation.Fade;

    /// <summary>Gets or sets how a stack behaves when it reaches <see cref="MaxVisible"/>.</summary>
    [Parameter]
    public ToastOverflowStrategy OverflowStrategy { get; set; } = ToastOverflowStrategy.DismissOldest;

    /// <summary>Gets or sets the default auto-dismiss duration in milliseconds.</summary>
    [Parameter]
    public int Duration { get; set; } = 4000;

    /// <summary>Gets or sets the transition speed in milliseconds.</summary>
    [Parameter]
    public int Speed { get; set; } = 300;

    /// <summary>Gets or sets the maximum visible toast count per position stack.</summary>
    [Parameter]
    public int MaxVisible { get; set; } = 5;

    /// <summary>Gets or sets whether new toast notifications are inserted above older notifications.</summary>
    [Parameter]
    public bool NewestOnTop { get; set; } = true;

    /// <summary>Gets or sets whether toast notifications show a close button by default.</summary>
    [Parameter]
    public bool Dismissible { get; set; } = true;

    /// <summary>Gets or sets whether status icons are shown by default.</summary>
    [Parameter]
    public bool ShowIcon { get; set; } = true;

    /// <summary>Gets or sets whether progress indicators are shown by default.</summary>
    [Parameter]
    public bool ShowProgress { get; set; } = true;

    /// <summary>Gets or sets whether auto-dismiss timers pause while hovering a toast.</summary>
    [Parameter]
    public bool PauseOnHover { get; set; } = true;

    /// <summary>Gets or sets whether auto-dismiss timers pause while focus is inside a toast.</summary>
    [Parameter]
    public bool PauseOnFocus { get; set; } = true;

    /// <summary>Gets or sets whether auto-dismiss timers pause while the browser window is blurred.</summary>
    [Parameter]
    public bool PauseOnWindowBlur { get; set; }

    /// <summary>Gets or sets whether Escape can dismiss a focused toast.</summary>
    [Parameter]
    public bool CloseOnEscape { get; set; } = true;

    /// <summary>Gets or sets whether duplicate toast notifications are prevented by default.</summary>
    [Parameter]
    public bool PreventDuplicates { get; set; }

    /// <summary>Gets or sets the aria-label used by JavaScript-rendered toast close buttons.</summary>
    [Parameter]
    public string? CloseButtonAriaLabel { get; set; }

    /// <summary>Gets or sets the aria-label used by the provider region.</summary>
    [Parameter]
    public string? RegionAriaLabel { get; set; }

    ToastStatus IHasRzToastProviderStylingProperties.Status => DefaultStatus;

    ToastPosition IHasRzToastProviderStylingProperties.Position => Position;

    ToastTone IHasRzToastProviderStylingProperties.Tone => Tone;

    ToastAnimation IHasRzToastProviderStylingProperties.Animation => Animation;

    ToastState IHasRzToastProviderStylingProperties.State => ToastState.Visible;

    /// <summary>Gets the resolved provider region label.</summary>
    protected string ResolvedRegionAriaLabel => ResolveLocalizedString(RegionAriaLabel, "RzToastProvider.RegionAriaLabel", "Notifications");

    private string ResolvedCloseButtonAriaLabel => ResolveLocalizedString(CloseButtonAriaLabel, "RzToastProvider.CloseButtonAriaLabel", "Dismiss notification");

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (string.IsNullOrEmpty(Element))
        {
            Element = "div";
        }
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        var options = CreateOptions();
        _classMap = RzToastClassMapBuilder.Build(Theme, Tv, options);
        var config = new RzToastProviderConfig
        {
            Version = _classMap.Version,
            ProviderId = Id,
            Defaults = _classMap.Defaults with
            {
                CloseButtonAriaLabel = ResolvedCloseButtonAriaLabel,
                RegionAriaLabel = ResolvedRegionAriaLabel
            },
            Slots = _classMap.Slots,
            Statuses = _classMap.Statuses,
            Positions = _classMap.Positions,
            Tones = _classMap.Tones,
            Animations = _classMap.Animations,
            States = _classMap.States,
            Icons = _classMap.Icons,
            Aliases = _classMap.Aliases
        };

        _serializedConfig = JsonSerializer.Serialize(config, SerializerOptions);
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<RzToastProviderSlots>, RzToastProviderSlots> GetDescriptor() => Theme.RzToastProvider;

    /// <summary>Converts a position to its canonical JSON and data-attribute value.</summary>
    protected static string ToCanonicalPosition(ToastPosition position) => RzToastClassMapBuilder.ToCanonicalPosition(position);

    /// <summary>Gets the viewport classes for a canonical position.</summary>
    protected string GetViewportClass(ToastPosition position) => _classMap.Positions.TryGetValue(ToCanonicalPosition(position), out var classes)
        ? classes.Viewport
        : SlotClasses.GetViewport() ?? string.Empty;

    /// <summary>Gets the stack classes for a canonical position.</summary>
    protected string GetStackClass(ToastPosition position) => _classMap.Positions.TryGetValue(ToCanonicalPosition(position), out var classes)
        ? classes.Stack
        : SlotClasses.GetStack() ?? string.Empty;

    private RzToastProviderOptions CreateOptions() => new()
    {
        Position = Position,
        DefaultStatus = DefaultStatus,
        Tone = Tone,
        Animation = Animation,
        OverflowStrategy = OverflowStrategy,
        Duration = Duration,
        Speed = Speed,
        MaxVisible = MaxVisible,
        NewestOnTop = NewestOnTop,
        Dismissible = Dismissible,
        ShowIcon = ShowIcon,
        ShowProgress = ShowProgress,
        PauseOnHover = PauseOnHover,
        PauseOnFocus = PauseOnFocus,
        PauseOnWindowBlur = PauseOnWindowBlur,
        CloseOnEscape = CloseOnEscape,
        PreventDuplicates = PreventDuplicates
    };

    private string ResolveLocalizedString(string? explicitValue, string key, string fallback)
    {
        if (!string.IsNullOrWhiteSpace(explicitValue))
        {
            return explicitValue;
        }

        LocalizedString localized = Localizer[key];
        return localized.ResourceNotFound || string.Equals(localized.Value, key, StringComparison.Ordinal) ? fallback : localized.Value;
    }

    private sealed record RzToastProviderConfig
    {
        public int Version { get; init; } = 1;

        public string ProviderId { get; init; } = string.Empty;

        public RzToastDefaults Defaults { get; init; } = new();

        public RzToastSlotClassMap Slots { get; init; } = new();

        public IReadOnlyDictionary<string, RzToastSlotClassMap> Statuses { get; init; } = new Dictionary<string, RzToastSlotClassMap>();

        public IReadOnlyDictionary<string, RzToastSlotClassMap> Positions { get; init; } = new Dictionary<string, RzToastSlotClassMap>();

        public IReadOnlyDictionary<string, RzToastSlotClassMap> Tones { get; init; } = new Dictionary<string, RzToastSlotClassMap>();

        public IReadOnlyDictionary<string, RzToastSlotClassMap> Animations { get; init; } = new Dictionary<string, RzToastSlotClassMap>();

        public IReadOnlyDictionary<string, RzToastSlotClassMap> States { get; init; } = new Dictionary<string, RzToastSlotClassMap>();

        public IReadOnlyDictionary<string, string> Icons { get; init; } = new Dictionary<string, string>();

        public RzToastAliasMap Aliases { get; init; } = new();
    }
}
