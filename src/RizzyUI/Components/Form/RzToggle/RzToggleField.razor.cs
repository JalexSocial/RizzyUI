
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

    [Parameter]
    public string? DisplayName { get; set; }

    [Parameter]
    public RenderFragment? Description { get; set; }

    [Parameter, EditorRequired]
    public Expression<Func<bool>>? For { get; set; }

    [Parameter]
    public bool? Value { get; set; }

    [Parameter]
    public EventCallback<bool> ValueChanged { get; set; }

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

    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        var newValue = Value ?? For?.Compile().Invoke() ?? false;
        if (_currentValue != newValue) _currentValue = newValue;
    }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzToggleField;

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? ContentWrapper { get; set; }
        public string? InnerWrapper { get; set; }
        public string? LabelInField { get; set; }
        public string? ToggleInField { get; set; }
        public string? DescriptionInLabel { get; set; }
    }
}