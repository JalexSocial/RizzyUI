
using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;
using System.Linq.Expressions;

// For EditContext

namespace RizzyUI;

/// <xmldoc>
///     Represents a complete form field for text input, including a label, the input itself (<see cref="RzTextEdit" />),
///     optional help text, and validation message integration. Leverages <see cref="RzField" /> for structure.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzTextField : RzComponent
{
    /// <summary> Gets the current edit context. </summary>
    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    /// <summary> Gets or sets the semantic role of the text input (e.g., Text, Password). Defaults to Text. </summary>
    [Parameter]
    public TextRole Role { get; set; } = TextRole.Text;

    /// <summary> Gets or sets the placeholder text displayed in the input field. </summary>
    [Parameter]
    public string Placeholder { get; set; } = string.Empty;

    /// <summary> Gets or sets the display name for the field label. If not set, it's inferred from the 'For' expression. </summary>
    [Parameter]
    public string? DisplayName { get; set; }

    /// <summary>
    ///     Gets or sets a value indicating whether the field is marked as required (adds an indicator to the label).
    ///     Defaults to false.
    /// </summary>
    [Parameter]
    public bool Required { get; set; }

    /// <summary> Gets or sets optional content displayed below the input field as help text. </summary>
    [Parameter]
    public RenderFragment? FieldHelp { get; set; }

    /// <summary> Specifies the field the input is bound to. Required. Used for binding, validation, and label inference. </summary>
    [Parameter]
    [EditorRequired]
    public Expression<Func<string>>? For { get; set; }

    /// <summary> Gets or sets optional text to prepend inside the input field's visual container. </summary>
    [Parameter]
    public string? PrependText { get; set; }

    /// <summary>
    ///     Gets or sets an optional Blazicon SVG icon to prepend inside the input field's visual container. Use either
    ///     this or PrependText.
    /// </summary>
    [Parameter]
    public SvgIcon? PrependIcon { get; set; }

    /// <inheritdoc />
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (For == null)
            throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");
        if (EditContext == null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");
    }

    /// <inheritdoc />
    protected override string? RootClass()
    {
        return TwMerge.Merge(AdditionalAttributes);
        // Styling is primarily handled by the nested RzField component
    }
}