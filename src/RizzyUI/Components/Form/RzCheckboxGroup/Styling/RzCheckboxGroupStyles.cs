
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a CheckboxGroup component.
/// </summary>
public interface IHasCheckboxGroupStylingProperties
{
    /// <summary>
    /// Gets the orientation of the checkbox group.
    /// </summary>
    public Orientation Orientation { get; }
}

/// <summary>
/// Defines the slots available for styling in the RzCheckboxGroup component.
/// </summary>
public sealed partial class RzCheckboxGroupSlots : ISlots
{
    /// <summary>
    /// The base slot for the main fieldset container.
    /// </summary>
    [Slot("checkbox-group")]
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
        @base: "gap-2",
        variants: new()
        {
            [c => ((IHasCheckboxGroupStylingProperties)c).Orientation] = new Variant<Orientation, RzCheckboxGroupSlots>
            {
                [Orientation.Horizontal] = new() { [s => s.Base] = "flex flex-row space-x-4" },
                [Orientation.Vertical] = new() { [s => s.Base] = "grid" },
            }
        }
    );
}