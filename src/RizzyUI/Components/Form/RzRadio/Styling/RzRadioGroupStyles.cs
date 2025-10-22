
using TailwindVariants.NET;

namespace RizzyUI;

public sealed partial class RzRadioGroupSlots : ISlots
{
    public string? Base { get; set; }
}

public static class RzRadioGroupStyles
{
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