using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// A badge component for displaying labels with various styles and colors.
/// </summary>
public partial class Badge : RizzyComponent
{
    /// <summary>
    /// The base CSS classes for the Badge component.
    /// </summary>
    private static readonly string BaseStyle = "w-fit inline-flex overflow-hidden rounded-2xl border text-xs font-medium";

    /// <summary>
    /// The semantic color of the badge.
    /// </summary>
    [Parameter]
    public SemanticColor Color { get; set; } = SemanticColor.SurfaceAlt;

    /// <summary>
    /// When set to true, applies a softer styling to the badge.
    /// </summary>
    [Parameter]
    public bool Soft { get; set; } = false;

    /// <summary>
    /// Icon for badge
    /// </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <summary>
    /// Text for badge
    /// </summary>
    [Parameter]
    public string Label { get; set; } = string.Empty;

    /// <summary>
    /// Child content for the badge, allowing for text and additional elements.  If present, overrides use of
    /// Text and Icon
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Overrides the RootClass method to provide CSS classes for the root element.
    /// </summary>
    /// <returns>A string containing the CSS classes for the root span.</returns>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, BaseStyle,
            Soft ? GetSoftBadgeColorCss() : GetBadgeColorCss());
    }

    /// <summary>
    /// Maps the SemanticColor to the corresponding Tailwind CSS classes.
    /// Handles both base colors and their "On" variants.
    /// </summary>
    /// <returns>A string containing the Tailwind CSS classes for the badge color.</returns>
    private string GetBadgeColorCss()
    {
        return Color switch
        {
            // Surface and its variants
            SemanticColor.Surface or SemanticColor.OnSurface or SemanticColor.OnSurfaceStrong =>
                "border-outline bg-surface text-on-surface   ",

            SemanticColor.SurfaceAlt =>
                "border-on-surface bg-surface-alt text-on-surface   ",

            // Primary and its variants
            SemanticColor.Primary or SemanticColor.OnPrimary =>
                "border-primary bg-primary text-on-primary   ",

            // Secondary and its variants
            SemanticColor.Secondary or SemanticColor.OnSecondary =>
                "border-secondary bg-secondary text-on-secondary   ",

            // Info and its variants
            SemanticColor.Info or SemanticColor.OnInfo =>
                "border-info bg-info text-onInfo dark:border-info dark:bg-info dark:text-onInfo",

            // Success and its variants
            SemanticColor.Success or SemanticColor.OnSuccess =>
                "border-success bg-success text-on-success dark:border-success dark:bg-success dark:text-on-success",

            // Warning and its variants
            SemanticColor.Warning or SemanticColor.OnWarning =>
                "border-warning bg-warning text-on-warning dark:border-warning dark:bg-warning dark:text-on-warning",

            // Danger and its variants
            SemanticColor.Danger or SemanticColor.OnDanger =>
                "border-danger bg-danger text-on-danger dark:border-danger dark:bg-danger dark:text-on-danger",

            // Outline and its variants
            SemanticColor.Outline or SemanticColor.OutlineStrong =>
                "border-outline bg-transparent text-outline  ",

            // Default / None
            SemanticColor.None =>
                "",

            _ => throw new ArgumentOutOfRangeException(nameof(Color), Color, null)
        };
    }

    /// <summary>
    /// Provides the outer classes when Soft styling is enabled.
    /// </summary>
    /// <returns>A string containing the Tailwind CSS classes for soft outer styling.</returns>
    private string GetSoftBadgeColorCss()
    {
        return Color switch
        {
            // Surface and its variants
            SemanticColor.Surface or SemanticColor.OnSurface or SemanticColor.OnSurfaceStrong =>
                "border-outline bg-surface  text-on-surface  ",

            SemanticColor.SurfaceAlt =>
                "border-on-surface bg-surface-alt  text-on-surface  ",

            // Primary and its variants
            SemanticColor.Primary or SemanticColor.OnPrimary =>
                "border-primary bg-primary/10  text-primary  ",

            // Secondary and its variants
            SemanticColor.Secondary or SemanticColor.OnSecondary =>
                "border-secondary bg-secondary/10  text-secondary  ",

            // Info and its variants
            SemanticColor.Info or SemanticColor.OnInfo =>
                "border-info bg-info/10 dark:bg-info/10 text-info dark:border-info dark:text-onInfo",

            // Success and its variants
            SemanticColor.Success or SemanticColor.OnSuccess =>
                "border-success bg-success/10 dark:bg-success/10 text-success dark:border-success dark:text-on-success",

            // Warning and its variants
            SemanticColor.Warning or SemanticColor.OnWarning =>
                "border-warning bg-warning/10 dark:bg-warning/10 text-warning dark:border-warning dark:text-on-warning",

            // Danger and its variants
            SemanticColor.Danger or SemanticColor.OnDanger =>
                "border-danger bg-danger/10 dark:bg-danger/10 text-danger dark:border-danger dark:text-on-danger",

            // Outline and its variants
            SemanticColor.Outline or SemanticColor.OutlineStrong =>
                "border-outline bg-outline/10  text-on-surface  ",

            // Default / None
            SemanticColor.None =>
                "",

            _ => throw new ArgumentOutOfRangeException(nameof(Color), Color, null)
        };
    }

}

