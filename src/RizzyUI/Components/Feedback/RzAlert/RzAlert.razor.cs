
using Blazicons;
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
///     Represents an alert component that displays a message with optional icon, variant, and dismiss functionality.
///     Styling is handled by the active theme. Content within the alert is implicitly announced by assistive technologies
///     due to the `role="alert"` attribute on the container.
/// </summary>
public partial class RzAlert : RzComponent<RzAlert.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzAlert component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "not-prose relative w-full overflow-hidden rounded-lg border text-sm",
        slots: new()
        {
            [s => s.InnerContainer] = "flex w-full items-start gap-x-3 px-4 py-3",
            [s => s.IconContainer] = "relative flex size-6 shrink-0 text-2xl translate-y-0.5",
            [s => s.IconPulse] = "absolute animate-ping motion-reduce:animate-none size-6 aspect-square rounded-full",
            [s => s.ContentContainer] = "flex flex-col flex-1 gap-y-0.5 translate-y-0.5",
            [s => s.CloseButton] = "ml-auto self-start p-1 rounded-full opacity-70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring dark:focus-visible:ring-offset-background transition-opacity text-foreground",
            [s => s.CloseButtonIcon] = "size-4 shrink-0"
        },
        variants: new()
        {
            [b => ((RzAlert)b).Variant] = new Variant<ThemeVariant, Slots>
            {
                // Default
                [ThemeVariant.Default] = new() { [s => s.Base] = "bg-input text-foreground border-input", [s => s.IconContainer] = "text-foreground", [s => s.IconPulse] = "bg-foreground/15", [s => s.CloseButton] = "text-foreground/70 hover:text-foreground" },
                
                // Inverse
                [ThemeVariant.Inverse] = new() { [s => s.Base] = "bg-foreground text-background border-foreground", [s => s.IconContainer] = "text-background", [s => s.IconPulse] = "bg-background/15", [s => s.CloseButton] = "text-background hover:opacity-100 opacity-90" },
                
                // Standard Variants
                [ThemeVariant.Primary] = new() { [s => s.Base] = "border-primary/50 bg-primary/10 text-primary", [s => s.IconContainer] = "text-primary", [s => s.IconPulse] = "bg-primary/15" },
                [ThemeVariant.Secondary] = new() { [s => s.Base] = "border-secondary/50 bg-secondary/10 text-secondary-foreground", [s => s.IconContainer] = "text-secondary-foreground", [s => s.IconPulse] = "bg-secondary/15" },
                [ThemeVariant.Accent] = new() { [s => s.Base] = "border-accent/50 bg-accent/10 text-accent-foreground", [s => s.IconContainer] = "text-accent-foreground", [s => s.IconPulse] = "bg-accent/15" },
                [ThemeVariant.Information] = new() { [s => s.Base] = "border-info bg-info/10 text-info-foreground dark:bg-info/15", [s => s.IconContainer] = "text-info", [s => s.IconPulse] = "bg-info/15" },
                [ThemeVariant.Success] = new() { [s => s.Base] = "border-success bg-success/10 text-success-foreground dark:bg-success/15", [s => s.IconContainer] = "text-success", [s => s.IconPulse] = "bg-success/15" },
                [ThemeVariant.Warning] = new() { [s => s.Base] = "border-warning bg-warning/10 text-warning-foreground dark:bg-warning/15", [s => s.IconContainer] = "text-warning", [s => s.IconPulse] = "bg-warning/15" },
                [ThemeVariant.Destructive] = new() { [s => s.Base] = "border-destructive bg-destructive/10 text-destructive dark:bg-destructive/15", [s => s.IconContainer] = "text-destructive", [s => s.IconPulse] = "bg-destructive/15" },
                
                // Ghost
                [ThemeVariant.Ghost] = new() { [s => s.Base] = "border-transparent bg-transparent text-foreground", [s => s.IconContainer] = "text-foreground", [s => s.IconPulse] = "bg-muted/50" }
            }
        }
    );

    /// <summary> Gets or sets the variant of the alert. Defaults to <see cref="ThemeVariant.Default"/>. </summary>
    [Parameter]
    public ThemeVariant Variant { get; set; } = ThemeVariant.Default;

    /// <summary> Gets or sets the icon displayed in the alert. If null, a default icon based on the variant may be shown. </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <summary> Gets or sets a value indicating whether the alert can be dismissed via a close button. </summary>
    [Parameter]
    public bool Dismissable { get; set; }

    /// <summary> Gets or sets the content to be displayed inside the alert, typically including <see cref="AlertTitle"/> and <see cref="AlertDescription"/>. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary> Gets or sets whether to display a pulsing animation behind the icon for emphasis. </summary>
    [Parameter]
    public bool Pulse { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        SetDefaultIcon();
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        SetDefaultIcon();
    }

    private void SetDefaultIcon()
    {
        if (Icon == null)
            Icon = Variant switch
            {
                ThemeVariant.Information => MdiIcon.InformationSlabCircle,
                ThemeVariant.Success => MdiIcon.CheckCircle,
                ThemeVariant.Warning => MdiIcon.AlertCircle,
                ThemeVariant.Destructive => MdiIcon.CloseCircle,
                // Default icons for other variants if desired
                ThemeVariant.Default => MdiIcon.InformationSlabCircle,
                ThemeVariant.Inverse => MdiIcon.InformationSlabCircle,
                ThemeVariant.Primary => MdiIcon.InformationSlabCircle,
                ThemeVariant.Secondary => MdiIcon.InformationSlabCircle,
                ThemeVariant.Accent => MdiIcon.InformationSlabCircle,
                ThemeVariant.Ghost => null,
                _ => null
            };
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzAlert;

    /// <summary>
    /// Defines the slots available for styling in the RzAlert component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("alert")]
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the inner container that holds the icon and content.
        /// </summary>
        [Slot("alert-inner-container")]
        public string? InnerContainer { get; set; }
        /// <summary>
        /// The slot for the icon container.
        /// </summary>
        [Slot("alert-icon-container")]
        public string? IconContainer { get; set; }
        /// <summary>
        /// The slot for the pulsing animation element behind the icon.
        /// </summary>
        [Slot("alert-icon-pulse")]
        public string? IconPulse { get; set; }
        /// <summary>
        /// The slot for the main content container (title and description).
        /// </summary>
        [Slot("alert-content-container")]
        public string? ContentContainer { get; set; }
        /// <summary>
        /// The slot for the close button.
        /// </summary>
        [Slot("alert-close-button")]
        public string? CloseButton { get; set; }
        /// <summary>
        /// The slot for the icon inside the close button.
        /// </summary>
        [Slot("alert-close-button-icon")]
        public string? CloseButtonIcon { get; set; }
    }
}