using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Exposes styling state consumed by <see cref="RzRadioGroupStyles"/> variants.
/// </summary>
public interface IHasRadioGroupStylingProperties
{
    /// <summary>
    /// Gets or sets the group orientation (horizontal or vertical).
    /// </summary>
    Orientation Orientation { get; set; }
}

/// <summary>
/// Slot definitions for <see cref="RzRadioGroup{TValue}"/>.
/// </summary>
public sealed partial class RzRadioGroupSlots : ISlots
{
    /// <summary>
    /// Gets or sets classes for the group container.
    /// </summary>
    [Slot("radio-group")]
    public string? Base { get; set; }
}

/// <summary>
/// Default style configuration for <see cref="RzRadioGroup{TValue}"/>.
/// </summary>
public static class RzRadioGroupStyles
{
    /// <summary>
    /// Gets the default Tailwind Variants descriptor for radio groups.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzRadioGroupSlots>, RzRadioGroupSlots> DefaultDescriptor = new(
        @base: "gap-2",
        variants: new()
        {
            [c => ((IHasRadioGroupStylingProperties)c).Orientation] = new Variant<Orientation, RzRadioGroupSlots>
            {
                [Orientation.Horizontal] = new() { [s => s.Base] = "flex flex-row space-x-4" },
                [Orientation.Vertical] = new() { [s => s.Base] = "grid" },
            }
        }
    );
}