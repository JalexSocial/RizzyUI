using Microsoft.AspNetCore.Components;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents a Progress bar component that visually indicates the completion status of a task.
///     Supports labels inside or outside the bar and various status colors.
///     Styling and calculation logic is handled via the active <see cref="RzTheme" /> and Alpine.js.
/// </xmldoc>
public partial class RzProgress : RzComponent
{
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

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the outside label container. </summary>
    protected string OutsideLabelContainerClass => Theme.RzProgress.OutsideLabelContainer;

    /// <summary> Gets the computed CSS classes for the outside label text. </summary>
    protected string OutsideLabelTextClass => Theme.RzProgress.OutsideLabelText;

    /// <summary> Gets the computed CSS classes for the outer bar (track). </summary>
    protected string OuterBarClass => Theme.RzProgress.OuterBar;

    /// <summary> Gets the computed CSS classes for the outer bar's height based on label position. </summary>
    protected string OuterBarHeightClass => Theme.RzProgress.GetOuterBarHeightCss(LabelPosition);

    /// <summary> Gets the computed CSS classes for the inner bar (value), including base and variant styles. </summary>
    protected string InnerBarClass =>
        $"{Theme.RzProgress.InnerBarBase} {Theme.RzProgress.GetInnerBarVariantCss(Variant)}";

    /// <summary> Gets the computed CSS classes for the inside label container. </summary>
    protected string InsideLabelContainerClass => Theme.RzProgress.InsideLabelContainer;

    /// <summary> Gets the computed CSS classes for the inside label text. </summary>
    protected string InsideLabelTextClass => Theme.RzProgress.InsideLabelText;

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzProgress.Container);
    }

    // Note: Percentage calculation logic moved to Alpine.js ('rzProgress' component)
}