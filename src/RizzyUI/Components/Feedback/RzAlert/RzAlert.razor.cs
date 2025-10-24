
using Blazicons;
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents an alert component that displays a message with optional icon, variant, and dismiss functionality.
///     Styling is handled by the active theme. Content within the alert is implicitly announced by assistive technologies
///     due to the `role="alert"` attribute on the container.
/// </xmldoc>
public partial class RzAlert : RzComponent<RzAlert.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzAlert component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "not-prose relative w-full overflow-hidden rounded-lg border text-sm bg-card text-card-foreground",
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
            [b => ((RzAlert)b).Variant] = new Variant<AlertVariant, Slots>
            {
                [AlertVariant.Alternate] = new() { [s => s.Base] = "border-outline" },
                [AlertVariant.Information] = new() { [s => s.Base] = "border-info bg-info/10 text-info-foreground dark:bg-info/15", [s => s.IconContainer] = "text-info", [s => s.IconPulse] = "bg-info/15" },
                [AlertVariant.Success] = new() { [s => s.Base] = "border-success bg-success/10 text-success-foreground dark:bg-success/15", [s => s.IconContainer] = "text-success", [s => s.IconPulse] = "bg-success/15" },
                [AlertVariant.Warning] = new() { [s => s.Base] = "border-warning bg-warning/10 text-warning-foreground dark:bg-warning/15", [s => s.IconContainer] = "text-warning", [s => s.IconPulse] = "bg-warning/15" },
                [AlertVariant.Destructive] = new() { [s => s.Base] = "border-destructive bg-destructive/10 text-destructive dark:bg-destructive/15", [s => s.IconContainer] = "text-destructive", [s => s.IconPulse] = "bg-destructive/15" }
            }
        }
    );

    /// <summary> Gets or sets the variant of the alert. </summary>
    [Parameter]
    public AlertVariant Variant { get; set; } = AlertVariant.Information;

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
                AlertVariant.Information => MdiIcon.InformationSlabCircle,
                AlertVariant.Success => MdiIcon.CheckCircle,
                AlertVariant.Warning => MdiIcon.AlertCircle,
                AlertVariant.Destructive => MdiIcon.CloseCircle,
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
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the inner container that holds the icon and content.
        /// </summary>
        public string? InnerContainer { get; set; }
        /// <summary>
        /// The slot for the icon container.
        /// </summary>
        public string? IconContainer { get; set; }
        /// <summary>
        /// The slot for the pulsing animation element behind the icon.
        /// </summary>
        public string? IconPulse { get; set; }
        /// <summary>
        /// The slot for the main content container (title and description).
        /// </summary>
        public string? ContentContainer { get; set; }
        /// <summary>
        /// The slot for the close button.
        /// </summary>
        public string? CloseButton { get; set; }
        /// <summary>
        /// The slot for the icon inside the close button.
        /// </summary>
        public string? CloseButtonIcon { get; set; }
    }
}