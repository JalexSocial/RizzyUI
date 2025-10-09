using Microsoft.AspNetCore.Components;
using RizzyUI.Extensions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents the title section (defaults to <c>h3</c>) for an <see cref="RzAlert" /> component.
///     Its text color is determined by the parent alert's variant and the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class AlertTitle : RzComponent<AlertTitle.Slots>
{
	/// <summary>
	/// Defines the default styling for the AlertTitle component.
	/// </summary>
	public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
		@base: "font-medium tracking-tight line-clamp-1",
		variants: new()
		{
			[c => ((AlertTitle)c).AlertParent != null ? ((AlertTitle)c).AlertParent.Variant : AlertVariant.Alternate] = new Variant<AlertVariant, Slots>
			{
				[AlertVariant.Destructive] = "text-destructive",
				[AlertVariant.Warning] = "text-warning",
				[AlertVariant.Information] = "text-info",
				[AlertVariant.Success] = "text-success"
			}
		}
	);

	/// <summary> Gets the parent <see cref="RzAlert" /> component to determine the variant. </summary>
	[CascadingParameter] public RzAlert? AlertParent { get; set; }

	/// <summary> The content to be rendered inside the alert title (typically text). </summary>
	[Parameter] public RenderFragment? ChildContent { get; set; }

	/// <inheritdoc />
	protected override void OnInitialized()
	{
		base.OnInitialized();
		if (string.IsNullOrEmpty(Element))
			Element = "h3";
	}

	/// <inheritdoc />
	protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.AlertTitle;

	/// <summary>
	/// Defines the slots available for styling in the AlertTitle component.
	/// </summary>
	public sealed partial class Slots : ISlots
	{
		public string? Base { get; set; }
	}
}