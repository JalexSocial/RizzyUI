
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

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

    [Parameter]
    public string? DisplayName { get; set; }

    [Parameter, EditorRequired]
    public Expression<Func<IList<TValue>>>? For { get; set; }

    [Parameter]
    public IList<TValue>? Values { get; set; }

    [Parameter]
    public EventCallback<IList<TValue>> ValuesChanged { get; set; }

    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    [Parameter]
    public RenderFragment? CheckboxGroupContent { get; set; }

    [Parameter]
    public RenderFragment? FieldHelp { get; set; }

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

    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        if (Values != null && !ReferenceEquals(Values, _currentValues) && !Values.SequenceEqual(_currentValues))
            _currentValues = new List<TValue>(Values);
    }

    protected override TvDescriptor<RzComponent<RzCheckboxGroupFieldSlots>, RzCheckboxGroupFieldSlots> GetDescriptor() => Theme.RzCheckboxGroupField;
}