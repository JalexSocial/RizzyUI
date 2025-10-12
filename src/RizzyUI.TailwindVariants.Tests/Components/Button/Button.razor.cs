namespace RizzyUI.TailwindVariants.Tests.Components.Button;

public partial class Button : ISlotted<Button.Slots>
{
    private static readonly TvDescriptor<Button, Slots> _button = new
    (
        @base: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
        slots: new()
        {
            [b => b.Icon] = "mr-2 -ml-1",
            [b => b.Spinner] = "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 animate-spin",
        },
        variants: new()
        {
            [b => b.Variant] = new Variant<Variants, Slots>()
            {
                [Variants.Solid] = "bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-100",
                [Variants.Outline] = "border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800",
                [Variants.Ghost] = "hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100",
                [Variants.Link] = "underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent",
            },
            [b => b.Size] = new Variant<Sizes, Slots>()
            {
                [Sizes.Small] = "h-9 px-3 rounded-md",
                [Sizes.Medium] = "h-10 px-4 rounded-md",
                [Sizes.Large] = "h-11 px-6 rounded-md",
            },
            [b => b.FullWidth] = new Variant<bool, Slots>()
            {
                [true] = "w-full",
            },
            [b => b.Loading] = new Variant<bool, Slots>()
            {
                [true] = "relative text-transparent hover:text-transparent disabled:pointer-events-none",
            },
            [b => b.IconOnly] = new Variant<bool, Slots>()
            {
                [true] = new()
                {
                    [s => s.Base] = "aspect-square p-0",
                    [s => s.Icon] = "m-0"
                }
            }
        },
        compoundVariants:
        [
            new(b => b.Variant == Variants.Ghost && b.Size == Sizes.Small)
            {
                Class = "px-2",
            },
        ]
    );

    private SlotsMap<Slots> _slots = new();

    public enum Sizes
    { Small, Medium, Large, }

    public enum Variants
    { Solid, Outline, Ghost, Link, }

    protected override void OnParametersSet()
    {
        _slots = Tv.Invoke(this, _button);
    }

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? Icon { get; set; }
        public string? Spinner { get; set; }
    }
}