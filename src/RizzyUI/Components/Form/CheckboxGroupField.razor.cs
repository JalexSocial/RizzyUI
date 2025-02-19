using Microsoft.AspNetCore.Components;
using System.Linq.Expressions;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <summary>
/// Represents a form field component that wraps a group of checkbox items with a label and validation message.
/// </summary>
public partial class CheckboxGroupField<TValue> : RizzyComponent
{
    private static readonly string BaseStyle = "";

    /// <summary>
    /// Gets or sets the display name for the field label.
    /// </summary>
    [Parameter]
    public string? DisplayName { get; set; }

    /// <summary>
    /// Specifies the field for which validation messages should be displayed.
    /// </summary>
    [Parameter, EditorRequired]
    public Expression<Func<IList<TValue>>>? For { get; set; }

    /// <summary>
    /// Gets or sets the selected values in the checkbox group.
    /// </summary>
    [Parameter]
    public IList<TValue>? Values { get; set; }

    /// <summary>
    /// Event callback when the selected values change.
    /// </summary>
    [Parameter]
    public EventCallback<IList<TValue>> ValuesChanged { get; set; }

    /// <summary>
    /// Gets or sets the orientation of the checkbox group.
    /// </summary>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    /// <summary>
    /// Child content to be rendered inside the checkbox group.
    /// </summary>
    [Parameter]
    public RenderFragment? CheckboxGroupContent { get; set; }

    /// <summary>
    /// Optional field help content.
    /// </summary>
    [Parameter]
    public RenderFragment? FieldHelp { get; set; }

    /// <summary>
    /// During parameter setting, if the For expression is provided and the Values property is empty,
    /// extract the current value from the model.
    /// </summary>
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

    /// <summary>
    /// Computes the CSS class for the checkbox group field container.
    /// </summary>
    protected override string? RootClass() =>
        TwMerge.Merge(AdditionalAttributes, BaseStyle);
}
