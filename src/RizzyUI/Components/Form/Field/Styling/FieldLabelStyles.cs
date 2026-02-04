
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a FieldLabel component.
/// </summary>
public interface IHasFieldLabelStylingProperties { }

/// <summary>
/// Defines the slots available for styling in the FieldLabel component.
/// </summary>
public sealed partial class FieldLabelSlots : ISlots
{
    /// <summary>
    /// The base slot for the component's root element.
    /// </summary>
    [Slot("field-label")]
    public string? Base { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the FieldLabel component.
/// </summary>
public static class FieldLabelStyles
{
    /// <summary>
    /// The default TvDescriptor for the FieldLabel component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<FieldLabelSlots>, FieldLabelSlots> DefaultDescriptor = new(
        @base: "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    );
}