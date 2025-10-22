
using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

public interface IHasRadioGroupFieldStylingProperties { }

/// <xmldoc>
///     Represents a form field containing a group of radio buttons (<see cref="RzRadioGroup{TValue}" />),
///     along with a label, optional help text, and validation message integration.
///     Leverages <see cref="RzField" /> for structure. Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzRadioGroupField<TValue> : RzComponent<RzRadioGroupFieldSlots>, IHasRadioGroupFieldStylingProperties
{
    private TValue? _currentValue;
    private FieldIdentifier _fieldIdentifier;

    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    [Parameter]
    public string? DisplayName { get; set; } = string.Empty;

    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    [Parameter]
    public SvgIcon CheckboxIcon { get; set; } = MdiIcon.CheckboxMarkedCircle;

    [Parameter, EditorRequired]
    public required Expression<Func<TValue>>? For { get; set; }

    [Parameter]
    public TValue? Value { get; set; }

    [Parameter]
    public EventCallback<TValue> ValueChanged { get; set; }

    [Parameter]
    public string Name { get; set; } = string.Empty;

    [Parameter]
    public RenderFragment? RadioGroupContent { get; set; }

    [Parameter]
    public RenderFragment? FieldHelp { get; set; }

    [Parameter]
    public bool Required { get; set; }

    protected TValue? CurrentValue
    {
        get => _currentValue;
        set
        {
            if (!EqualityComparer<TValue?>.Default.Equals(_currentValue, value))
            {
                _currentValue = value;
                InvokeAsync(async () =>
                {
                    Value = _currentValue;
                    await ValueChanged.InvokeAsync(_currentValue);
                    EditContext?.NotifyFieldChanged(_fieldIdentifier);
                });
            }
        }
    }

    protected string ResolvedName { get; private set; } = string.Empty;

    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (For == null)
            throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");

        if (EditContext == null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");

        _fieldIdentifier = FieldIdentifier.Create(For);
        _currentValue = Value ?? For.Compile().Invoke();
        ResolvedName = string.IsNullOrEmpty(Name) ? _fieldIdentifier.FieldName : Name;
    }

    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        var newValue = Value ?? For!.Compile().Invoke();

        if (!EqualityComparer<TValue?>.Default.Equals(_currentValue, newValue)) _currentValue = newValue;
        if (For != null)
        {
            var newFieldIdentifier = FieldIdentifier.Create(For);
            ResolvedName = string.IsNullOrEmpty(Name) ? newFieldIdentifier.FieldName : Name;
            _fieldIdentifier = newFieldIdentifier;
        }
        else if (!string.IsNullOrEmpty(Name))
        {
            ResolvedName = Name;
        }
    }

    protected override TvDescriptor<RzComponent<RzRadioGroupFieldSlots>, RzRadioGroupFieldSlots> GetDescriptor() => Theme.RzRadioGroupField;
}