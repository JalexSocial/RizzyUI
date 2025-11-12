
using TailwindVariants.NET;

namespace RizzyUI;

public interface IHasRadioGroupItemStylingProperties { }

public sealed partial class RadioGroupItemSlots : ISlots
{
    [Slot("radio-group-item")]
    public string? Base { get; set; }

    [Slot("input")]
    public string? Input { get; set; }

    [Slot("label")]
    public string? Label { get; set; }

    [Slot("indicator-wrapper")]
    public string? IndicatorWrapper { get; set; }

    [Slot("indicator")]
    public string? Indicator { get; set; }
}

public static class RadioGroupItemStyles
{
    public static readonly TvDescriptor<RzComponent<RadioGroupItemSlots>, RadioGroupItemSlots> DefaultDescriptor = new(
        @base: "relative flex items-center gap-3 cursor-pointer",
        slots: new()
        {
            [s => s.Input] = "peer sr-only",
            [s => s.Label] = "text-sm font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            [s => s.IndicatorWrapper] = "relative flex size-4 shrink-0 items-center justify-center rounded-full border border-input bg-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-checked:border-primary peer-checked:[&_[data-slot=indicator]]:opacity-100",
            [s => s.Indicator] = "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-primary opacity-0 transition-opacity"
        }
    );
}