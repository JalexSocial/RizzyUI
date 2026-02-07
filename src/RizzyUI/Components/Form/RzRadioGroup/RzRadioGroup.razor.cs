using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using Rizzy.Utility;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Provides a grouped set of mutually exclusive radio options.
/// </summary>
/// <typeparam name="TValue">The value type bound to the radio group.</typeparam>
public partial class RzRadioGroup<TValue> : RzComponent<RzRadioGroupSlots>, IHasRadioGroupStylingProperties
{
    private TValue? _currentValue;
    private FieldIdentifier _fieldIdentifier;
    private readonly string _legendId = IdGenerator.UniqueId("rz-rg-legend");

    [CascadingParameter] private EditContext? EditContext { get; set; }

    /// <summary>
    /// Gets or sets the model expression used for binding and validation metadata.
    /// </summary>
    [Parameter, EditorRequired] public Expression<Func<TValue>> For { get; set; } = default!;

    /// <summary>
    /// Gets or sets the current value of the selected radio item.
    /// </summary>
    [Parameter] public TValue? Value { get; set; }

    /// <summary>
    /// Gets or sets the child radio item content.
    /// </summary>
    [Parameter] public RenderFragment? ChildContent { get; set; }

    /// <summary>
    /// Gets or sets the HTML name attribute applied to radio inputs.
    /// </summary>
    [Parameter] public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets a display-friendly name for the bound value.
    /// </summary>
    [Parameter] public string? DisplayName { get; set; }

    /// <summary>
    /// Gets or sets the visual layout orientation of the radio items.
    /// </summary>
    [Parameter] public Orientation Orientation { get; set; } = Orientation.Vertical;

    /// <summary>
    /// Gets or sets a value indicating whether to show the indicators for each radio item.
    /// Defaults to true.
    /// </summary>
    [Parameter] public bool ShowIndicators { get; set; } = true;

    /// <summary>
    /// Gets or sets the effective current value tracked by the group.
    /// </summary>
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

    /// <inheritdoc />
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

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        var newValue = Value ?? For!.Compile().Invoke();
        if (!EqualityComparer<TValue?>.Default.Equals(_currentValue, newValue))
        {
            _currentValue = newValue;
        }
    }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<RzRadioGroupSlots>, RzRadioGroupSlots> GetDescriptor() => Theme.RzRadioGroup;
}