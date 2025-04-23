
using System.Linq.Expressions;
using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;

// For EditContext, FieldIdentifier

namespace RizzyUI;

/// <xmldoc>
///     Represents a form field containing a group of radio buttons (<see cref="RzRadioGroup{TValue}" />),
///     along with a label, optional help text, and validation message integration.
///     Leverages <see cref="RzField" /> for structure. Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzRadioGroupField<TValue> : RzComponent
{
    private TValue? _currentValue;

    private FieldIdentifier _fieldIdentifier;

    /// <summary> Gets the current edit context. </summary>
    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    /// <summary> Gets or sets the display name for the field label. If not set, it's inferred from the 'For' expression. </summary>
    [Parameter]
    public string? DisplayName { get; set; } = string.Empty;

    /// <summary> Gets or sets the orientation of the radio group (Vertical or Horizontal). Defaults to Vertical. </summary>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    /// <summary>
    ///     Gets or sets the Blazicon SVG icon displayed inside the selected radio button circle. Defaults to
    ///     CheckboxMarkedCircle.
    /// </summary>
    [Parameter]
    public SvgIcon CheckboxIcon { get; set; } = MdiIcon.CheckboxMarkedCircle;

    /// <summary> Specifies the field the radio group is bound to. Required. </summary>
    [Parameter]
    [EditorRequired]
    public required Expression<Func<TValue>>? For { get; set; }

    /// <summary> Gets or sets the current selected value of the radio group. </summary>
    [Parameter]
    public TValue? Value { get; set; }

    /// <summary> Event callback invoked when the selected value changes. </summary>
    [Parameter]
    public EventCallback<TValue> ValueChanged { get; set; }

    /// <summary> Gets or sets the 'name' attribute for the radio group. If empty, it's derived from the 'For' expression. </summary>
    [Parameter]
    public string Name { get; set; } = string.Empty;

    /// <summary> Gets or sets the child content containing the <see cref="RzRadioGroupItem{TValue}" /> components. </summary>
    [Parameter]
    public RenderFragment? RadioGroupContent { get; set; } // Renamed from ChildContent for clarity

    /// <summary> Optional content displayed below the group as help text. </summary>
    [Parameter]
    public RenderFragment? FieldHelp { get; set; }

    /// <summary> Gets or sets a value indicating whether the field is marked as required. Defaults to false. </summary>
    [Parameter]
    public bool Required { get; set; }


    /// <summary> Internal property for two-way binding with RzRadioGroup. </summary>
    protected TValue? CurrentValue
    {
        get => _currentValue;
        set
        {
            if (!EqualityComparer<TValue?>.Default.Equals(_currentValue, value))
            {
                _currentValue = value;
                // Update the original parameter and invoke the callback
                InvokeAsync(async () =>
                {
                    Value = _currentValue; // Update the parameter bound property
                    await ValueChanged.InvokeAsync(_currentValue);
                    EditContext?.NotifyFieldChanged(_fieldIdentifier); // Notify EditContext
                });
            }
        }
    }

    /// <summary> The resolved name attribute for the radio group. </summary>
    protected string ResolvedName { get; private set; } = string.Empty;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (For == null)
            throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");

        if (EditContext == null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");

        _fieldIdentifier = FieldIdentifier.Create(For);
        _currentValue = Value ?? For.Compile().Invoke(); // Initialize from parameter or model
        ResolvedName = string.IsNullOrEmpty(Name) ? _fieldIdentifier.FieldName : Name; // Resolve name
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        // Update internal value if the parameter changes externally
        var newValue = Value ?? For!.Compile().Invoke();

        if (!EqualityComparer<TValue?>.Default.Equals(_currentValue, newValue)) _currentValue = newValue;
        // Update resolved name if 'For' or 'Name' parameter changes
        if (For != null)
        {
            var newFieldIdentifier = FieldIdentifier.Create(For);
            ResolvedName = string.IsNullOrEmpty(Name) ? newFieldIdentifier.FieldName : Name;
            _fieldIdentifier = newFieldIdentifier; // Update field identifier if 'For' changed
        }
        else if (!string.IsNullOrEmpty(Name))
        {
            ResolvedName = Name; // Use explicit name if 'For' is somehow null now
        }
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes);
        // Styling handled by RzField
    }
}