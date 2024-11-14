using Microsoft.AspNetCore.Components;

namespace RizzyUI;

public class RizzyComponent : ComponentBase
{
	protected IReadOnlyDictionary<string, object>? attributes;
	protected string classes = "";

	[Parameter(CaptureUnmatchedValues = true)]
	public IReadOnlyDictionary<string, object> AdditionalAttributes { get; set; } = new Dictionary<string, object>();

	[Parameter]
	public RenderFragment? ChildContent { get; set; } = default!;

	protected override void OnParametersSet()
	{
		base.OnParametersSet();

		classes = $"{AdditionalAttributes.GetValueOrDefault("class")}";

		attributes = AdditionalAttributes
			.Where(x => x.Key != "class")
			.ToDictionary(k => k.Key, v => v.Value);
	}
}