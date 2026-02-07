using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Exposes styling state consumed by <see cref="RadioGroupItemStyles"/> variants.
/// </summary>
public interface IHasRadioGroupItemStylingProperties
{
    /// <summary>
    /// Gets a value indicating whether the item is disabled.
    /// </summary>
    public bool Disabled { get; }
}

/// <summary>
/// Slot definitions for <see cref="RadioGroupItem{TValue}"/>.
/// </summary>
public sealed partial class RadioGroupItemSlots : ISlots
{
    /// <summary>
    /// Gets or sets classes for the radio item container.
    /// </summary>
    [Slot("radio-group-item")]
    public string? Base { get; set; }

    /// <summary>
    /// Gets or sets classes for the hidden input element.
    /// </summary>
    [Slot("input")]
    public string? Input { get; set; }
}

/// <summary>
/// Default style configuration for <see cref="RadioGroupItem{TValue}"/>.
/// </summary>
public static class RadioGroupItemStyles
{
    /// <summary>
    /// Gets the default Tailwind Variants descriptor for radio group items.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RadioGroupItemSlots>, RadioGroupItemSlots> DefaultDescriptor = new(
        @base: "group relative flex items-center gap-3 cursor-pointer",
        slots: new()
        {
            [s => s.Input] = "peer sr-only"
        },
        variants: new()
        {
            [c => ((IHasRadioGroupItemStylingProperties)c).Disabled] = new Variant<bool, RadioGroupItemSlots>
            {
                [true] = new() { [s => s.Base] = "cursor-not-allowed opacity-50" }
            }
        }
    );
}