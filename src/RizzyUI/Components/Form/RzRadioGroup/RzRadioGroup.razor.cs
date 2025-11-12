
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Rizzy.Utility;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

public partial class RzRadioGroup<TValue> : RzComponent<RzRadioGroupSlots>, IHasRadioGroupStylingProperties
{
    private TValue? _currentValue;
    private FieldIdentifier _fieldIdentifier;
    private readonly string _legendId = IdGenerator.UniqueId("rz-rg-legend-");

    [CascadingParameter] private EditContext? EditContext { get; set; }

    [Parameter, EditorRequired] public Expression<Func<TValue>> For { get; set; } = default!;
    [Parameter] public TValue? Value { get; set; }
    [Parameter] public EventCallback<TValue> ValueChanged { get; set; }
    [Parameter] public RenderFragment? ChildContent { get; set; }
    [Parameter] public string Name { get; set; } = string.Empty;
    [Parameter] public string? DisplayName { get; set; }

    protected TValue? CurrentValue
    {
        get => _currentValue;
        set
        {
            if (!EqualityComparer<TValue?>.Default.Equals(_currentValue, value))
            {
                _currentValue = value;
            }
        }
    }
    
    protected EventCallback<TValue> CurrentValueChanged => EventCallback.Factory.Create<TValue>(this, async (value) =>
    {
        _currentValue = value;
        await ValueChanged.InvokeAsync(value);
        EditContext?.NotifyFieldChanged(_fieldIdentifier);
    });

    protected override void OnInitialized()
    {
        base.OnInitialized();
        Element = "fieldset";
        if (For == null) throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");
        if (EditContext == null) throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");

        _fieldIdentifier = FieldIdentifier.Create(For);
        _currentValue = Value ?? For.Compile().Invoke();

        if (string.IsNullOrEmpty(Name))
        {
            Name = _fieldIdentifier.FieldName;
        }
    }

    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        var newValue = Value ?? For!.Compile().Invoke();
        if (!EqualityComparer<TValue?>.Default.Equals(_currentValue, newValue)) 
        {
            _currentValue = newValue;
        }
    }

    protected override TvDescriptor<RzComponent<RzRadioGroupSlots>, RzRadioGroupSlots> GetDescriptor() => Theme.RzRadioGroup;
}