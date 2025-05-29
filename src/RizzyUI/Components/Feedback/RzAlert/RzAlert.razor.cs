
using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents an alert component that displays a message with optional icon, variant, and dismiss functionality.
///     Styling is handled by the active theme. Content within the alert is implicitly announced by assistive technologies
///     due to the `role="alert"` attribute on the container.
/// </xmldoc>
public partial class RzAlert : RzComponent
{
    private string _bgLight = string.Empty;
    private string _bgLighter = string.Empty;
    private string _iconColor = string.Empty;

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

    /// <summary> Gets or sets whether to display a pulsing animation behind the icon for emphasis. Requires `Pulse` to be true in the theme. </summary>
    [Parameter]
    public bool Pulse { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();
        SetVariantStyles(); // Set styles after Theme is confirmed
        SetDefaultIcon(); // Set default icon after variant styles are known
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        // Re-apply styles if parameters change AFTER initialization
        if (Theme != null) // Ensure theme is available
        {
            SetVariantStyles();
            SetDefaultIcon(); // Re-evaluate default icon if variant changed and Icon is null
        }
        base.OnParametersSet();
    }

    private void SetVariantStyles()
    {
        var styles = Theme.RzAlert;
        _bgLight = styles.GetVariantBackgroundLightCss(Variant);
        _bgLighter = styles.GetVariantBackgroundLighterCss(Variant);
        _iconColor = styles.GetVariantIconColorCss(Variant);
    }

    private void SetDefaultIcon()
    {
        if (Icon == null) // Only set if user hasn't provided one
            Icon = Variant switch
            {
                AlertVariant.Information => MdiIcon.InformationSlabCircle,
                AlertVariant.Success => MdiIcon.CheckCircle,
                AlertVariant.Warning => MdiIcon.AlertCircle,
                AlertVariant.Danger => MdiIcon.CloseCircle,
                AlertVariant.Alternate => null, // No default for alternate
                _ => MdiIcon.InformationSlabCircle
            };
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzAlert.Container);
    }
}