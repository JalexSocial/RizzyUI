using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Marker interface for components that use input-number styling.
/// </summary>
public interface IHasInputNumberStylingProperties { }

/// <summary>
/// Slot definitions for <see cref="RzInputNumber{TValue}"/> styles.
/// </summary>
public sealed partial class RzInputNumberSlots : ISlots
{
    /// <summary>
    /// Gets or sets the base classes for the input element.
    /// </summary>
    [Slot("input")]
    public string? Base { get; set; }
}

/// <summary>
/// Default style configuration for <see cref="RzInputNumber{TValue}"/>.
/// </summary>
public static class RzInputNumberStyles
{
    /// <summary>
    /// Gets the default Tailwind Variants descriptor for number inputs.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzInputNumberSlots>, RzInputNumberSlots> DefaultDescriptor = new(
        extends: FormInputStyles.DefaultDescriptor
    );
}