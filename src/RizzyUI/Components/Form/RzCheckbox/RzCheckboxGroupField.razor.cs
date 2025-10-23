
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a CheckboxGroupField component.
/// </summary>
public interface IHasCheckboxGroupFieldStylingProperties { }

/// <xmldoc>
///     Represents a form field component that wraps a group of checkbox items (<see cref="RzCheckboxGroup{TValue}" />)
///     with a label, help text, and validation message integration. It leverages the <see cref="RzField" /> component for
///     base structure.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzCheckboxGroupField<TValue> : RzComponent<RzCheckboxGroupFieldSlots>, IHasCheckboxGroupFieldStylingProperties
{
    private IList<TValue> _currentValues = new List<TValue>();
    private FieldIdentifier _fieldIdentifier;

    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    /// <summary>
    /// Gets or sets the display name for the field label. If not set, it's inferred from the `For` expression.
    /// </summary>
    [Parameter]
    public string? DisplayName { get; set; }

    /// <summary>
    /// Gets or sets the expression that identifies the bound value. This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired]
    public Expression<Func<IList<TValue>>>? For { get; set; }

    /// <summary>
    /// Gets or sets the list of selected values in the checkbox group.
    /// </summary>
    [Parameter]
    public IList<TValue>? Values { get; set; }

    /// <summary>
    /// Gets or sets an event callback that is invoked when the selected values change.
    /// </summary>
    [Parameter]
    public EventCallback<IList<TValue>> ValuesChanged { get; set; }

    /// <summary>
    /// Gets or sets the orientation of the checkbox group (Vertical or Horizontal). Defaults to Vertical.
    /// </summary>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    /// <summary>
    /// Gets or sets the content containing the <see cref="RzCheckboxGroupItem{TValue}"/> components.
    /// </summary>
    [Parameter]
    public RenderFragment? CheckboxGroupContent { get; set; }

    /// <summary>
    /// Gets or sets optional content displayed below the group to provide help or context.
    /// </summary>
    [Parameter]
    public RenderFragment? FieldHelp { get; set; }

    /// <summary>
    /// Gets or sets the current selected values, managing state and notifying changes.
    /// </summary>
    protected IList<TValue> CurrentValues
    {
        get => _currentValues;
        set
        {
            if (!EqualityComparer<IList<TValue>>.Default.Equals(_currentValues, value))
            {
                _currentValues = value;
                EditContext?.NotifyFieldChanged(_fieldIdentifier);
                InvokeAsync(() => ValuesChanged.InvokeAsync(_currentValues));
            }
        }
    }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (For == null)
            throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");

        if (EditContext == null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");

        _fieldIdentifier = FieldIdentifier.Create(For);

        _currentValues = Values ??
                         _fieldIdentifier.Model.GetType()?.GetProperty(_fieldIdentifier.FieldName)
                             ?.GetValue(_fieldIdentifier.Model) as IList<TValue> ?? new List<TValue>();
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (Values != null && !ReferenceEquals(Values, _currentValues) && !Values.SequenceEqual(_currentValues))
            _currentValues = new List<TValue>(Values);
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<RzCheckboxGroupFieldSlots>, RzCheckboxGroupFieldSlots> GetDescriptor() => Theme.RzCheckboxGroupField;
}