
using TailwindVariants.NET;

namespace RizzyUI;

public partial class RzCommandSeparator : RzComponent<RzCommandSeparator.Slots>
{
    public static readonly TvDescriptor<RzComponent<Slots>, Slots> DefaultDescriptor = new(
        @base: "-mx-1 my-1 h-px bg-border"
    );

    protected override TvDescriptor<RzComponent<Slots>, Slots> GetDescriptor() => Theme.RzCommandSeparator;

    public sealed partial class Slots : ISlots
    {
        public string? Base { get; set; }
    }
}