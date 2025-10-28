
using Microsoft.AspNetCore.Components;
using TailwindVariants.NET;

namespace RizzyUI;

public partial class RzCommandInput : RzComponent<RzCommandInput.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "flex h-9 items-center gap-2 border-b px-3",
        slots: new()
        {
            [s => s.Icon] = "size-4 shrink-0 opacity-50",
            [s => s.Input] = "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
        }
    );

    [CascadingParameter]
    protected RzCommand? ParentCommand { get; set; }

    protected override void OnInitialized()
    {
        base.OnInitialized();
        if (ParentCommand == null)
            throw new InvalidOperationException($"{nameof(RzCommandInput)} must be used within an {nameof(RzCommand)}.");
    }

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCommandInput;

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
        public string? Icon { get; set; }
        public string? Input { get; set; }
    }
}