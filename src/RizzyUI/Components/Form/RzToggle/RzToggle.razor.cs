using System.Linq.Expressions;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;

// For RzInputCheckbox

// For EditContext

namespace RizzyUI;

/// <xmldoc>
///     Renders a toggle switch (styled checkbox) component.
///     Styling is determined by the active <see cref="RzTheme" />. It should be used within an EditForm context.
/// </xmldoc>
public partial class RzToggle : RzComponent
{
    private bool _currentValue;

    private FieldIdentifier _fieldIdentifier;

    /// <summary> Gets the current edit context. </summary>
    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    /// <summary> Gets or sets the current boolean value of the toggle. </summary>
    [Parameter]
    public bool? Value { get; set; }

    /// <summary> Event callback for when the value changes. </summary>
    [Parameter]
    public EventCallback<bool> ValueChanged { get; set; }

    /// <summary> Specifies the field the toggle is bound to. Required. </summary>
    [Parameter]
    [EditorRequired]
    public Expression<Func<bool>>? For { get; set; }

    /// <summary> Internal property for two-way binding with RzInputCheckbox. </summary>
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

    /// <summary> Gets the string representation for the aria-checked attribute. </summary>
    protected string AriaCheckedValue => CurrentValue ? "true" : "false";

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
        // Update internal value if the parameter changes externally
        var newValue = Value ?? For?.Compile().Invoke() ?? false;
        if (_currentValue != newValue) _currentValue = newValue;
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, Theme.RzToggle.Toggle);
    }
}