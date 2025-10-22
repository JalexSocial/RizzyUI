
using TailwindVariants.NET;

namespace RizzyUI;

public sealed partial class RzCheckboxGroupSlots : ISlots
{
    public string? Base { get; set; }
}

public static class RzCheckboxGroupStyles
{
    public static readonly TvDescriptor<RzComponent<RzCheckboxGroupSlots>, RzCheckboxGroupSlots> DefaultDescriptor = new(
        @base: "flex flex-wrap gap-3",
        variants: new()
        {
            [c => ((IHasCheckboxGroupStylingProperties)c).Orientation] = new Variant<Orientation, RzCheckboxGroupSlots>
            {
                [Orientation.Horizontal] = "flex-row items-center",
                [Orientation.Vertical] = "flex-col"
            }
        }
    );
}