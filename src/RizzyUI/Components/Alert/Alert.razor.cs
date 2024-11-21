using Blazicons;
using RizzyUI.Extensions;
using Microsoft.AspNetCore.Components;

namespace RizzyUI;

public partial class Alert : RizzyComponent
{
	private const string _baseStyle = "relative w-full overflow-hidden borderRadius";
	private string _bgLight = "bg-info/10";
	private string _bgLighter = "bg-info/15";

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

	protected override void OnInitialized()
	{
		switch (Variant)
		{
			case AlertVariant.Information:
				Icon ??= SvgIcon.FromContent("<path fill-rule=\"evenodd\" d=\"M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z\" clip-rule=\"evenodd\" />");
				_bgLight = "bg-info/10";
				_bgLighter = "bg-info/15";
                break;
			case AlertVariant.Success:
				Icon ??= SvgIcon.FromContent("<path fill-rule=\"evenodd\" d=\"M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z\" clip-rule=\"evenodd\" />");
				_bgLight = "bg-success/10";
				_bgLighter = "bg-success/15";
                break;
			case AlertVariant.Warning:
				Icon ??= SvgIcon.FromContent("<path fill-rule=\"evenodd\" d=\"M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z\" clip-rule=\"evenodd\" />\r\n            </svg>");
				_bgLight = "bg-warning/10";
				_bgLighter = "bg-warning/15";
                break;
			case AlertVariant.Danger:
				Icon ??= SvgIcon.FromContent("<path fill-rule=\"evenodd\" d=\"M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z\" clip-rule=\"evenodd\" />");
				_bgLight = "bg-danger/10";
				_bgLighter = "bg-danger/15";
                break;
		}

		base.OnInitialized();
	}

    protected override string? RootClass()
	{
		return TwMerge.Merge(AdditionalAttributes, _baseStyle, _alertVariants[Variant]);
	}

	private readonly Dictionary<AlertVariant, string> _alertVariants = new Dictionary<AlertVariant, string>()
	{
		{ AlertVariant.Information, "border-info bg-surface text-onSurface dark:bg-surfaceDark dark:text-onSurfaceDark" },
		{ AlertVariant.Success, "border-success bg-surface text-onSurface dark:bg-surfaceDark dark:text-onSurfaceDark" },
		{ AlertVariant.Warning, "border-warning bg-surface text-onSurface dark:bg-surfaceDark dark:text-onSurfaceDark" },
		{ AlertVariant.Danger, "border-danger bg-surface text-onSurface dark:bg-surfaceDark dark:text-onSurfaceDark" }
	};
}
