#pragma warning disable CS1591

using TailwindVariants.NET;

namespace RizzyUI;

public interface IHasRadioGroupStylingProperties
{
    /// <summary>
    /// Orientation (horizontal or vertical) of radio group
    /// </summary>
    Orientation Orientation { get; set; }
}

public sealed partial class RzRadioGroupSlots : ISlots
{
    [Slot("radio-group")]
    public string? Base { get; set; }
}

public static class RzRadioGroupStyles
{
    public static readonly TvDescriptor<RzComponent<RzRadioGroupSlots>, RzRadioGroupSlots> DefaultDescriptor = new(
        @base: "gap-2",
        variants: new()
        {
            [c => ((IHasRadioGroupStylingProperties)c).Orientation] = new Variant<Orientation, RzRadioGroupSlots>
            {
                [Orientation.Horizontal] = new() { [s => s.Base] = "flex flex-row space-x-4" },
                [Orientation.Vertical] = new() { [s => s.Base] = "grid" },
            }
        }
    );
}