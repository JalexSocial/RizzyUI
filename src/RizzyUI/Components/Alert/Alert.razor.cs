using Blazicons;
using RizzyUI.Extensions;
using Microsoft.AspNetCore.Components;

namespace RizzyUI;

public partial class Alert : RizzyComponent
{
	private const string _baseStyle = "relative w-full overflow-hidden rounded border";
	private string _bgLight = "bg-info/10";
	private string _bgLighter = "bg-info/15";
    private string _iconColor = "text-info";

    [Parameter]
	public AlertVariant Variant { get; set; } = AlertVariant.Information;

	[Parameter]
	public SvgIcon? Icon { get; set; }

    [Parameter]
	public bool Dismissable { get; set; } = false;


    /// <summary>
    /// Child content for the alert
    /// </summary>
    [Parameter]
	public RenderFragment? ChildContent { get; set; }

    protected override void OnParametersSet()
    {

		switch (Variant)
		{
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

    protected override string? RootClass()
	{
		return TwMerge.Merge(AdditionalAttributes, _baseStyle, GetAlertVariantCss(Variant));
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
            AlertVariant.Information => "border-info bg-surface text-onSurface dark:bg-surfaceDark dark:text-onSurfaceDark",
            AlertVariant.Success => "border-success bg-surface text-onSurface dark:bg-surfaceDark dark:text-onSurfaceDark",
            AlertVariant.Warning => "border-warning bg-surface text-onSurface dark:bg-surfaceDark dark:text-onSurfaceDark",
            AlertVariant.Danger => "border-danger bg-surface text-onSurface dark:bg-surfaceDark dark:text-onSurfaceDark",
            _ => throw new ArgumentOutOfRangeException(nameof(variant), variant, null)
        };
    }
}
