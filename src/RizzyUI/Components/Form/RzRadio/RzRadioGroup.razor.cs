
using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a RadioGroup component.
/// </summary>
public interface IHasRadioGroupStylingProperties
{
    /// <summary>
    /// Gets the orientation of the radio group.
    /// </summary>
    public Orientation Orientation { get; }
    /// <summary>
    /// Gets the number of items in the radio group.
    /// </summary>
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

    /// <summary>
    /// Gets or sets the display name for the radio group.
    /// </summary>
    [Parameter]
    public string? DisplayName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the orientation of the radio group (Vertical or Horizontal). Defaults to Vertical.
    /// </summary>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    /// <summary>
    /// Gets or sets the expression that identifies the bound value. This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired]
    public Expression<Func<TValue>>? For { get; set; }

    /// <summary>
    /// Gets or sets the name attribute shared by all radio buttons in the group.
    /// </summary>
    [Parameter]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the icon displayed inside the selected radio button.
    /// </summary>
    [Parameter]
    public SvgIcon CheckboxIcon { get; set; } = MdiIcon.CheckboxMarkedCircle;

    /// <summary>
    /// Gets or sets the currently selected value of the radio group.
    /// </summary>
    [Parameter]
    public TValue? Value { get; set; } = default!;

    /// <summary>
    /// Gets or sets an event callback that is invoked when the selected value changes.
    /// </summary>
    [Parameter]
    public EventCallback<TValue> ValueChanged { get; set; }

    /// <summary>
    /// Gets or sets the child content, which should contain the <see cref="RzRadioGroupItem{TValue}"/> components.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets the number of items in the radio group.
    /// </summary>
    public int ItemCount => _items.Count;

    /// <summary>
    /// Gets or sets the current selected value, managing state and notifying changes.
    /// </summary>
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

    /// <inheritdoc/>
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

    /// <inheritdoc/>
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

    /// <summary>
    /// Adds a radio item to the group.
    /// </summary>
    /// <param name="item">The radio item to add.</param>
    public void AddRadioItem(RzRadioGroupItem<TValue> item)
    {
        if (!_items.Contains(item))
        {
            _items.Add(item);
            StateHasChanged();
        }
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<RzRadioGroupSlots>, RzRadioGroupSlots> GetDescriptor() => Theme.RzRadioGroup;
}