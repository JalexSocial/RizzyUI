using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents a Progress bar component.
/// </summary>
public partial class Progress : RizzyComponent
{
    /// <summary>
    /// Base Tailwind CSS classes for the Progress component's root element.
    /// </summary>
    private static readonly string BaseStyle = "w-full";

    /// <summary>
    /// Initialize nonce values
    /// </summary>
    protected override void OnParametersSet()
    {
        Nonce = RizzyNonceProvider.GetNonceValues();
    }

    /// <summary>
    /// Gets or sets the current value of the progress bar.
    /// </summary>
    [Parameter]
    public int CurrentValue { get; set; } = 0;

    /// <summary>
    /// Gets or sets the minimum value of the progress bar.
    /// </summary>
    [Parameter]
    public int MinValue { get; set; } = 0;

    /// <summary>
    /// Gets or sets the maximum value of the progress bar.
    /// </summary>
    [Parameter]
    public int MaxValue { get; set; } = 100;

    /// <summary>
    /// Gets or sets the label text for the progress bar.
    /// </summary>
    [Parameter]
    public string? Label { get; set; }

    /// <summary>
    /// Gets or sets the position of the label relative to the progress bar.
    /// </summary>
    [Parameter]
    public ProgressLabelPosition LabelPosition { get; set; } = ProgressLabelPosition.Outside;

    /// <summary>
    /// Gets or sets the variant color of the progress bar.
    /// </summary>
    [Parameter]
    public StatusColor Variant { get; set; } = StatusColor.Primary;

    /// <summary>
    /// Gets or sets the aria-label for accessibility.
    /// </summary>
    [Parameter]
    public string AriaLabel { get; set; } = "Progress Bar";

    /// <summary>
    /// Calculates the percentage based on CurrentValue, MinValue, and MaxValue.
    /// </summary>
    private double Percentage
    {
        get
        {
            if (MaxValue == MinValue)
                return 0;

            return Math.Clamp(((double)(CurrentValue - MinValue) / (MaxValue - MinValue)) * 100, 0, 100);
        }
    }

    /// <summary>
    /// Gets the Tailwind CSS classes for the progress bar's inner div based on the variant.
    /// </summary>
    private string ProgressBarClass => Variant switch
    {
        StatusColor.Primary => "h-full rounded bg-primary dark:bg-primaryDark text-onPrimary dark:text-onPrimaryDark",
        StatusColor.Secondary => "h-full rounded bg-secondary dark:bg-secondaryDark text-onSecondary dark:text-onSecondaryDark",
        StatusColor.Success => "h-full rounded bg-success dark:bg-success text-onSuccess dark:text-onSuccessDark",
        StatusColor.Info => "h-full rounded bg-info dark:bg-info text-onInfo dark:text-onInfoDark",
        StatusColor.Warning => "h-full rounded bg-warning dark:bg-warning text-onWarning dark:text-onWarningDark",
        StatusColor.Danger => "h-full rounded bg-danger dark:bg-danger text-onDanger dark:text-onDangerDark",
        _ => throw new ArgumentOutOfRangeException()
    };

    /// <summary>
    /// Overrides the RootClass method to merge Tailwind classes for the root element.
    /// </summary>
    /// <returns>A string containing the merged Tailwind CSS classes.</returns>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, BaseStyle);
    }
}
