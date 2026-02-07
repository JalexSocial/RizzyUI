#pragma warning disable CS1591

using TailwindVariants.NET;

namespace RizzyUI;

public interface IHasInputNumberStylingProperties { }

public sealed partial class RzInputNumberSlots : ISlots
{
    [Slot("input")]
    public string? Base { get; set; }
}

public static class RzInputNumberStyles
{
    public static readonly TvDescriptor<RzComponent<RzInputNumberSlots>, RzInputNumberSlots> DefaultDescriptor = new(
        extends: FormInputStyles.DefaultDescriptor
    );
}