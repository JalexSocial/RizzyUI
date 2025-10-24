
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the RzFieldLabel component.
/// </summary>
public sealed partial class RzFieldLabelSlots : ISlots
{
    /// <summary>
    /// The base slot for the `&lt;label&gt;` element.
    /// </summary>
    public string? Base { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the RzFieldLabel component.
/// </summary>
public static class RzFieldLabelStyles
{
    /// <summary>
    /// The default TvDescriptor for the RzFieldLabel component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzFieldLabelSlots>, RzFieldLabelSlots> DefaultDescriptor = new(
        @base: "text-sm leading-none font-medium peer-disabled:opacity-50"
    );
}