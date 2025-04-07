using System.Linq.Expressions;
using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;

namespace RizzyUI;

/// <xmldoc>
///     Represents a group of radio buttons (<see cref="RzRadioGroupItem{TValue}" />) where only one option can be selected
///     at a time.
///     It integrates with Blazor's EditForm for validation and model binding.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzRadioGroup<TValue> : RzComponent
{
    private TValue? _currentValue = default!;
    private FieldIdentifier _fieldIdentifier;

    private List<RzRadioGroupItem<TValue>> _items = new();

    /// <summary> Gets the current edit context. Required as RzInputRadioGroup needs it. </summary>
    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    /// <summary> Gets or sets the display name (often used by label components, though not directly here). </summary>
    [Parameter]
    public string? DisplayName { get; set; } = string.Empty;

    /// <summary> Gets or sets the orientation of the radio items (Vertical or Horizontal). Defaults to Vertical. </summary>
    [Parameter]
    public Orientation Orientation { get; set; } = Orientation.Vertical;

    /// <summary>
    ///     Specifies the field for which validation messages should be displayed.
    /// </summary>
    [Parameter][EditorRequired]
    public Expression<Func<TValue>>? For { get; set; }

    /// <summary> Gets or sets the 'name' attribute shared by all radio buttons in the group. If empty, one is generated. </summary>
    [Parameter]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    ///     Gets or sets the Blazicon SVG icon displayed inside the selected radio button circle. Defaults to
    ///     CheckboxMarkedCircle.
    /// </summary>
    [Parameter]
    public SvgIcon CheckboxIcon { get; set; } = MdiIcon.CheckboxMarkedCircle;

    /// <summary> Gets or sets the currently selected value in the radio group. </summary>
    [Parameter]
    public TValue? Value { get; set; } = default!;

    /// <summary> Event callback invoked when the selected value changes. </summary>
    [Parameter]
    public EventCallback<TValue> ValueChanged { get; set; }

    /// <summary> Gets or sets the child content, expected to be <see cref="RzRadioGroupItem{TValue}" /> components. </summary>
    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary> Internal property for two-way binding with RzInputRadioGroup. </summary>
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
                    // RzInputRadioGroup handles EditContext notification
                });
            }
        }
    }

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

        // Generate a name if not provided
        if (string.IsNullOrEmpty(Name)) Name = _fieldIdentifier.FieldName;
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();
        
        // Update internal value if the parameter changes externally
        if (For != null && Value == null)
        {
            var newValue = Value ?? For.Compile().Invoke();
        
            if (!EqualityComparer<TValue?>.Default.Equals(_currentValue, newValue)) _currentValue = newValue;
        }        
        
        // Regenerate name if 'For' changes and Name was auto-generated
        if (For == null) return;
        
        var newFieldIdentifier = FieldIdentifier.Create(For);
            
        if (string.IsNullOrEmpty(Name) || Name == _fieldIdentifier.FieldName) 
            Name = newFieldIdentifier.FieldName;
            
        _fieldIdentifier = newFieldIdentifier;
    }

    /// <summary> Adds an <see cref="RzRadioGroupItem{TValue}" /> to this group. Called by child items. </summary>
    /// <param name="item">The radio group item to add.</param>
    public void AddRadioItem(RzRadioGroupItem<TValue> item)
    {
        if (!_items.Contains(item))
        {
            _items.Add(item);
            StateHasChanged(); // Need to re-render to update grid column count
        }
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        var styles = Theme.RzRadioGroup;
        return TwMerge.Merge(AdditionalAttributes, styles.Container,
            styles.GetGridColumnsCss(Orientation, _items.Count));
    }
}