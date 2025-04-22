using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;

// For RzInputNumber

// For EditContext

namespace RizzyUI;

/// <xmldoc>
///     Represents a customizable number input component, potentially used within an <see cref="RzNumberField{TValue}" />.
///     Supports prepended text or icons and binding to numeric types. Styling is determined by the active
///     <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzNumberEdit<TValue> : InputBase<TValue> // Inherits InputBase<TValue>
{
    private RzInputNumber<TValue>? _elem; // Reference to the underlying RzInputNumber
    private string _placeholder = string.Empty;
    private TValue _value = default!;

    /// <summary> Gets the current edit context. </summary>
    [CascadingParameter]
    public EditContext? EditContext { get; set; }

    /// <summary> Gets or sets the placeholder text for the input field. </summary>
    [Parameter]
    public string Placeholder { get; set; } = string.Empty;

    /// <summary> Gets or sets optional text to prepend inside the input field's visual container. </summary>
    [Parameter]
    public string? PrependText { get; set; }

    /// <summary>
    ///     Gets or sets an optional Blazicon SVG icon to prepend inside the input field's visual container. Use either
    ///     this or PrependText.
    /// </summary>
    [Parameter]
    public SvgIcon? PrependIcon { get; set; }

    /// <summary> Gets the ID attribute of the underlying input element, if available. </summary>
    public string Id => _elem?.Id ?? string.Empty;

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the input wrapper div. </summary>
    protected string InputWrapperClass => Theme.RzNumberEdit.InputWrapper;

    /// <summary> Gets the computed CSS classes for the prepend element div. </summary>
    protected string PrependElementClass => Theme.RzNumberEdit.PrependElement;

    /// <summary> Gets the computed CSS classes for the prepend icon container. </summary>
    protected string PrependIconContainerClass => Theme.RzNumberEdit.PrependIconContainer;

    /// <summary> Gets the computed CSS classes for the input element itself. </summary>
    protected string InputClass => Theme.RzNumberEdit.Input;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized(); // Call base for InputBase logic

        if (For == null) // For is required by InputBase
            throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");
        if (EditContext == null) // RzInputNumber requires EditContext
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet(); // Call base for InputBase logic

        _placeholder = Placeholder;
        if (AdditionalAttributes is not null && AdditionalAttributes.TryGetValue("placeholder", out var ph) &&
            ph is string phStr) _placeholder = phStr;

        // Compile the field expression to get the initial value.
        _value = For!.Compile().Invoke(); // For is guaranteed non-null by base/OnInitialized

        if (!string.IsNullOrEmpty(PrependText) && PrependIcon != null)
            throw new InvalidOperationException(
                $"{nameof(PrependText)} and {nameof(PrependIcon)} cannot both be set at the same time.");
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, InputClass);
        // RzInputNumber handles merging its own class
    }
}