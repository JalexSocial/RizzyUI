
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents a form field containing a toggle switch (<see cref="RzToggle" />), along with a label,
///     optional description, and validation message integration. Leverages <see cref="RzField" /> for structure.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzToggleField : RzComponent<RzToggleField.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzToggleField component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        slots: new()
        {
            [s => s.ContentWrapper] = "gap-2 flex flex-row items-start justify-between rounded-lg border p-4 shadow-xs",
            [s => s.InnerWrapper] = "flex flex-col gap-0.5",
            [s => s.LabelInField] = "leading-normal text-sm font-medium",
            [s => s.DescriptionInLabel] = "text-sm text-muted-foreground"
        }
    );

    private bool _currentValue;
    private FieldIdentifier _fieldIdentifier;

    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    /// <summary>
    /// Gets or sets the display name for the field label. If not set, it's inferred from the `For` expression.
    /// </summary>
    [Parameter]
    public string? DisplayName { get; set; }

    /// <summary>
    /// Gets or sets optional descriptive content displayed below the label.
    /// </summary>
    [Parameter]
    public RenderFragment? Description { get; set; }

    /// <summary>
    /// Gets or sets the expression that identifies the bound value. This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired]
    public Expression<Func<bool>>? For { get; set; }

    /// <summary>
    /// Gets or sets the current value of the toggle.
    /// </summary>
    [Parameter]
    public bool? Value { get; set; }

    /// <summary>
    /// Gets or sets an event callback that is invoked when the value changes.
    /// </summary>
    [Parameter]
    public EventCallback<bool> ValueChanged { get; set; }

    /// <summary>
    /// Gets or sets the current value of the toggle, managing state and notifying changes.
    /// </summary>
    protected bool CurrentValue
    {
        get => _currentValue;
        set
        {
            if (_currentValue != value)
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
    }

    /// <inheritdoc/>
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        var newValue = Value ?? For?.Compile().Invoke() ?? false;
        if (_currentValue != newValue) _currentValue = newValue;
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzToggleField;

    /// <summary>
    /// Defines the slots available for styling in the RzToggleField component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the main field container.
        /// </summary>
        public string? Base { get; set; }
        /// <summary>
        /// The slot for the wrapper around the content (label, description, toggle).
        /// </summary>
        public string? ContentWrapper { get; set; }
        /// <summary>
        /// The slot for the inner wrapper around the label and description.
        /// </summary>
        public string? InnerWrapper { get; set; }
        /// <summary>
        /// The slot for the label within the field.
        /// </summary>
        public string? LabelInField { get; set; }
        /// <summary>
        /// The slot for the toggle component within the field.
        /// </summary>
        public string? ToggleInField { get; set; }
        /// <summary>
        /// The slot for the description text within the label.
        /// </summary>
        public string? DescriptionInLabel { get; set; }
    }
}