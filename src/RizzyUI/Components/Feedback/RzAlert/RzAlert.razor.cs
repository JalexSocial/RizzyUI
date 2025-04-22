using Blazicons;
using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

// Add this

namespace RizzyUI;

/// <xmldoc>
///     Represents an alert component that displays a message with optional icon, variant, and dismiss functionality.
///     Styling is handled by the active theme.
/// </xmldoc>
public partial class RzAlert : RzComponent
{
    private string _bgLight = string.Empty;
    private string _bgLighter = string.Empty;
    private string _iconColor = string.Empty;

    /// <summary> Gets or sets the variant of the alert. </summary>
    [Parameter]
    public AlertVariant Variant { get; set; } = AlertVariant.Information;

    /// <summary> Gets or sets the icon displayed in the alert. </summary>
    [Parameter]
    public SvgIcon? Icon { get; set; }

    /// <summary> Gets or sets a value indicating whether the alert can be dismissed. </summary>
    [Parameter]
    public bool Dismissable { get; set; }

    /// <summary> Gets or sets the content to be displayed inside the alert. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary> Gets or sets whether to display a pulse behind the icon. </summary>
    [Parameter]
    public bool Pulse { get; set; }

    // --- Properties used by Razor markup ---
    internal string InnerContainerClass => Theme.RzAlert.InnerContainer + " " + _bgLight; // Add bgLight here

    internal string IconContainerClass =>
        Theme.RzAlert.IconContainer + (Pulse ? "" : " " + _bgLighter) + " " + _iconColor;

    internal string IconPulseClass => Pulse ? Theme.RzAlert.IconPulse + " " + _bgLighter : "";
    internal string ContentContainerClass => Theme.RzAlert.ContentContainer;
    internal string CloseButtonClass => Theme.RzAlert.CloseButton;
    internal string CloseButtonIconClass => Theme.RzAlert.CloseButtonIcon;

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
            SetDefaultIcon();
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
        return TwMerge.Merge(AdditionalAttributes, Theme.RzAlert.Container, Theme.RzAlert.GetVariantCss(Variant));
    }
}