
using TailwindVariants.NET;

namespace RizzyUI;

public sealed partial class RzRadioGroupFieldSlots : ISlots
{
    public string? Base { get; set; }
    public string? GroupWithinField { get; set; }
}

public static class RzRadioGroupFieldStyles
{
    public static readonly TvDescriptor<RzComponent<RzRadioGroupFieldSlots>, RzRadioGroupFieldSlots> DefaultDescriptor = new(
        slots: new()
        {
            [s => s.GroupWithinField] = "mt-1"
        }
    );
}