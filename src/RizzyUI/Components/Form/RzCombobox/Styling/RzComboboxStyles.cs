
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for the RzCombobox component.
/// </summary>
public interface IHasRzComboboxStylingProperties
{
    /// <summary>
    /// Indicates if the combobox is in an invalid state (validation error).
    /// </summary>
    public bool Invalid { get; }
}

/// <summary>
/// Defines the slots available for styling in the RzCombobox component.
/// </summary>
public sealed partial class RzComboboxSlots : ISlots
{
    /// <summary>
    /// The base slot for the component wrapper.
    /// </summary>
    [Slot("combobox")]
    public string? Base { get; set; }

    /// <summary>
    /// The slot for the inner select element.
    /// </summary>
    [Slot("select")]
    public string? Select { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the RzCombobox component.
/// </summary>
public static class RzComboboxStyles
{
    /// <summary>
    /// The default TvDescriptor for the RzCombobox component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzComboboxSlots>, RzComboboxSlots> DefaultDescriptor = new(
        @base: "w-full relative group/combobox",
        slots: new()
        {
            [s => s.Select] = "w-full"
        },
        variants: new()
        {
            [c => ((IHasRzComboboxStylingProperties)c).Invalid] = new Variant<bool, RzComboboxSlots>
            {
                [true] = new() { [s => s.Base] = "[&_.ts-control]:!border-destructive [&_.ts-control]:!ring-destructive/20" }
            }
        }
    );
}