
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the RzRadioGroup component.
/// </summary>
public sealed partial class RzRadioGroupSlots : ISlots
{
    /// <summary>
    /// The base slot for the main group container.
    /// </summary>
    public string? Base { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the RzRadioGroup component.
/// </summary>
public static class RzRadioGroupStyles
{
    /// <summary>
    /// The default TvDescriptor for the RzRadioGroup component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzRadioGroupSlots>, RzRadioGroupSlots> DefaultDescriptor = new(
        @base: "grid gap-3",
        variants: new()
        {
            [c => ((IHasRadioGroupStylingProperties)c).Orientation] = new Variant<Orientation, RzRadioGroupSlots>
            {
                [Orientation.Horizontal] = "grid-cols-4", // Example, can be adjusted
                [Orientation.Vertical] = "grid-cols-1"
            }
        }
    );
}