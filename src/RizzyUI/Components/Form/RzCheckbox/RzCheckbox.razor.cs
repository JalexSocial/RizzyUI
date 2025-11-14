using TailwindVariants.NET;

namespace RizzyUI;

public partial class RzCheckbox : InputBase<bool, RzCheckbox.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
    );

    private RzInputCheckboxBase? _elem;

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCheckbox;

    public new sealed partial class Slots : ISlots
    {
        [Slot("checkbox")]
        public string? Base { get; set; }
    }
}