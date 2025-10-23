
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the RzCheckboxGroup component.
/// </summary>
public sealed partial class RzCheckboxGroupSlots : ISlots
{
    /// <summary>
    /// The base slot for the main group container.
    /// </summary>
    public string? Base { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the RzCheckboxGroup component.
/// </summary>
public static class RzCheckboxGroupStyles
{
    /// <summary>
    /// The default TvDescriptor for the RzCheckboxGroup component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzCheckboxGroupSlots>, RzCheckboxGroupSlots> DefaultDescriptor = new(
        @base: "flex flex-wrap gap-3",
        variants: new()
        {
            [c => ((IHasCheckboxGroupStylingProperties)c).Orientation] = new Variant<Orientation, RzCheckboxGroupSlots>
            {
                [Orientation.Horizontal] = "flex-row items-center",
                [Orientation.Vertical] = "flex-col"
            }
        }
    );
}