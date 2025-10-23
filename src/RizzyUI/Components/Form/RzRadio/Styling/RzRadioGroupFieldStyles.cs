
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the RzRadioGroupField component.
/// </summary>
public sealed partial class RzRadioGroupFieldSlots : ISlots
{
    /// <summary>
    /// The base slot for the main field container.
    /// </summary>
    public string? Base { get; set; }
    /// <summary>
    /// The slot for the inner radio group wrapper.
    /// </summary>
    public string? GroupWithinField { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the RzRadioGroupField component.
/// </summary>
public static class RzRadioGroupFieldStyles
{
    /// <summary>
    /// The default TvDescriptor for the RzRadioGroupField component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzRadioGroupFieldSlots>, RzRadioGroupFieldSlots> DefaultDescriptor = new(
        slots: new()
        {
            [s => s.GroupWithinField] = "mt-1"
        }
    );
}