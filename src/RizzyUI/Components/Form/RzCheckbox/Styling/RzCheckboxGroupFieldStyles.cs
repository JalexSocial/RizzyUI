
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the RzCheckboxGroupField component.
/// </summary>
public sealed partial class RzCheckboxGroupFieldSlots : ISlots
{
    /// <summary>
    /// The base slot for the main field container.
    /// </summary>
    public string? Base { get; set; }
    /// <summary>
    /// The slot for the inner checkbox group wrapper.
    /// </summary>
    public string? GroupWithinField { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the RzCheckboxGroupField component.
/// </summary>
public static class RzCheckboxGroupFieldStyles
{
    /// <summary>
    /// The default TvDescriptor for the RzCheckboxGroupField component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzCheckboxGroupFieldSlots>, RzCheckboxGroupFieldSlots> DefaultDescriptor = new(
        slots: new()
        {
            [s => s.GroupWithinField] = "flex flex-col gap-2"
        }
    );
}