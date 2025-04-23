
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     A component that displays a sequence of steps, visually indicating progress through a process.
///     Child <see cref="RzStep" /> components automatically register their data.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzSteps : RzComponent
{
    /// <summary>
    ///     Gets the list of step data to display. Populated by child <see cref="RzStep" /> components or directly via
    ///     parameter.
    /// </summary>
    [Parameter]
    public List<StepData> Items { get; set; } = new();

    /// <summary> Gets or sets the orientation (Horizontal or Vertical). Defaults to Horizontal. </summary>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Horizontal;

    /// <summary> Gets or sets a value indicating whether step labels are shown. Defaults to true. </summary>
    [Parameter]
    public bool ShowLabels { get; set; } = true;

    /// <summary> Gets or sets the ARIA label for the steps container. Defaults to "steps progress". </summary>
    [Parameter]
    public string AriaLabel { get; set; } = "steps progress";

    /// <summary> Gets or sets the active color used for completed and current steps. Defaults to Primary. </summary>
    [Parameter]
    public StatusColor ActiveColor { get; set; } = StatusColor.Primary;

    /// <summary> The child content, expected to be <see cref="RzStep" /> components. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzSteps.Container,
            Theme.RzSteps.GetOrientationCss(Orientation));
    }

    /// <summary> Registers step data. Called by child <see cref="RzStep" /> components. </summary>
    internal void RegisterStep(StepData data)
    {
        // Avoid adding if already present during potential re-renders
        if (!Items.Exists(i => i.Label == data.Label)) // Simple check based on Label, adjust if needed
        {
            Items.Add(data);
            StateHasChanged(); // Update UI after adding
        }
    }

    /// <summary> Gets the combined CSS classes for a step list item, considering if it's the first item. </summary>
    /// <param name="isFirst">Indicates if the item is the first in the list.</param>
    /// <returns>A string of CSS classes.</returns>
    protected string GetStepItemCss(bool isFirst)
    {
        return $"{Theme.RzSteps.StepItem} {Theme.RzSteps.GetStepItemWidthCss(isFirst)}";
    }

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