
using Blazicons;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Forms;
using RizzyUI.Extensions;
using System.Linq.Expressions;
using TailwindVariants.NET;

namespace RizzyUI;

public interface IHasNumberEditStylingProperties
{
    public string? PrependText { get; }
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

    [CascadingParameter]
    public EditContext? EditContext { get; set; }

    [Parameter, EditorRequired]
    public required Expression<Func<TValue>> For { get; set; }

    [Parameter]
    public string Placeholder { get; set; } = string.Empty;

    [Parameter]
    public string? PrependText { get; set; }

    [Parameter]
    public SvgIcon? PrependIcon { get; set; }

    public RzInputNumber<TValue> InputNumberRef => _elem ?? throw new InvalidOperationException("RzInputNumber reference is not set.");

    protected override void OnInitialized()
    {
        base.OnInitialized();

        if (For == null)
            throw new InvalidOperationException($"{GetType()} requires a value for the 'For' parameter.");
        if (EditContext == null)
            throw new InvalidOperationException($"{GetType()} must be used within an EditForm.");
    }

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

    protected override TvDescriptor<RzComponent<RzNumberEditSlots>, RzNumberEditSlots> GetDescriptor() => Theme.RzNumberEdit;
}