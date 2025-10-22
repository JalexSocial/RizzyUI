
using TailwindVariants.NET;

namespace RizzyUI;

public sealed partial class RzCheckboxGroupFieldSlots : ISlots
{
    public string? Base { get; set; }
    public string? GroupWithinField { get; set; }
}

public static class RzCheckboxGroupFieldStyles
{
    public static readonly TvDescriptor<RzComponent<RzCheckboxGroupFieldSlots>, RzCheckboxGroupFieldSlots> DefaultDescriptor = new(
        slots: new()
        {
            [s => s.GroupWithinField] = "flex flex-col gap-2"
        }
    );
}