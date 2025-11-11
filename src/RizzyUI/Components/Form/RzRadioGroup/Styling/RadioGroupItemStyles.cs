
using TailwindVariants.NET;

namespace RizzyUI;

public interface IHasRadioGroupItemStylingProperties { }

public sealed partial class RadioGroupItemSlots : ISlots
{
    [Slot("radio-group-item")]
    public string? Base { get; set; }
}

public static class RadioGroupItemStyles
{
    public static readonly TvDescriptor<RzComponent<RadioGroupItemSlots>, RadioGroupItemSlots> DefaultDescriptor = new(
        @base: "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
    );
}