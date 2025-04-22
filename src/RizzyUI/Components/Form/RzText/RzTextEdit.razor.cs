using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;

// For RzInputText

// For EditContext

namespace RizzyUI;

/// <xmldoc>
///     Represents a customizable text input component, potentially used within an <see cref="RzTextField" />.
///     Supports prepended text or icons. Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzTextEdit : InputBase<string> // Inherits from InputBase<string>
{
    private RzInputText? _elem; // Reference to the underlying RzInputText
    private string _placeholder = string.Empty;
    private string _role = "text";
    private string _value = string.Empty;

    /// <summary> Gets the current edit context. </summary>
    [CascadingParameter]
    public EditContext? EditContext { get; set; } // Cascaded EditContext

    /// <summary> Gets or sets the semantic role of the text input (e.g., Text, Password, Email). Defaults to Text. </summary>
    [Parameter]
    public TextRole Role { get; set; } = TextRole.Text;

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
    public string Id => _elem?.Id ?? string.Empty; // Get ID from RzInputText if possible

    // --- Style Properties derived from Theme ---
    /// <summary> Gets the computed CSS classes for the input wrapper div. </summary>
    protected string InputWrapperClass => Theme.RzTextEdit.InputWrapper;

    /// <summary> Gets the computed CSS classes for the prepend element div. </summary>
    protected string PrependElementClass => Theme.RzTextEdit.PrependElement;

    /// <summary> Gets the computed CSS classes for the prepend icon container. </summary>
    protected string PrependIconContainerClass => Theme.RzTextEdit.PrependIconContainer;

    /// <summary> Gets the computed CSS classes for the input element itself. </summary>
    protected string InputClass => Theme.RzTextEdit.Input;

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (For == null)
            throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");

        if (EditContext == null) // RzInputText requires EditContext
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");
    }

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        _role = GetParameterValue("type", Role.ToString().ToLowerInvariant()); // Get type from attributes or Role prop
        _placeholder =
            GetParameterValue("placeholder", Placeholder); // Get placeholder from attributes or Placeholder prop
        _value = For!.Compile().Invoke(); // Get initial value from expression (For is required by base)

        if (!string.IsNullOrEmpty(PrependText) && PrependIcon != null)
            throw new InvalidOperationException(
                $"{nameof(PrependText)} and {nameof(PrependIcon)} cannot both be set at the same time.");
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes, InputClass);
        // RzInputText handles merging its class
    }
}