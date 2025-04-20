using System.Linq.Expressions;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.Extensions.Options;
using RizzyUI.Extensions;
// For IdGenerator if needed, though base RzComponent might handle ID now

// For EditContext

namespace RizzyUI;

/// <xmldoc>
///     Represents a form field containing a toggle switch (<see cref="RzToggle" />), along with a label,
///     optional description, and validation message integration. Leverages <see cref="RzField" /> for structure.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzToggleField : RzComponent
{
    private bool _currentValue;

    private FieldIdentifier _fieldIdentifier;
    
    /// <summary> Gets the current edit context. </summary>
    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    /// <summary> Gets or sets the display name for the field label. If not set, it's inferred from the 'For' expression. </summary>
    [Parameter]
    public string? DisplayName { get; set; }

    /// <summary> Gets or sets optional descriptive text displayed below the label. </summary>
    [Parameter]
    public RenderFragment? Description { get; set; }

    /// <summary> Specifies the field the toggle switch is bound to. Required. </summary>
    [Parameter]
    [EditorRequired]
    public Expression<Func<bool>>? For { get; set; }

    /// <summary> Gets or sets the current boolean value of the toggle switch. </summary>
    [Parameter]
    public bool? Value { get; set; }

    /// <summary> Event callback invoked when the toggle's value changes. </summary>
    [Parameter]
    public EventCallback<bool> ValueChanged { get; set; }

    /// <summary> Internal property for two-way binding with RzToggle. </summary>
    protected bool CurrentValue
    {
        get => _currentValue;
        set
        {
            if (_currentValue != value)
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

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the content wrapper div. </summary>
    protected string ContentWrapperClass => Theme.RzToggleField.ContentWrapper;

    /// <summary> Gets the computed CSS classes for the inner flex container div. </summary>
    protected string InnerWrapperClass => Theme.RzToggleField.InnerWrapper;

    /// <summary> Gets the computed CSS classes for the RzFieldLabel within this field. </summary>
    protected string LabelInFieldClass => Theme.RzToggleField.LabelInField;

    /// <summary> Gets the computed CSS classes for the RzToggle within this field. </summary>
    protected string ToggleInFieldClass => Theme.RzToggleField.ToggleInField;

    /// <summary> Gets the computed CSS classes for the description span within the label. </summary>
    protected string DescriptionInLabelClass => Theme.RzToggleField.DescriptionInLabel;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (For == null)
            throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");
        
        if (EditContext == null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");

        _fieldIdentifier = FieldIdentifier.Create(For);
        // Initialize _currentValue from Value parameter or model
        _currentValue = Value ?? For.Compile().Invoke();
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        // If the Value parameter changes externally, update internal state
        var newValue = Value ?? For?.Compile().Invoke() ?? false;
        if (_currentValue != newValue) _currentValue = newValue;
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes);
        // Styling handled by RzField
    }
}