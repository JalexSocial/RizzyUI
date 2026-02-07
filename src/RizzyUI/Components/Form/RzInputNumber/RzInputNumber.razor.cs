using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Numeric input component with RizzyUI styling and validation integration.
/// </summary>
/// <typeparam name="TValue">The numeric value type.</typeparam>
public partial class RzInputNumber<TValue> : InputBase<TValue, RzInputNumberSlots>, IHasInputNumberStylingProperties
{
    private RzInputNumberBase<TValue>? _elem;

    /// <summary>
    /// Gets or sets placeholder text for the input element.
    /// </summary>
    [Parameter] public string? Placeholder { get; set; }

    /// <inheritdoc />
    protected override TvDescriptor<RzComponent<RzInputNumberSlots>, RzInputNumberSlots> GetDescriptor() => Theme.RzInputNumber;
}