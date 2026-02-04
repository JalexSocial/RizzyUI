
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a CheckboxGroupItem component.
/// </summary>
public interface IHasCheckboxGroupItemStylingProperties
{
    /// <summary>
    /// Gets whether the item is disabled.
    /// </summary>
    public bool Disabled { get; }
}

/// <summary>
/// Defines the slots available for styling in the RzCheckboxGroupItem component.
/// </summary>
public sealed partial class RzCheckboxGroupItemSlots : ISlots
{
    /// <summary>
    /// The base slot for the main label container.
    /// </summary>
    [Slot("checkbox-group-item")]
    public string? Base { get; set; }

    /// <summary>
    /// The slot for the hidden input element.
    /// </summary>
    [Slot("input")]
    public string? Input { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the RzCheckboxGroupItem component.
/// </summary>
public static class RzCheckboxGroupItemStyles
{
    /// <summary>
    /// The default TvDescriptor for the RzCheckboxGroupItem component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzCheckboxGroupItemSlots>, RzCheckboxGroupItemSlots> DefaultDescriptor = new(
        @base: "group relative flex items-center gap-3 cursor-pointer",
        slots: new()
        {
            [s => s.Input] = "peer sr-only"
        },
        variants: new()
        {
            [c => ((IHasCheckboxGroupItemStylingProperties)c).Disabled] = new Variant<bool, RzCheckboxGroupItemSlots>
            {
                [true] = new() { [s => s.Base] = "cursor-not-allowed opacity-50" }
            }
        }
    );
}