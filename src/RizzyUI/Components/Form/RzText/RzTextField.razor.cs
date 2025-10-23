
using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <xmldoc>
///     Represents a complete form field for text input, including a label, the input itself (<see cref="RzTextEdit" />),
///     optional help text, and validation message integration. Leverages <see cref="RzField" /> for structure.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzTextField : RzComponent<RzTextField.Slots>
{
    /// <summary>
    /// Defines the default styling for the RzTextField component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new();

    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    /// <summary>
    /// Gets or sets the semantic role of the text input (e.g., Text, Password).
    /// </summary>
    [Parameter]
    public TextRole Role { get; set; } = TextRole.Text;

    /// <summary>
    /// Gets or sets the placeholder text displayed in the input field.
    /// </summary>
    [Parameter]
    public string Placeholder { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the display name for the field label. If not set, it's inferred from the `For` expression.
    /// </summary>
    [Parameter]
    public string? DisplayName { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the field is required.
    /// </summary>
    [Parameter]
    public bool Required { get; set; }

    /// <summary>
    /// Gets or sets optional content displayed below the input field as help text.
    /// </summary>
    [Parameter]
    public RenderFragment? FieldHelp { get; set; }

    /// <summary>
    /// Gets or sets the expression that identifies the bound value. This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired]
    public Expression<Func<string>>? For { get; set; }

    /// <summary>
    /// Gets or sets optional text to prepend inside the input field's visual container.
    /// </summary>
    [Parameter]
    public string? PrependText { get; set; }

    /// <summary>
    /// Gets or sets an optional Blazicon SVG icon to prepend inside the input field's visual container.
    /// </summary>
    [Parameter]
    public SvgIcon? PrependIcon { get; set; }

    /// <inheritdoc/>
    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (For == null)
            throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");
        if (EditContext == null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzTextField;

    /// <summary>
    /// Defines the slots available for styling in the RzTextField component.
    /// </summary>
    public sealed partial class Slots : ISlots
    {
        /// <summary>
        /// The base slot for the component's root element.
        /// </summary>
        public string? Base { get; set; }
    }
}