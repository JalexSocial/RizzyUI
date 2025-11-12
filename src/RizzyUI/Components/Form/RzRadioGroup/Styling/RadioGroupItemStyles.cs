
using TailwindVariants.NET;

namespace RizzyUI;

public interface IHasRadioGroupItemStylingProperties 
{
    public bool Disabled { get; }
}

public sealed partial class RadioGroupItemSlots : ISlots
{
    [Slot("radio-group-item")]
    public string? Base { get; set; }

    [Slot("input")]
    public string? Input { get; set; }
}

public static class RadioGroupItemStyles
{
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