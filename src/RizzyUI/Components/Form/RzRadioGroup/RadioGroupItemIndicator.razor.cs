
using TailwindVariants.NET;

namespace RizzyUI;

public partial class RadioGroupItemIndicator : RzComponent<RadioGroupItemIndicator.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "relative flex size-4 shrink-0 items-center justify-center rounded-full border border-input bg-background group-has-[.peer:focus-visible]:ring-2 group-has-[.peer:focus-visible]:ring-ring group-has-[.peer:focus-visible]:ring-offset-2 group-has-[.peer:checked]:border-primary",
        slots: new()
        {
            [s => s.Dot] = "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-primary opacity-0 transition-opacity group-has-[.peer:checked]:opacity-100"
        }
    );

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RadioGroupItemIndicator;

    public sealed partial class Slots : ISlots
    {
        [Slot("indicator-wrapper")]
        public string? Base { get; set; }

        [Slot("indicator")]
        public string? Dot { get; set; }
    }
}