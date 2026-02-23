using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Components.Rendering;

namespace RizzyUI;

/// <summary>
/// The internal base component that provides the core logic for a checkbox group,
/// inheriting from Blazor's InputBase to handle data binding and validation for a list of values.
/// </summary>
/// <typeparam name="TValue">The type of the values in the checkbox group.</typeparam>
public class RzInputCheckboxGroupBase<TValue> : InputBase<IList<TValue>>
{
    private readonly List<TValue> _selectedValues = new();

    /// <summary>
    /// The name to be assigned to each checkbox input in the group.
    /// </summary>
    [Parameter]
    public string? Name { get; set; }

    /// <summary>
    /// The child content, which should contain the RzCheckboxGroupItem components.
    /// </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        _selectedValues.Clear();
        if (CurrentValue is not null)
        {
            _selectedValues.AddRange(CurrentValue);
        }
    }

    /// <summary>
    /// Toggles the selection of a value in the group.
    /// </summary>
    /// <param name="value">The value to toggle.</param>
    internal void ToggleValue(TValue? value)
    {
        if (value is null) return;

        if (_selectedValues.Contains(value))
        {
            _selectedValues.Remove(value);
        }
        else
        {
            _selectedValues.Add(value);
        }

        CurrentValue = new List<TValue>(_selectedValues);
    }

    /// <summary>
    /// Checks if a given value is currently selected.
    /// </summary>
    /// <param name="value">The value to check.</param>
    /// <returns>True if the value is selected, otherwise false.</returns>
    internal bool IsChecked(TValue? value)
    {
        return value is not null && _selectedValues.Contains(value);
    }

    /// <inheritdoc/>
    protected override void BuildRenderTree(RenderTreeBuilder builder)
    {
        builder.OpenComponent<CascadingValue<RzInputCheckboxGroupBase<TValue>>>(0);
        builder.AddAttribute(1, "IsFixed", true);
        builder.AddAttribute(2, "Value", this);
        builder.AddAttribute(3, "ChildContent", ChildContent);
        builder.CloseComponent();
    }

    /// <inheritdoc/>
    protected override bool TryParseValueFromString(string? value, out IList<TValue> result, out string validationErrorMessage)
    {
        throw new NotSupportedException($"This component does not parse values from strings. Bind to the '{nameof(CurrentValue)}' property.");
    }
}