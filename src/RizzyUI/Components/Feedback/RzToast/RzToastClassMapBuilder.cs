using System.Collections.Concurrent;
using System.Runtime.CompilerServices;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Builds the server-generated class map consumed by the JavaScript toast runtime.
/// </summary>
public static class RzToastClassMapBuilder
{
    private static readonly ConcurrentDictionary<RzToastClassMapCacheKey, RzToastClassMap> Cache = new();

    /// <summary>
    /// Builds or retrieves a cached class map for the supplied theme, descriptor resolver, and provider options.
    /// </summary>
    /// <param name="theme">The effective theme containing the toast descriptor.</param>
    /// <param name="tv">The Tailwind Variants resolver used by RizzyUI components.</param>
    /// <param name="options">The provider defaults that affect class-map generation.</param>
    /// <returns>A class map suitable for JSON serialization.</returns>
    public static RzToastClassMap Build(RzTheme theme, TwVariants tv, RzToastProviderOptions options)
    {
        var key = RzToastClassMapCacheKey.Create(theme, options);
        return Cache.GetOrAdd(key, _ => Create(theme.RzToastProvider, tv, options));
    }

    private static RzToastClassMap Create(TvDescriptor<RzComponent<RzToastProviderSlots>, RzToastProviderSlots> descriptor, TwVariants tv, RzToastProviderOptions options)
    {
        var baseClasses = Resolve(tv, descriptor, options.DefaultStatus, options.Position, options.Tone, options.Animation, ToastState.Visible);

        return new RzToastClassMap
        {
            Version = 1,
            Defaults = RzToastDefaults.FromOptions(options),
            Slots = baseClasses,
            Statuses = Enum.GetValues<ToastStatus>().ToDictionary(ToCanonicalStatus, status => Resolve(tv, descriptor, status, options.Position, options.Tone, options.Animation, ToastState.Visible)),
            Positions = Enum.GetValues<ToastPosition>().ToDictionary(ToCanonicalPosition, position => Resolve(tv, descriptor, options.DefaultStatus, position, options.Tone, options.Animation, ToastState.Visible)),
            Tones = Enum.GetValues<ToastTone>().ToDictionary(ToCanonicalTone, tone => Resolve(tv, descriptor, options.DefaultStatus, options.Position, tone, options.Animation, ToastState.Visible)),
            Animations = Enum.GetValues<ToastAnimation>().ToDictionary(ToCanonicalAnimation, animation => Resolve(tv, descriptor, options.DefaultStatus, options.Position, options.Tone, animation, ToastState.Visible)),
            States = Enum.GetValues<ToastState>().ToDictionary(ToCanonicalState, state => Resolve(tv, descriptor, options.DefaultStatus, options.Position, options.Tone, options.Animation, state)),
            Icons = CreateIcons(),
            Aliases = CreateAliases()
        };
    }

    private static RzToastSlotClassMap Resolve(TwVariants tv, TvDescriptor<RzComponent<RzToastProviderSlots>, RzToastProviderSlots> descriptor, ToastStatus status, ToastPosition position, ToastTone tone, ToastAnimation animation, ToastState state)
    {
        var slots = tv.Invoke(new RzToastProviderStyleState(descriptor)
        {
            Status = status,
            Position = position,
            Tone = tone,
            Animation = animation,
            State = state
        }, descriptor);

        var map = new RzToastSlotClassMap
        {
            Base = slots[s => s.Base] ?? string.Empty,
            Viewport = slots[s => s.Viewport] ?? string.Empty,
            Stack = slots[s => s.Stack] ?? string.Empty,
            Toast = slots[s => s.Toast] ?? string.Empty,
            InnerContainer = slots[s => s.InnerContainer] ?? string.Empty,
            IconContainer = slots[s => s.IconContainer] ?? string.Empty,
            IconPulse = slots[s => s.IconPulse] ?? string.Empty,
            LoadingIndicator = slots[s => s.LoadingIndicator] ?? string.Empty,
            ContentContainer = slots[s => s.ContentContainer] ?? string.Empty,
            Title = slots[s => s.Title] ?? string.Empty,
            Description = slots[s => s.Description] ?? string.Empty,
            ActionContainer = slots[s => s.ActionContainer] ?? string.Empty,
            ActionButton = slots[s => s.ActionButton] ?? string.Empty,
            CloseButton = slots[s => s.CloseButton] ?? string.Empty,
            CloseButtonIcon = slots[s => s.CloseButtonIcon] ?? string.Empty,
            ProgressTrack = slots[s => s.ProgressTrack] ?? string.Empty,
            ProgressIndicator = slots[s => s.ProgressIndicator] ?? string.Empty,
            SrOnly = slots[s => s.SrOnly] ?? string.Empty
        };

        return tone == ToastTone.Solid ? ApplySolidTone(map, status) : map;
    }

    private static RzToastSlotClassMap ApplySolidTone(RzToastSlotClassMap map, ToastStatus status)
    {
        var (toast, icon, pulse, progress) = status switch
        {
            ToastStatus.Info => ("border-info bg-info text-info-foreground", "text-info-foreground", "bg-info-foreground/20", "bg-info-foreground"),
            ToastStatus.Success => ("border-success bg-success text-success-foreground", "text-success-foreground", "bg-success-foreground/20", "bg-success-foreground"),
            ToastStatus.Warning => ("border-warning bg-warning text-warning-foreground", "text-warning-foreground", "bg-warning-foreground/20", "bg-warning-foreground"),
            ToastStatus.Error => ("border-destructive bg-destructive text-destructive-foreground", "text-destructive-foreground", "bg-destructive-foreground/20", "bg-destructive-foreground"),
            ToastStatus.Loading => ("border-info bg-info text-info-foreground", "text-info-foreground", "bg-info-foreground/20", "bg-info-foreground"),
            _ => ("border-primary bg-primary text-primary-foreground", "text-primary-foreground", "bg-primary-foreground/20", "bg-primary-foreground")
        };

        return map with
        {
            Toast = Append(map.Toast, toast),
            IconContainer = Append(map.IconContainer, icon),
            IconPulse = Append(map.IconPulse, pulse),
            LoadingIndicator = Append(map.LoadingIndicator, icon),
            ProgressIndicator = Append(map.ProgressIndicator, progress)
        };
    }

    private static string Append(string current, string next) => string.IsNullOrWhiteSpace(current) ? next : $"{current} {next}";

    private static Dictionary<string, string> CreateIcons() => new(StringComparer.Ordinal)
    {
        ["default"] = "info",
        ["info"] = "info",
        ["success"] = "success",
        ["warning"] = "warning",
        ["error"] = "error",
        ["loading"] = "loading",
        ["close"] = "close"
    };

    private static RzToastAliasMap CreateAliases() => new()
    {
        Positions = new Dictionary<string, string>(StringComparer.Ordinal)
        {
            ["right top"] = "top-right",
            ["top right"] = "top-right",
            ["left top"] = "top-left",
            ["top left"] = "top-left",
            ["right bottom"] = "bottom-right",
            ["bottom right"] = "bottom-right",
            ["left bottom"] = "bottom-left",
            ["bottom left"] = "bottom-left",
            ["top center"] = "top-center",
            ["center top"] = "top-center",
            ["x-center top"] = "top-center",
            ["top x-center"] = "top-center",
            ["bottom center"] = "bottom-center",
            ["center bottom"] = "bottom-center",
            ["x-center bottom"] = "bottom-center",
            ["bottom x-center"] = "bottom-center",
            ["center"] = "center",
            ["left center"] = "left-center",
            ["left y-center"] = "left-center",
            ["y-center left"] = "left-center",
            ["right center"] = "right-center",
            ["right y-center"] = "right-center",
            ["y-center right"] = "right-center"
        },
        Statuses = new Dictionary<string, string>(StringComparer.Ordinal)
        {
            ["destructive"] = "error"
        },
        Types = new Dictionary<string, string>(StringComparer.Ordinal)
        {
            ["filled"] = "solid",
            ["outline"] = "outline"
        },
        Effects = new Dictionary<string, string>(StringComparer.Ordinal)
        {
            ["fade"] = "fade",
            ["slide"] = "slide"
        }
    };

    /// <summary>
    /// Converts a toast status to its canonical JSON value.
    /// </summary>
    public static string ToCanonicalStatus(ToastStatus status) => status switch
    {
        ToastStatus.Default => "default",
        ToastStatus.Info => "info",
        ToastStatus.Success => "success",
        ToastStatus.Warning => "warning",
        ToastStatus.Error => "error",
        ToastStatus.Loading => "loading",
        _ => "info"
    };

    /// <summary>
    /// Converts a toast position to its canonical JSON value.
    /// </summary>
    public static string ToCanonicalPosition(ToastPosition position) => position switch
    {
        ToastPosition.TopLeft => "top-left",
        ToastPosition.TopCenter => "top-center",
        ToastPosition.TopRight => "top-right",
        ToastPosition.BottomLeft => "bottom-left",
        ToastPosition.BottomCenter => "bottom-center",
        ToastPosition.BottomRight => "bottom-right",
        ToastPosition.Center => "center",
        ToastPosition.LeftCenter => "left-center",
        ToastPosition.RightCenter => "right-center",
        _ => "top-right"
    };

    /// <summary>
    /// Converts a toast tone to its canonical JSON value.
    /// </summary>
    public static string ToCanonicalTone(ToastTone tone) => tone switch
    {
        ToastTone.Subtle => "subtle",
        ToastTone.Solid => "solid",
        ToastTone.Outline => "outline",
        ToastTone.Ghost => "ghost",
        _ => "subtle"
    };

    /// <summary>
    /// Converts a toast animation to its canonical JSON value.
    /// </summary>
    public static string ToCanonicalAnimation(ToastAnimation animation) => animation switch
    {
        ToastAnimation.Fade => "fade",
        ToastAnimation.Slide => "slide",
        ToastAnimation.None => "none",
        _ => "fade"
    };

    /// <summary>
    /// Converts a toast state to its canonical JSON value.
    /// </summary>
    public static string ToCanonicalState(ToastState state) => state switch
    {
        ToastState.Entering => "entering",
        ToastState.Visible => "visible",
        ToastState.Leaving => "leaving",
        _ => "visible"
    };

    /// <summary>
    /// Converts an overflow strategy to its canonical JSON value.
    /// </summary>
    public static string ToCanonicalOverflowStrategy(ToastOverflowStrategy strategy) => strategy switch
    {
        ToastOverflowStrategy.DismissOldest => "dismiss-oldest",
        ToastOverflowStrategy.IgnoreNewest => "ignore-newest",
        _ => "dismiss-oldest"
    };

    private sealed record RzToastClassMapCacheKey(
        string ThemeCode,
        int ThemeIdentity,
        int DescriptorIdentity,
        ToastStatus DefaultStatus,
        ToastPosition Position,
        ToastTone Tone,
        ToastAnimation Animation,
        ToastOverflowStrategy OverflowStrategy,
        int Duration,
        int Speed,
        int MaxVisible,
        bool NewestOnTop,
        bool Dismissible,
        bool ShowIcon,
        bool ShowProgress,
        bool PauseOnHover,
        bool PauseOnFocus,
        bool PauseOnWindowBlur,
        bool CloseOnEscape,
        bool PreventDuplicates)
    {
        public static RzToastClassMapCacheKey Create(RzTheme theme, RzToastProviderOptions options) => new(
            theme.ThemeCode,
            RuntimeHelpers.GetHashCode(theme),
            RuntimeHelpers.GetHashCode(theme.RzToastProvider),
            options.DefaultStatus,
            options.Position,
            options.Tone,
            options.Animation,
            options.OverflowStrategy,
            options.Duration,
            options.Speed,
            options.MaxVisible,
            options.NewestOnTop,
            options.Dismissible,
            options.ShowIcon,
            options.ShowProgress,
            options.PauseOnHover,
            options.PauseOnFocus,
            options.PauseOnWindowBlur,
            options.CloseOnEscape,
            options.PreventDuplicates);
    }

    private sealed class RzToastProviderStyleState(TvDescriptor<RzComponent<RzToastProviderSlots>, RzToastProviderSlots> descriptor) : RzComponent<RzToastProviderSlots>, IHasRzToastProviderStylingProperties
    {
        public ToastStatus Status { get; init; }

        public ToastPosition Position { get; init; }

        public ToastTone Tone { get; init; }

        public ToastAnimation Animation { get; init; }

        public ToastState State { get; init; }

        protected override TvDescriptor<RzComponent<RzToastProviderSlots>, RzToastProviderSlots> GetDescriptor() => descriptor;
    }
}

/// <summary>
/// Represents the JSON-serializable toast class map.
/// </summary>
public sealed record RzToastClassMap
{
    /// <summary>Gets the class-map schema version.</summary>
    public int Version { get; init; } = 1;

    /// <summary>Gets the defaults emitted to the runtime.</summary>
    public RzToastDefaults Defaults { get; init; } = new();

    /// <summary>Gets the baseline classes for every slot.</summary>
    public RzToastSlotClassMap Slots { get; init; } = new();

    /// <summary>Gets classes resolved for every status.</summary>
    public IReadOnlyDictionary<string, RzToastSlotClassMap> Statuses { get; init; } = new Dictionary<string, RzToastSlotClassMap>();

    /// <summary>Gets classes resolved for every position.</summary>
    public IReadOnlyDictionary<string, RzToastSlotClassMap> Positions { get; init; } = new Dictionary<string, RzToastSlotClassMap>();

    /// <summary>Gets classes resolved for every tone.</summary>
    public IReadOnlyDictionary<string, RzToastSlotClassMap> Tones { get; init; } = new Dictionary<string, RzToastSlotClassMap>();

    /// <summary>Gets classes resolved for every animation.</summary>
    public IReadOnlyDictionary<string, RzToastSlotClassMap> Animations { get; init; } = new Dictionary<string, RzToastSlotClassMap>();

    /// <summary>Gets classes resolved for every lifecycle state.</summary>
    public IReadOnlyDictionary<string, RzToastSlotClassMap> States { get; init; } = new Dictionary<string, RzToastSlotClassMap>();

    /// <summary>Gets symbolic icon mappings for toast statuses and controls.</summary>
    public IReadOnlyDictionary<string, string> Icons { get; init; } = new Dictionary<string, string>();

    /// <summary>Gets compatibility aliases consumed by the runtime normalizer.</summary>
    public RzToastAliasMap Aliases { get; init; } = new();
}

/// <summary>
/// Represents JSON-serializable default toast options.
/// </summary>
public sealed record RzToastDefaults
{
    /// <summary>Gets the default status.</summary>
    public string Status { get; init; } = "info";

    /// <summary>Gets the default position.</summary>
    public string Position { get; init; } = "top-right";

    /// <summary>Gets the default tone.</summary>
    public string Tone { get; init; } = "subtle";

    /// <summary>Gets the default animation.</summary>
    public string Animation { get; init; } = "fade";

    /// <summary>Gets the auto-dismiss duration in milliseconds.</summary>
    public int Duration { get; init; } = 4000;

    /// <summary>Gets the transition speed in milliseconds.</summary>
    public int Speed { get; init; } = 300;

    /// <summary>Gets whether toasts are dismissible by default.</summary>
    public bool Dismissible { get; init; } = true;

    /// <summary>Gets whether status icons are shown by default.</summary>
    public bool ShowIcon { get; init; } = true;

    /// <summary>Gets whether timers pause on hover.</summary>
    public bool PauseOnHover { get; init; } = true;

    /// <summary>Gets whether timers pause on focus.</summary>
    public bool PauseOnFocus { get; init; } = true;

    /// <summary>Gets whether timers pause when the window blurs.</summary>
    public bool PauseOnWindowBlur { get; init; }

    /// <summary>Gets whether Escape dismisses a focused toast.</summary>
    public bool CloseOnEscape { get; init; } = true;

    /// <summary>Gets whether duplicate notifications are prevented.</summary>
    public bool PreventDuplicates { get; init; }

    /// <summary>Gets whether progress indicators are shown by default.</summary>
    public bool Progress { get; init; } = true;

    /// <summary>Gets the maximum visible toast count per position.</summary>
    public int MaxVisible { get; init; } = 5;

    /// <summary>Gets whether new toasts are inserted above older toasts.</summary>
    public bool NewestOnTop { get; init; } = true;

    /// <summary>Gets the overflow strategy.</summary>
    public string OverflowStrategy { get; init; } = "dismiss-oldest";

    /// <summary>Gets the aria-label for toast close buttons.</summary>
    public string? CloseButtonAriaLabel { get; init; }

    /// <summary>Gets the aria-label for the provider region.</summary>
    public string? RegionAriaLabel { get; init; }

    /// <summary>Creates defaults from provider options.</summary>
    public static RzToastDefaults FromOptions(RzToastProviderOptions options) => new()
    {
        Status = RzToastClassMapBuilder.ToCanonicalStatus(options.DefaultStatus),
        Position = RzToastClassMapBuilder.ToCanonicalPosition(options.Position),
        Tone = RzToastClassMapBuilder.ToCanonicalTone(options.Tone),
        Animation = RzToastClassMapBuilder.ToCanonicalAnimation(options.Animation),
        Duration = options.Duration,
        Speed = options.Speed,
        Dismissible = options.Dismissible,
        ShowIcon = options.ShowIcon,
        PauseOnHover = options.PauseOnHover,
        PauseOnFocus = options.PauseOnFocus,
        PauseOnWindowBlur = options.PauseOnWindowBlur,
        CloseOnEscape = options.CloseOnEscape,
        PreventDuplicates = options.PreventDuplicates,
        Progress = options.ShowProgress,
        MaxVisible = options.MaxVisible,
        NewestOnTop = options.NewestOnTop,
        OverflowStrategy = RzToastClassMapBuilder.ToCanonicalOverflowStrategy(options.OverflowStrategy)
    };
}

/// <summary>
/// Represents the resolved class strings for every toast provider slot.
/// </summary>
public sealed record RzToastSlotClassMap
{
    /// <summary>Gets the root provider classes.</summary>
    public string Base { get; init; } = string.Empty;

    /// <summary>Gets the viewport classes.</summary>
    public string Viewport { get; init; } = string.Empty;

    /// <summary>Gets the stack classes.</summary>
    public string Stack { get; init; } = string.Empty;

    /// <summary>Gets the toast item classes.</summary>
    public string Toast { get; init; } = string.Empty;

    /// <summary>Gets the inner container classes.</summary>
    public string InnerContainer { get; init; } = string.Empty;

    /// <summary>Gets the icon container classes.</summary>
    public string IconContainer { get; init; } = string.Empty;

    /// <summary>Gets the icon pulse classes.</summary>
    public string IconPulse { get; init; } = string.Empty;

    /// <summary>Gets the loading indicator classes.</summary>
    public string LoadingIndicator { get; init; } = string.Empty;

    /// <summary>Gets the content container classes.</summary>
    public string ContentContainer { get; init; } = string.Empty;

    /// <summary>Gets the title classes.</summary>
    public string Title { get; init; } = string.Empty;

    /// <summary>Gets the description classes.</summary>
    public string Description { get; init; } = string.Empty;

    /// <summary>Gets the action container classes.</summary>
    public string ActionContainer { get; init; } = string.Empty;

    /// <summary>Gets the action button classes.</summary>
    public string ActionButton { get; init; } = string.Empty;

    /// <summary>Gets the close button classes.</summary>
    public string CloseButton { get; init; } = string.Empty;

    /// <summary>Gets the close button icon classes.</summary>
    public string CloseButtonIcon { get; init; } = string.Empty;

    /// <summary>Gets the progress track classes.</summary>
    public string ProgressTrack { get; init; } = string.Empty;

    /// <summary>Gets the progress indicator classes.</summary>
    public string ProgressIndicator { get; init; } = string.Empty;

    /// <summary>Gets screen-reader-only utility classes.</summary>
    public string SrOnly { get; init; } = string.Empty;
}

/// <summary>
/// Represents Simple Notify-compatible aliases for the toast runtime normalizer.
/// </summary>
public sealed record RzToastAliasMap
{
    /// <summary>Gets position aliases keyed by legacy Simple Notify values.</summary>
    public IReadOnlyDictionary<string, string> Positions { get; init; } = new Dictionary<string, string>();

    /// <summary>Gets status aliases keyed by legacy values.</summary>
    public IReadOnlyDictionary<string, string> Statuses { get; init; } = new Dictionary<string, string>();

    /// <summary>Gets tone aliases keyed by legacy type values.</summary>
    public IReadOnlyDictionary<string, string> Types { get; init; } = new Dictionary<string, string>();

    /// <summary>Gets animation aliases keyed by legacy effect values.</summary>
    public IReadOnlyDictionary<string, string> Effects { get; init; } = new Dictionary<string, string>();
}
