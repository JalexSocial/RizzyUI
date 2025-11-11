
using TailwindVariants.NET;

namespace RizzyUI;

public interface IHasRadioGroupStylingProperties { }

public sealed partial class RzRadioGroupSlots : ISlots
{
    [Slot("radio-group")]
    public string? Base { get; set; }
}

public static class RzRadioGroupStyles
{
    public static readonly TvDescriptor<RzComponent<RzRadioGroupSlots>, RzRadioGroupSlots> DefaultDescriptor = new(
        @base: "grid gap-3"
    );
}