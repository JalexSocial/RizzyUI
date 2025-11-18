
using Microsoft.AspNetCore.Components;

namespace RizzyUI;

/// <summary>
/// Represents an option within a <see cref="RzNativeSelect{TValue}"/>.
/// Renders a standard HTML &lt;option&gt; tag with the appropriate data-slot attribute.
/// </summary>
public partial class RzNativeSelectOption : RzComponent
{
    /// <summary>
    /// Gets or sets the content of the option.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the value of the option.
    /// </summary>
    [Parameter] public object? Value { get; set; }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (Value != null)
        {
            AdditionalAttributes ??= new Dictionary<string, object>();
            AdditionalAttributes["value"] = Value;
        }
    }
}