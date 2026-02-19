
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
///     Represents a Progress bar component that visually indicates the completion status of a task.
///     Supports labels inside or outside the bar and various status colors.
///     Styling and calculation logic is handled via the active <see cref="RzTheme" /> and Alpine.js.
/// </summary>
public partial class RzProgress : RzComponent<RzProgress.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzProgress component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "w-full",
        slots: new()
        {
            [s => s.OutsideLabelContainer] = "mb-2 flex items-center",
            [s => s.OutsideLabelText] = "text-foreground",
            [s => s.OuterBar] = "relative flex w-full overflow-hidden rounded-full bg-primary/20",
            [s => s.InnerBar] = "p-0.5 text-center text-xs font-semibold leading-none transition-all",
            [s => s.InsideLabelContainer] = "absolute",
            [s => s.InsideLabelText] = null
        },
        variants: new()
        {
            [p => ((RzProgress)p).LabelPosition] = new Variant<ProgressLabelPosition, Slots>
            {
                [ProgressLabelPosition.Inside] = new() { [s => s.OuterBar] = "h-4" },
                [ProgressLabelPosition.Outside] = new() { [s => s.OuterBar] = "h-2.5" }
            },
            [p => ((RzProgress)p).Variant] = new Variant<StatusColor, Slots>
            {
                [StatusColor.Primary] = new() { [s => s.InnerBar] = "h-full rounded-full bg-primary text-primary-foreground" },
                [StatusColor.Secondary] = new() { [s => s.InnerBar] = "h-full rounded-full bg-secondary text-secondary-foreground" },
                [StatusColor.Success] = new() { [s => s.InnerBar] = "h-full rounded-full bg-success dark:bg-success text-success-foreground dark:text-success-foreground" },
                [StatusColor.Info] = new() { [s => s.InnerBar] = "h-full rounded-full bg-info dark:bg-info text-info-foreground dark:text-info-foreground" },
                [StatusColor.Warning] = new() { [s => s.InnerBar] = "h-full rounded-full bg-warning dark:bg-warning text-warning-foreground dark:text-warning-foreground" },
                [StatusColor.Destructive] = new() { [s => s.InnerBar] = "h-full rounded-full bg-destructive dark:bg-destructive text-destructive-foreground dark:text-destructive-foreground" }
            }
        }
    );

    /// <summary> Gets or sets the current value of the progress bar. </summary>
    [Parameter]
    public int CurrentValue { get; set; }

    /// <summary> Gets or sets the minimum value of the progress bar. Defaults to 0. </summary>
    [Parameter]
    public int MinValue { get; set; }

    /// <summary> Gets or sets the maximum value of the progress bar. Defaults to 100. </summary>
    [Parameter]
    public int MaxValue { get; set; } = 100;

    /// <summary> Gets or sets the label text for the progress bar. Supports '{percent}' placeholder. </summary>
    [Parameter]
    public string? Label { get; set; }

    /// <summary> Gets or sets the position of the label (Inside or Outside). Defaults to Outside. </summary>
    [Parameter]
    public ProgressLabelPosition LabelPosition { get; set; } = ProgressLabelPosition.Outside;

    /// <summary> Gets or sets the status color variant of the progress bar. Defaults to Primary. </summary>
    [Parameter]
    public StatusColor Variant { get; set; } = StatusColor.Primary;

    /// <summary> Gets or sets the aria-label for accessibility. Defaults to "Progress Bar". </summary>
    [Parameter]
    public string AriaLabel { get; set; } = "Progress Bar";

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzProgress;

    /// <summary>
    /// Defines the slots available for styling in the RzProgress component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        [Slot("progress")]
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the container of the label when positioned outside.
        /// </summary>
        [Slot("progress-outside-label-container")]
        public string? OutsideLabelContainer { get; set; }
        /// <summary>
        /// The slot for the text of the label when positioned outside.
        /// </summary>
        [Slot("progress-outside-label-text")]
        public string? OutsideLabelText { get; set; }
        /// <summary>
        /// The slot for the outer bar of the progress indicator.
        /// </summary>
        [Slot("progress-outer-bar")]
        public string? OuterBar { get; set; }
        /// <summary>
        /// The slot for the inner bar that represents the progress.
        /// </summary>
        [Slot("progress-inner-bar")]
        public string? InnerBar { get; set; }
        /// <summary>
        /// The slot for the container of the label when positioned inside.
        /// </summary>
        [Slot("progress-inside-label-container")]
        public string? InsideLabelContainer { get; set; }
        /// <summary>
        /// The slot for the text of the label when positioned inside.
        /// </summary>
        [Slot("progress-inside-label-text")]
        public string? InsideLabelText { get; set; }
    }
}