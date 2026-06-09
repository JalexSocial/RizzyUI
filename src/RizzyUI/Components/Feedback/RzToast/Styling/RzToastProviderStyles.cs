using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Exposes the styling state used by <see cref="RzToastProviderStyles"/>.
/// </summary>
public interface IHasRzToastProviderStylingProperties
{
    /// <summary>Gets the status used to resolve toast item classes.</summary>
    ToastStatus Status { get; }

    /// <summary>Gets the position used to resolve viewport and stack classes.</summary>
    ToastPosition Position { get; }

    /// <summary>Gets the tone used to resolve toast item classes.</summary>
    ToastTone Tone { get; }

    /// <summary>Gets the animation preset used to resolve toast item classes.</summary>
    ToastAnimation Animation { get; }

    /// <summary>Gets the lifecycle state used to resolve toast item classes.</summary>
    ToastState State { get; }
}

/// <summary>
/// Defines the slots available for styling the toast provider and JavaScript-rendered toast items.
/// </summary>
public sealed partial class RzToastProviderSlots : ISlots
{
    /// <summary>The root provider slot.</summary>
    [Slot("toast-provider")]
    public string? Base { get; set; }

    /// <summary>The fixed viewport wrapper for a single canonical position.</summary>
    [Slot("toast-viewport")]
    public string? Viewport { get; set; }

    /// <summary>The stack container for toast items at a canonical position.</summary>
    [Slot("toast-stack")]
    public string? Stack { get; set; }

    /// <summary>The JavaScript-rendered toast item root.</summary>
    [Slot("toast")]
    public string? Toast { get; set; }

    /// <summary>The toast inner content row.</summary>
    [Slot("toast-inner-container")]
    public string? InnerContainer { get; set; }

    /// <summary>The status icon container.</summary>
    [Slot("toast-icon-container")]
    public string? IconContainer { get; set; }

    /// <summary>The optional pulse element rendered behind status icons.</summary>
    [Slot("toast-icon-pulse")]
    public string? IconPulse { get; set; }

    /// <summary>The loading spinner element.</summary>
    [Slot("toast-loading-indicator")]
    public string? LoadingIndicator { get; set; }

    /// <summary>The text content container.</summary>
    [Slot("toast-content-container")]
    public string? ContentContainer { get; set; }

    /// <summary>The toast title slot.</summary>
    [Slot("toast-title")]
    public string? Title { get; set; }

    /// <summary>The toast description slot.</summary>
    [Slot("toast-description")]
    public string? Description { get; set; }

    /// <summary>The toast action button container.</summary>
    [Slot("toast-action-container")]
    public string? ActionContainer { get; set; }

    /// <summary>The toast action button.</summary>
    [Slot("toast-action-button")]
    public string? ActionButton { get; set; }

    /// <summary>The toast close button.</summary>
    [Slot("toast-close-button")]
    public string? CloseButton { get; set; }

    /// <summary>The icon inside the toast close button.</summary>
    [Slot("toast-close-button-icon")]
    public string? CloseButtonIcon { get; set; }

    /// <summary>The toast progress track.</summary>
    [Slot("toast-progress-track")]
    public string? ProgressTrack { get; set; }

    /// <summary>The toast progress indicator.</summary>
    [Slot("toast-progress-indicator")]
    public string? ProgressIndicator { get; set; }

    /// <summary>The screen-reader-only utility slot.</summary>
    [Slot("toast-sr-only")]
    public string? SrOnly { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for <see cref="RzToastProvider"/> and JavaScript-rendered toast items.
/// </summary>
public static class RzToastProviderStyles
{
    /// <summary>
    /// Gets the default Tailwind Variants descriptor for toast providers and toast items.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzToastProviderSlots>, RzToastProviderSlots> DefaultDescriptor = new(
        @base: "pointer-events-none fixed inset-0 z-50",
        slots: new()
        {
            [s => s.Viewport] = "pointer-events-none fixed inset-0 flex max-h-screen w-full p-4 sm:p-6",
            [s => s.Stack] = "flex w-full max-w-sm flex-col gap-3",
            [s => s.Toast] = "not-prose pointer-events-auto relative w-full overflow-hidden rounded-lg border text-sm shadow-lg duration-200 ease-out motion-reduce:transition-none",
            [s => s.InnerContainer] = "flex w-full items-start gap-x-3 px-4 py-3",
            [s => s.IconContainer] = "relative flex size-6 shrink-0 items-center justify-center text-2xl translate-y-0.5",
            [s => s.IconPulse] = "absolute size-6 aspect-square rounded-full animate-ping motion-reduce:animate-none",
            [s => s.LoadingIndicator] = "size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none",
            [s => s.ContentContainer] = "flex min-w-0 flex-1 flex-col gap-y-0.5 translate-y-0.5",
            [s => s.Title] = "font-medium tracking-tight line-clamp-1",
            [s => s.Description] = "text-sm text-foreground/90 [&_p]:leading-relaxed",
            [s => s.ActionContainer] = "mt-3 flex items-center gap-2",
            [s => s.ActionButton] = "inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            [s => s.CloseButton] = "ml-auto self-start rounded-full p-1 text-foreground opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            [s => s.CloseButtonIcon] = "size-4 shrink-0",
            [s => s.ProgressTrack] = "absolute bottom-0 left-0 h-1 w-full bg-transparent",
            [s => s.ProgressIndicator] = "h-full w-full origin-left transition-transform ease-linear motion-reduce:transition-none",
            [s => s.SrOnly] = "sr-only"
        },
        variants: new()
        {
            [c => ((IHasRzToastProviderStylingProperties)c).Status] = new Variant<ToastStatus, RzToastProviderSlots>
            {
                [ToastStatus.Default] = new() { [s => s.Toast] = "!border-accent/50 !bg-[color-mix(in_oklab,var(--background)_90%,var(--accent)_10%)] !text-accent-foreground", [s => s.Title] = "!text-accent-foreground", [s => s.IconContainer] = "!text-accent-foreground", [s => s.IconPulse] = "!bg-accent/15", [s => s.ProgressIndicator] = "!bg-accent-foreground", [s => s.LoadingIndicator] = "!text-accent-foreground" },
                [ToastStatus.Info] = new() { [s => s.Toast] = "border-info bg-[color-mix(in_oklab,var(--background)_90%,var(--info)_10%)] text-info-foreground", [s => s.Title] = "text-info", [s => s.IconContainer] = "text-info", [s => s.IconPulse] = "bg-info/15", [s => s.ProgressIndicator] = "bg-info", [s => s.LoadingIndicator] = "text-info" },
                [ToastStatus.Success] = new() { [s => s.Toast] = "border-success bg-[color-mix(in_oklab,var(--background)_90%,var(--success)_10%)] text-success-foreground", [s => s.Title] = "text-success", [s => s.IconContainer] = "text-success", [s => s.IconPulse] = "bg-success/15", [s => s.ProgressIndicator] = "bg-success", [s => s.LoadingIndicator] = "text-success" },
                [ToastStatus.Warning] = new() { [s => s.Toast] = "border-warning bg-[color-mix(in_oklab,var(--background)_90%,var(--warning)_10%)] text-warning-foreground", [s => s.Title] = "text-warning", [s => s.IconContainer] = "text-warning", [s => s.IconPulse] = "bg-warning/15", [s => s.ProgressIndicator] = "bg-warning", [s => s.LoadingIndicator] = "text-warning" },
                [ToastStatus.Error] = new() { [s => s.Toast] = "!border-destructive !bg-[color-mix(in_oklab,var(--background)_90%,var(--destructive)_10%)] !text-destructive", [s => s.Title] = "!text-destructive", [s => s.IconContainer] = "!text-destructive", [s => s.IconPulse] = "!bg-destructive/15", [s => s.ProgressIndicator] = "!bg-destructive", [s => s.LoadingIndicator] = "!text-destructive" },
                [ToastStatus.Loading] = new() { [s => s.Toast] = "border-info bg-[color-mix(in_oklab,var(--background)_90%,var(--info)_10%)] text-info-foreground", [s => s.Title] = "text-info", [s => s.IconContainer] = "text-info", [s => s.IconPulse] = "bg-info/15", [s => s.ProgressIndicator] = "bg-info", [s => s.LoadingIndicator] = "text-info" }
            },
            [c => ((IHasRzToastProviderStylingProperties)c).Position] = new Variant<ToastPosition, RzToastProviderSlots>
            {
                [ToastPosition.TopLeft] = new() { [s => s.Viewport] = "items-start justify-start", [s => s.Stack] = "items-start" },
                [ToastPosition.TopCenter] = new() { [s => s.Viewport] = "items-start justify-center", [s => s.Stack] = "items-center" },
                [ToastPosition.TopRight] = new() { [s => s.Viewport] = "items-start justify-end", [s => s.Stack] = "items-end" },
                [ToastPosition.BottomLeft] = new() { [s => s.Viewport] = "items-end justify-start", [s => s.Stack] = "items-start" },
                [ToastPosition.BottomCenter] = new() { [s => s.Viewport] = "items-end justify-center", [s => s.Stack] = "items-center" },
                [ToastPosition.BottomRight] = new() { [s => s.Viewport] = "items-end justify-end", [s => s.Stack] = "items-end" },
                [ToastPosition.Center] = new() { [s => s.Viewport] = "items-center justify-center", [s => s.Stack] = "items-center" },
                [ToastPosition.LeftCenter] = new() { [s => s.Viewport] = "items-center justify-start", [s => s.Stack] = "items-start" },
                [ToastPosition.RightCenter] = new() { [s => s.Viewport] = "items-center justify-end", [s => s.Stack] = "items-end" }
            },
            [c => ((IHasRzToastProviderStylingProperties)c).Tone] = new Variant<ToastTone, RzToastProviderSlots>
            {
                [ToastTone.Subtle] = new(),
                [ToastTone.Solid] = new(),
                [ToastTone.Outline] = new() { [s => s.Toast] = "bg-background" },
                [ToastTone.Ghost] = new() { [s => s.Toast] = "border-transparent bg-background/95 shadow-md" }
            },
            [c => ((IHasRzToastProviderStylingProperties)c).Animation] = new Variant<ToastAnimation, RzToastProviderSlots>
            {
                [ToastAnimation.Fade] = new() { [s => s.Toast] = "transition-[opacity,transform]" },
                [ToastAnimation.Slide] = new() { [s => s.Toast] = "transition-[opacity,transform]" },
                [ToastAnimation.None] = new() { [s => s.Toast] = "transition-none" }
            },
            [c => ((IHasRzToastProviderStylingProperties)c).State] = new Variant<ToastState, RzToastProviderSlots>
            {
                [ToastState.Entering] = new() { [s => s.Toast] = "opacity-0 translate-y-2 scale-95" },
                [ToastState.Visible] = new() { [s => s.Toast] = "opacity-100 translate-y-0 scale-100" },
                [ToastState.Leaving] = new() { [s => s.Toast] = "opacity-0 translate-y-2 scale-95" }
            }
        }
    );
}
