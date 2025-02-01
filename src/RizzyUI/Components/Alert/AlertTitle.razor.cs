using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents the title section for an alert.
/// </summary>
public partial class AlertTitle : RizzyComponent
{
    /// <summary>
    /// The base CSS style for the alert title.
    /// </summary>
    private static readonly string BaseStyle = "text-sm font-semibold";

    /// <summary>
    /// Holds the CSS class for text color based on the alert variant.
    /// </summary>
    private string _textCss = "text-info";

    /// <summary>
    /// Gets or sets the parent alert component.
    /// </summary>
    [CascadingParameter]
    public Alert? AlertParent { get; set; }

    /// <summary>
    /// Gets or sets the child content for the alert title.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Builds and returns the CSS class string for the alert title.
    /// </summary>
    /// <returns>The merged CSS classes.</returns>
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, BaseStyle, _textCss);
    }

    /// <summary>
    /// Sets the text CSS based on the alert variant.
    /// </summary>
    protected override void OnParametersSet()
    {
        _textCss = GetAlertTextCss(AlertParent?.Variant);
        base.OnParametersSet();
    }

    /// <summary>
    /// Returns the CSS class for the text color corresponding to the specified alert variant.
    /// </summary>
    /// <param name="variant">The alert variant.</param>
    /// <returns>The CSS class for the alert text color.</returns>
    protected static string GetAlertTextCss(AlertVariant? variant)
    {
        return variant switch
        {
            AlertVariant.Alternate => "text-on-surface-darker",
            AlertVariant.Information => "text-info",
            AlertVariant.Success => "text-success",
            AlertVariant.Warning => "text-warning",
            AlertVariant.Danger => "text-danger",
            _ => "text-info"
        };
    }
}
