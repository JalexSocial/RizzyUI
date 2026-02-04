
using Microsoft.AspNetCore.Components;

namespace RizzyUI;

/// <summary>
/// Represents a group of options within a <see cref="RzNativeSelect{TValue}"/>.
/// Renders a standard HTML &lt;optgroup&gt; tag with the appropriate data-slot attribute.
/// </summary>
public partial class RzNativeSelectOptGroup : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the group (options).
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the label for the group.
    /// </summary>
    [Parameter] public string? Label { get; set; }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (Label != null)
        {
            AdditionalAttributes ??= new Dictionary<string, object>();
            AdditionalAttributes["label"] = Label;
        }
    }
}