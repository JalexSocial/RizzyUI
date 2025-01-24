using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents an alert component that displays a message with optional icon, variant,
/// and dismiss functionality.
/// </summary>
public partial class Alert : RizzyComponent
{
    /// <summary>
    /// Base CSS classes applied to the alert container.
    /// </summary>
    private static readonly string BaseStyle = "relative w-full overflow-hidden rounded-theme border";

    private string _bgLight = "bg-info/10";
    private string _bgLighter = "bg-info/15";
    private string _iconColor = "text-info";

    /// <summary>
    /// Gets or sets the variant of the alert, which determines its visual appearance.
    /// </summary>
    [Parameter]
    public AlertVariant Variant { get; set; } = AlertVariant.Information;

    /// <summary>
    /// Gets or sets the icon displayed in the alert. Defaults to a context-appropriate icon based on the <see cref="Variant"/>.
    /// </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the alert can be dismissed by the user.
    /// </summary>
    [Parameter]
    public bool Dismissable { get; set; } = false;

    /// <summary>
    /// Gets or sets the content to be displayed inside the alert.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets whether to display a pulse behind the icon
    /// </summary>
    [Parameter]
    public bool Pulse { get; set; } = false;

    /// <summary>
    /// Sets the internal state of the alert component when parameters change.
    /// </summary>
    protected override void OnParametersSet()
    {
        switch (Variant)
        {
            case AlertVariant.Alternate:
                _bgLight = "bg-surface-alt/10";
                _bgLighter = "bg-surface-alt/15";
                _iconColor = "text-on-surface";
                break;
            case AlertVariant.Information:
                Icon ??= MdiIcon.InformationSlabCircle;
                _bgLight = "bg-info/10";
                _bgLighter = "bg-info/15";
                _iconColor = "text-info";
                break;
            case AlertVariant.Success:
                Icon ??= MdiIcon.CheckCircle;
                _bgLight = "bg-success/10";
                _bgLighter = "bg-success/15";
                _iconColor = "text-success";
                break;
            case AlertVariant.Warning:
                Icon ??= MdiIcon.AlertCircle;
                _bgLight = "bg-warning/10";
                _bgLighter = "bg-warning/15";
                _iconColor = "text-warning";
                break;
            case AlertVariant.Danger:
                Icon ??= MdiIcon.CloseCircle;
                _bgLight = "bg-danger/10";
                _bgLighter = "bg-danger/15";
                _iconColor = "text-danger";
                break;
        }

        base.OnParametersSet();
    }

    /// <summary>
    /// Generates the root CSS class for the alert component, merging the base style with variant-specific styles.
    /// </summary>
    /// <returns>A string representing the combined CSS class for the alert.</returns>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, BaseStyle, GetAlertVariantCss(Variant));
    }

    /// <summary>
    /// Gets the CSS classes associated with the specified alert variant.
    /// </summary>
    /// <param name="variant">The <see cref="AlertVariant"/> enum value representing the type of alert.</param>
    /// <returns>A string containing the CSS classes for the specified alert variant.</returns>
    /// <exception cref="ArgumentOutOfRangeException">
    /// Thrown when an invalid <see cref="AlertVariant"/> value is provided.
    /// </exception>
    protected static string GetAlertVariantCss(AlertVariant variant)
    {
        return variant switch
        {
            AlertVariant.Alternate => "border-outline bg-surface-alt text-on-surface dark:bg-surface-dark-alt dark:text-on-surface-dark",
            AlertVariant.Information => "border-info bg-surface text-on-surface dark:bg-surface-dark dark:text-on-surface-dark",
            AlertVariant.Success => "border-success bg-surface text-on-surface dark:bg-surface-dark dark:text-on-surface-dark",
            AlertVariant.Warning => "border-warning bg-surface text-on-surface dark:bg-surface-dark dark:text-on-surface-dark",
            AlertVariant.Danger => "border-danger bg-surface text-on-surface dark:bg-surface-dark dark:text-on-surface-dark",
            _ => throw new ArgumentOutOfRangeException(nameof(variant), variant, null)
        };
    }
}
