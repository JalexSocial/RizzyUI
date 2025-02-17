using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;

namespace RizzyUI;

/// <summary>
/// Component that encapsulates a RenderFragment for use as a partial or child component.
/// </summary>
public class FragmentComponent : ComponentBase
{
    /// <summary>
    /// Fragment to render
    /// </summary>
	[Parameter]
    public RenderFragment? Fragment { get; set; }

	/// <summary>
    /// Construct a component from a fragment
    /// </summary>
    /// <param name="builder"></param>
    protected override void BuildRenderTree(RenderTreeBuilder builder)
    {
        if (Fragment != null)
        {
            builder.AddContent(0, Fragment);
        }
    }
}