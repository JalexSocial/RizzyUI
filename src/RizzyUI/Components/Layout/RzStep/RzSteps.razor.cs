using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     A component that displays a sequence of steps, visually indicating progress through a process.
///     Child <see cref="RzStep" /> components automatically register their data.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzSteps : RzComponent<RzSteps.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzSteps component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex",
        slots: new()
        {
            [s => s.StepItem] = "relative flex items-center text-sm",
            [s => s.StepContentContainer] = "flex items-center gap-2",
            [s => s.CircleCompleted] = "flex size-6 items-center justify-center rounded-full border",
            [s => s.CircleCompletedIcon] = "size-4",
            [s => s.CircleCompletedSrText] = "sr-only",
            [s => s.CircleDefault] = "flex size-6 shrink-0 items-center justify-center rounded-full border",
            [s => s.CircleDefaultIcon] = "size-4",
            [s => s.Label] = "hidden w-max whitespace-nowrap sm:inline",
            [s => s.Caption] = "text-xs text-muted-foreground mt-1"
        },
        variants: new()
        {
            [s => ((RzSteps)s).Orientation] = new Variant<Orientation, Slots>
            {
                [Orientation.Horizontal] = new() { [s => s.Base] = "w-full items-start gap-2" },
                [Orientation.Vertical] = new() { [s => s.Base] = "w-min flex-col" }
            }
        }
    );

    /// <summary>
    /// Gets or sets the list of step data to display.
    /// </summary>
    [Parameter]
    public List<StepData> Items { get; set; } = new();

    /// <summary> Gets or sets the orientation (Horizontal or Vertical). Defaults to Horizontal. </summary>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Horizontal;

    /// <summary> Gets or sets a value indicating whether step labels are shown. Defaults to true. </summary>
    [Parameter]
    public bool ShowLabels { get; set; } = true;

    /// <summary> Gets or sets the ARIA label for the steps container. Defaults to localized "Steps progress indicator". </summary>
    [Parameter]
    public string? AriaLabel { get; set; }

    /// <summary> Gets or sets the active color used for completed and current steps. Defaults to Primary. </summary>
    [Parameter]
    public StatusColor ActiveColor { get; set; } = StatusColor.Primary;

    /// <summary> The child content, expected to be <see cref="RzStep" /> components. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        AriaLabel ??= Localizer["RzSteps.DefaultAriaLabel"];

        if (string.IsNullOrEmpty(Element))
            Element = "ol";
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        AriaLabel ??= Localizer["RzSteps.DefaultAriaLabel"];
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzSteps;

    /// <summary> Registers step data. Called by child <see cref="RzStep" /> components. </summary>
    internal void RegisterStep(StepData data)
    {
        if (!Items.Exists(i => i.Label == data.Label && i.Caption == data.Caption))
        {
            Items.Add(data);
            InvokeAsync(StateHasChanged);
        }
    }

    private string GetStepItemCss(bool isFirst, bool isLast, StepStatus stepStatus)
    {
        var classes = new List<string> { _slots.GetStepItem() ?? "" };

        if (Orientation == Orientation.Vertical)
        {
            classes.Add("flex-1");
            if (!isLast)
            {
                var connectorColorClass = stepStatus == StepStatus.Completed ? GetActiveBackgroundClass(ActiveColor) : "bg-border";
                classes.Add($"after:content-[''] after:absolute after:left-3 after:-bottom-11 after:h-full after:w-0.5 after:{connectorColorClass}");
            }
        }
        else if (!isFirst)
        {
            classes.Add("w-full");
        }

        return string.Join(" ", classes);
    }

    private string GetConnectorCss(StepStatus stepStatus)
    {
        var colorClass = stepStatus == StepStatus.Completed ? GetActiveBackgroundClass(ActiveColor) : "bg-border";
        return $"h-0.5 flex-1 mx-2 {colorClass}";
    }

    private string GetCircleCompletedCss() =>
        $"{_slots.GetCircleCompleted()} {GetActiveBorderClass(ActiveColor)} {GetActiveBackgroundClass(ActiveColor)} {GetActiveTextClass(ActiveColor)}";

    private string GetCircleDefaultCss(StepStatus status)
    {
        var baseClass = _slots.GetCircleDefault();
        return status switch
        {
            StepStatus.Current => $"{baseClass} border {GetActiveBorderClass(ActiveColor)} {GetActiveBackgroundClass(ActiveColor)} font-bold {GetActiveTextClass(ActiveColor)} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 {GetFocusRingClass(ActiveColor)} dark:focus-visible:ring-offset-background",
            _ => $"{baseClass} border border-border bg-muted font-medium text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring dark:focus-visible:ring-offset-background",
        };
    }

    private string GetLabelCss(StepStatus status)
    {
        var baseClass = _slots.GetLabel();
        return status switch
        {
            StepStatus.Completed => $"{baseClass} {GetActiveTextColorClass(ActiveColor)}",
            StepStatus.Current => $"{baseClass} font-bold {GetActiveTextColorClass(ActiveColor)}",
            _ => $"{baseClass} text-muted-foreground",
        };
    }

    private string GetActiveBackgroundClass(StatusColor color) => $"bg-{color.ToString().ToLowerInvariant()}";
    private string GetActiveBorderClass(StatusColor color) => $"border-{color.ToString().ToLowerInvariant()}";
    private string GetActiveTextClass(StatusColor color) => color switch
    {
        StatusColor.Primary => "text-primary-foreground",
        StatusColor.Secondary => "text-secondary-foreground",
        StatusColor.Success => "text-success-foreground",
        StatusColor.Info => "text-info-foreground",
        StatusColor.Warning => "text-warning-foreground",
        StatusColor.Destructive => "text-destructive-foreground",
        _ => "text-primary-foreground"
    };
    private string GetActiveTextColorClass(StatusColor color) => $"text-{color.ToString().ToLowerInvariant()}";
    private string GetFocusRingClass(StatusColor color) => $"focus-visible:ring-{color.ToString().ToLowerInvariant()}";

    /// <summary>
    /// Defines the slots available for styling in the RzSteps component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? StepItem { get; set; }
        public string? StepContentContainer { get; set; }
        public string? CircleCompleted { get; set; }
        public string? CircleCompletedIcon { get; set; }
        public string? CircleCompletedSrText { get; set; }
        public string? CircleDefault { get; set; }
        public string? CircleDefaultIcon { get; set; }
        public string? Label { get; set; }
        public string? Caption { get; set; }
    }
}