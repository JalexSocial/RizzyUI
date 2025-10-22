
using TailwindVariants.NET;

namespace RizzyUI;

public sealed partial class RzFieldLabelSlots : ISlots
{
    public string? Base { get; set; }
}

public static class RzFieldLabelStyles
{
    public static readonly TvDescriptor<RzComponent<RzFieldLabelSlots>, RzFieldLabelSlots> DefaultDescriptor = new(
        @base: "text-sm leading-none font-medium peer-disabled:opacity-50"
    );
}