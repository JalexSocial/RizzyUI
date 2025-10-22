
using TailwindVariants.NET;

namespace RizzyUI;

public sealed partial class RzNumberFieldSlots : ISlots
{
    public string? Base { get; set; }
}

public static class RzNumberFieldStyles
{
    public static readonly TvDescriptor<RzComponent<RzNumberFieldSlots>, RzNumberFieldSlots> DefaultDescriptor = new();
}