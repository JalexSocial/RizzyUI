using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;
using RizzyUI.Styling;
using System.Collections.Generic;

namespace RizzyUI;

// StepStatus enum and StepData record remain the same as in previous response

/// <xmldoc>
/// A component that displays a sequence of steps, visually indicating progress through a process.
/// Child <see cref="RzStep"/> components automatically register their data.
/// Styling is determined by the active <see cref="RzTheme"/>.
/// </xmldoc>
public partial class RzSteps : RzComponent
{
    /// <summary> Get the currently active theme via Cascading Parameter. </summary>
    [CascadingParameter] protected RzTheme? CascadedTheme { get; set; }
    /// <summary> Injected configuration to get the default theme as fallback. </summary>
    [Inject] private IOptions<RizzyUIConfig>? Config { get; set; }
    /// <summary> The effective theme being used (Cascaded or Default). </summary>
    protected RzTheme Theme { get; set; } = default!;

    /// <summary> Gets the list of step data to display. Populated by child <see cref="RzStep"/> components or directly via parameter. </summary>
    [Parameter] public List<StepData> Items { get; set; } = new List<StepData>();
    /// <summary> Gets or sets the orientation (Horizontal or Vertical). Defaults to Horizontal. </summary>
    [Parameter] public Orientation Orientation { get; set; } = Orientation.Horizontal;
    /// <summary> Gets or sets a value indicating whether step labels are shown. Defaults to true. </summary>
    [Parameter] public bool ShowLabels { get; set; } = true;
    /// <summary> Gets or sets the ARIA label for the steps container. Defaults to "steps progress". </summary>
    [Parameter] public string AriaLabel { get; set; } = "steps progress";
    /// <summary> Gets or sets the active color used for completed and current steps. Defaults to Primary. </summary>
    [Parameter] public StatusColor ActiveColor { get; set; } = StatusColor.Primary;
    /// <summary> The child content, expected to be <see cref="RzStep"/> components. </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    // --- Style Properties derived from Theme ---
    protected string StepItemBaseClass => Theme.RzSteps.StepItem;
    protected string StepContentContainerClass => Theme.RzSteps.StepContentContainer;
    protected string CircleCompletedBaseClass => Theme.RzSteps.CircleCompletedBase;
    protected string CircleCompletedIconClass => Theme.RzSteps.CircleCompletedIcon;
    protected string CircleCompletedSrTextClass => Theme.RzSteps.CircleCompletedSrText;
    protected string CircleDefaultBaseClass => Theme.RzSteps.CircleDefaultBase;
    protected string LabelBaseClass => Theme.RzSteps.LabelBase;
    protected string CaptionClass => Theme.RzSteps.Caption;

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();
        Theme = CascadedTheme ?? Config?.Value.DefaultTheme ?? RzTheme.Default;
        if (Theme == null)
            throw new InvalidOperationException($"{GetType()} requires a cascading RzTheme or a default theme configured.");
    }

    /// <inheritdoc/>
    protected override string? RootClass() =>
        TwMerge.Merge(AdditionalAttributes, Theme.RzSteps.Container, Theme.RzSteps.GetOrientationCss(Orientation));

    /// <summary> Registers step data. Called by child <see cref="RzStep"/> components. </summary>
    internal void RegisterStep(StepData data)
    {
        // Avoid adding if already present during potential re-renders
        if (!Items.Exists(i => i.Label == data.Label)) // Simple check based on Label, adjust if needed
        {
             Items.Add(data);
             StateHasChanged(); // Update UI after adding
        }
    }

    // --- Methods to get dynamic CSS classes based on theme and state ---
    protected string GetStepItemCss(bool isFirst) =>
        $"{StepItemBaseClass} {Theme.RzSteps.GetStepItemWidthCss(isFirst)}";

    protected string GetConnectorCss(StepData previousStep) =>
        Theme.RzSteps.GetConnectorCss(Orientation, previousStep.Status, ActiveColor);

    protected string GetCircleCompletedVariantCss() =>
        Theme.RzSteps.GetCircleCompletedCss(ActiveColor);

    protected string GetCircleDefaultVariantCss(StepStatus status) =>
        Theme.RzSteps.GetCircleDefaultCss(status, ActiveColor);

    protected string GetLabelVariantCss(StepStatus status) =>
        Theme.RzSteps.GetLabelStatusCss(status, ActiveColor);

    /// <inheritdoc />
    protected override void OnAfterRender(bool firstRender)
    {
        // Needed if steps are registered dynamically after initial render
        if (firstRender && ChildContent != null)
        {
            // Re-rendering might be necessary if children register late,
            // but often the initial render catches them.
            // Consider if StateHasChanged() is truly needed here.
        }
        base.OnAfterRender(firstRender);
    }
}

