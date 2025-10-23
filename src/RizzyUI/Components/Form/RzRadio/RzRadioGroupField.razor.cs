
using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a RadioGroupField component.
/// </summary>
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

    /// <summary>
    /// Gets or sets the display name for the field label. If not set, it's inferred from the `For` expression.
    /// </summary>
    [Parameter]
    public string? DisplayName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the orientation of the radio group (Vertical or Horizontal). Defaults to Vertical.
    /// </summary>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    /// <summary>
    /// Gets or sets the icon displayed inside the selected radio button.
    /// </summary>
    [Parameter]
    public SvgIcon CheckboxIcon { get; set; } = MdiIcon.CheckboxMarkedCircle;

    /// <summary>
    /// Gets or sets the expression that identifies the bound value. This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired]
    public required Expression<Func<TValue>>? For { get; set; }

    /// <summary>
    /// Gets or sets the currently selected value of the radio group.
    /// </summary>
    [Parameter]
    public TValue? Value { get; set; }

    /// <summary>
    /// Gets or sets an event callback that is invoked when the selected value changes.
    /// </summary>
    [Parameter]
    public EventCallback<TValue> ValueChanged { get; set; }

    /// <summary>
    /// Gets or sets the name attribute shared by all radio buttons in the group.
    /// </summary>
    [Parameter]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the content containing the <see cref="RzRadioGroupItem{TValue}"/> components.
    /// </summary>
    [Parameter]
    public RenderFragment? RadioGroupContent { get; set; }

    /// <summary>
    /// Gets or sets optional content displayed below the group to provide help or context.
    /// </summary>
    [Parameter]
    public RenderFragment? FieldHelp { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the field is required.
    /// </summary>
    [Parameter]
    public bool Required { get; set; }

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
                    EditContext?.NotifyFieldChanged(_fieldIdentifier);
                });
            }
        }
    }

    /// <summary>
    /// Gets the resolved name for the radio group, falling back to the field name if not provided.
    /// </summary>
    protected string ResolvedName { get; private set; } = string.Empty;

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
        ResolvedName = string.IsNullOrEmpty(Name) ? _fieldIdentifier.FieldName : Name;
    }

    /// <inheritdoc/>
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

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<RzRadioGroupFieldSlots>, RzRadioGroupFieldSlots> GetDescriptor() => Theme.RzRadioGroupField;
}