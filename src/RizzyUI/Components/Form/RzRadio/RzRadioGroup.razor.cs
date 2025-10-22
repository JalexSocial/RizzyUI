
using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

public interface IHasRadioGroupStylingProperties
{
    public Orientation Orientation { get; }
    public int ItemCount { get; }
}

/// <xmldoc>
///     Represents a group of radio buttons (<see cref="RzRadioGroupItem{TValue}" />) where only one option can be selected
///     at a time.
///     It integrates with Blazor's EditForm for validation and model binding.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzRadioGroup<TValue> : RzComponent<RzRadioGroupSlots>, IHasRadioGroupStylingProperties
{
    private TValue? _currentValue = default!;
    private FieldIdentifier _fieldIdentifier;
    private List<RzRadioGroupItem<TValue>> _items = new();

    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    [Parameter]
    public string? DisplayName { get; set; } = string.Empty;

    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    [Parameter, EditorRequired]
    public Expression<Func<TValue>>? For { get; set; }

    [Parameter]
    public string Name { get; set; } = string.Empty;

    [Parameter]
    public SvgIcon CheckboxIcon { get; set; } = MdiIcon.CheckboxMarkedCircle;

    [Parameter]
    public TValue? Value { get; set; } = default!;

    [Parameter]
    public EventCallback<TValue> ValueChanged { get; set; }

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    public int ItemCount => _items.Count;

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
                });
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
        _currentValue = Value ?? For.Compile().Invoke();

        if (string.IsNullOrEmpty(Name)) Name = _fieldIdentifier.FieldName;
    }

    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        if (For != null && Value == null)
        {
            var newValue = Value ?? For.Compile().Invoke();
            if (!EqualityComparer<TValue?>.Default.Equals(_currentValue, newValue)) _currentValue = newValue;
        }

        if (For == null) return;

        var newFieldIdentifier = FieldIdentifier.Create(For);
        if (string.IsNullOrEmpty(Name) || Name == _fieldIdentifier.FieldName)
            Name = newFieldIdentifier.FieldName;
        _fieldIdentifier = newFieldIdentifier;
    }

    public void AddRadioItem(RzRadioGroupItem<TValue> item)
    {
        if (!_items.Contains(item))
        {
            _items.Add(item);
            StateHasChanged();
        }
    }

    protected override TvDescriptor<RzComponent<RzRadioGroupSlots>, RzRadioGroupSlots> GetDescriptor() => Theme.RzRadioGroup;
}