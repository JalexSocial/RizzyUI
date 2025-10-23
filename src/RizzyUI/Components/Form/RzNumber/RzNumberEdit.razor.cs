
using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a NumberEdit component.
/// </summary>
public interface IHasNumberEditStylingProperties
{
    /// <summary>
    /// Gets the text to prepend to the input.
    /// </summary>
    public string? PrependText { get; }
    /// <summary>
    /// Gets the icon to prepend to the input.
    /// </summary>
    public SvgIcon? PrependIcon { get; }
}

/// <xmldoc>
///     Represents a customizable number input component, potentially used within an <see cref="RzNumberField{TValue}" />.
///     Supports prepended text or icons and binding to numeric types. Styling is determined by the active
///     <see cref="RzTheme" />.
/// </xmldoc>
public partial class RzNumberEdit<TValue> : RzComponent<RzNumberEditSlots>, IHasNumberEditStylingProperties
{
    private RzInputNumber<TValue>? _elem;
    private string _placeholder = string.Empty;
    private TValue _value = default!;

    /// <summary>
    /// Gets or sets the cascading EditContext.
    /// </summary>
    [CascadingParameter]
    public EditContext? EditContext { get; set; }

    /// <summary>
    /// Gets or sets the expression that identifies the bound value. This is a required parameter.
    /// </summary>
    [Parameter, EditorRequired]
    public required Expression<Func<TValue>> For { get; set; }

    /// <summary>
    /// Gets or sets the placeholder text for the input field.
    /// </summary>
    [Parameter]
    public string Placeholder { get; set; } = string.Empty;

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
    /// Gets a reference to the underlying RzInputNumber component.
    /// </summary>
    public RzInputNumber<TValue> InputNumberRef => _elem ?? throw new InvalidOperationException("RzInputNumber reference is not set.");

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
    protected override void OnParametersSet()
    {
        base.OnParametersSet();

        _placeholder = Placeholder;
        if (AdditionalAttributes is not null && AdditionalAttributes.TryGetValue("placeholder", out var ph) &&
            ph is string phStr) _placeholder = phStr;

        _value = For!.Compile().Invoke();

        if (!string.IsNullOrEmpty(PrependText) && PrependIcon != null)
            throw new InvalidOperationException(
                $"{nameof(PrependText)} and {nameof(PrependIcon)} cannot both be set at the same time.");
    }

    /// <inheritdoc/>
    protected override TvDescriptor<RzComponent<RzNumberEditSlots>, RzNumberEditSlots> GetDescriptor() => Theme.RzNumberEdit;
}