
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the RzNumberField component.
/// </summary>
public sealed partial class RzNumberFieldSlots : ISlots
{
    /// <summary>
    /// The base slot for the main field container.
    /// </summary>
    public string? Base { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the RzNumberField component.
/// </summary>
public static class RzNumberFieldStyles
{
    /// <summary>
    /// The default TvDescriptor for the RzNumberField component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzNumberFieldSlots>, RzNumberFieldSlots> DefaultDescriptor = new();
}