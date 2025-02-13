using Microsoft.AspNetCore.Components;
using System.Linq.Expressions;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
/// Represents a form field component that wraps a group of checkbox items with a label and validation message.
/// </xmldoc>
public partial class CheckboxGroupField<TValue> : RizzyComponent
{
    private static readonly string BaseStyle = "";

    /// <xmldoc>
    /// Gets or sets the display name for the field label.
    /// </xmldoc>
    [Parameter]
    public string? DisplayName { get; set; }

    /// <xmldoc>
    /// Specifies the field for which validation messages should be displayed.
    /// </xmldoc>
    [Parameter, EditorRequired]
    public Expression<Func<IList<TValue>>>? For { get; set; }

    /// <xmldoc>
    /// Gets or sets the selected values in the checkbox group.
    /// </xmldoc>
    [Parameter]
    public IList<TValue>? Values { get; set; }

    /// <xmldoc>
    /// Event callback when the selected values change.
    /// </xmldoc>
    [Parameter]
    public EventCallback<IList<TValue>> ValuesChanged { get; set; }

    /// <xmldoc>
    /// Gets or sets the orientation of the checkbox group.
    /// </xmldoc>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    /// <xmldoc>
    /// Child content to be rendered inside the checkbox group.
    /// </xmldoc>
    [Parameter]
    public RenderFragment? CheckboxGroupContent { get; set; }

    /// <xmldoc>
    /// Optional field help content.
    /// </xmldoc>
    [Parameter]
    public RenderFragment? FieldHelp { get; set; }

    /// <xmldoc>
    /// During parameter setting, if the For expression is provided and the Values property is empty,
    /// extract the current value from the model.
    /// </xmldoc>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        if (For != null)
        {
            // Only assign if Values is currently empty.
            if (Values == null || !Values.Any())
            {
                Values = For.Compile().Invoke();
            }
        }
    }

    /// <xmldoc>
    /// Computes the CSS class for the checkbox group field container.
    /// </xmldoc>
    protected override string? RootClass() =>
        TwMerge.Merge(AdditionalAttributes, BaseStyle);
}
