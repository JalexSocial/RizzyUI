
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
        @base: "relative peer appearance-none border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:size-2 before:rounded-full before:bg-primary before:opacity-0 before:transition-opacity checked:border-primary checked:before:opacity-100 dark:checked:border-primary dark:checked:before:bg-primary checked:bg-transparent bg-transparent"
    );
}