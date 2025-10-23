
using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a NumberField component.
/// </summary>
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

    /// <summary>
    /// Gets or sets the expression that identifies the bound value. This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired]
    public Expression<Func<TValue>>? For { get; set; }

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

    /// <summary>
    /// Gets or sets the placeholder text for the input field.
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
    /// Gets or sets optional content displayed below the input to provide help or context.
    /// </summary>
    [Parameter]
    public RenderFragment? FieldHelp { get; set; }

    /// <summary>
    /// Gets the attributes to be passed to the input component, excluding the 'class' attribute.
    /// </summary>
    protected Dictionary<string, object> InputAttributes => AdditionalAttributes?
        .Where(kvp => kvp.Key.ToLowerInvariant() != "class")
        .ToDictionary(kvp => kvp.Key, kvp => kvp.Value) ?? new Dictionary<string, object>();

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
    protected override TvDescriptor<RzComponent<RzNumberFieldSlots>, RzNumberFieldSlots> GetDescriptor() => Theme.RzNumberField;
}