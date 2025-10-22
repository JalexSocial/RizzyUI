
using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;
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
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new();

    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    [Parameter]
    public TextRole Role { get; set; } = TextRole.Text;

    [Parameter]
    public string Placeholder { get; set; } = string.Empty;

    [Parameter]
    public string? DisplayName { get; set; }

    [Parameter]
    public bool Required { get; set; }

    [Parameter]
    public RenderFragment? FieldHelp { get; set; }

    [Parameter, EditorRequired]
    public Expression<Func<string>>? For { get; set; }

    [Parameter]
    public string? PrependText { get; set; }

    [Parameter]
    public SvgIcon? PrependIcon { get; set; }

    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (For == null)
            throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");
        if (EditContext == null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");
    }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzTextField;

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}