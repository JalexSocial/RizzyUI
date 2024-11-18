using Microsoft.AspNetCore.Components;
using System.Diagnostics.CodeAnalysis;
using TailwindMerge;

namespace RizzyUI;

public class RizzyComponent : ComponentBase
{
	protected virtual string RootClass { get; set; } = string.Empty;

    [Inject] protected TwMerge TwMerge { get; set; } = default!;

    [SuppressMessage("Usage", "CA2227:Collection properties should be read only", Justification = "False positive. This is a parameter.")]
    [Parameter(CaptureUnmatchedValues = true)]
    public IDictionary<string, object>? AdditionalAttributes { get; set; } = new Dictionary<string, object>();

    [Parameter]
	public RenderFragment? ChildContent { get; set; } = default!;

	protected override void OnParametersSet()
	{
		base.OnParametersSet();

		if (AdditionalAttributes?.TryGetValue("class", out object? userClasses) == true)
		{
			RootClass = TwMerge.Merge(RootClass, userClasses.ToString()) ?? string.Empty;

			AdditionalAttributes.Remove("class");
		}
	}
}