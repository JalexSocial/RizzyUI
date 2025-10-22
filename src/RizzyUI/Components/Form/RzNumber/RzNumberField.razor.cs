
using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

public interface IHasNumberFieldStylingProperties { }

/// <xmldoc>
///     Represents a complete form field for number input, including a label, the input itself (
///     <see cref="RzNumberEdit{TValue}" />),
///     optional help text, and validation message integration. Leverages <see cref="RzField" /> for structure.
///     Styling is determined by the active <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzNumberField<TValue> : RzComponent<RzNumberFieldSlots>, IHasNumberFieldStylingProperties
{
    [CascadingParameter]
    private EditContext? EditContext { get; set; }

    [Parameter, EditorRequired]
    public Expression<Func<TValue>>? For { get; set; }

    [Parameter]
    public string? PrependText { get; set; }

    [Parameter]
    public SvgIcon? PrependIcon { get; set; }

    [Parameter]
    public string Placeholder { get; set; } = string.Empty;

    [Parameter]
    public string? DisplayName { get; set; }

    [Parameter]
    public bool Required { get; set; }

    [Parameter]
    public RenderFragment? FieldHelp { get; set; }

    protected Dictionary<string, object> InputAttributes => AdditionalAttributes?
        .Where(kvp => kvp.Key.ToLowerInvariant() != "class")
        .ToDictionary(kvp => kvp.Key, kvp => kvp.Value) ?? new Dictionary<string, object>();

    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (For == null)
            throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");
        if (EditContext == null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");
    }

    protected override TvDescriptor<RzComponent<RzNumberFieldSlots>, RzNumberFieldSlots> GetDescriptor() => Theme.RzNumberField;
}