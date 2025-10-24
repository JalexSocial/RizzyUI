
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for a Field component.
/// </summary>
public interface IHasFieldStylingProperties
{
    /// <summary>
    /// Gets the orientation of the field.
    /// </summary>
    public FieldOrientation Orientation { get; }
}

/// <summary>
/// Defines the slots available for styling in the Field component.
/// </summary>
public sealed partial class FieldSlots : ISlots
{
    /// <summary>
    /// The base slot for the main field container.
    /// </summary>
    [Slot("field")]
    public string? Base { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the Field component.
/// </summary>
public static class FieldStyles
{
    /// <summary>
    /// The default TvDescriptor for the Field component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<FieldSlots>, FieldSlots> DefaultDescriptor = new(
        @base: "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
        variants: new()
        {
            [c => ((IHasFieldStylingProperties)c).Orientation] = new Variant<FieldOrientation, FieldSlots>
            {
                [FieldOrientation.Vertical] = "flex-col [&>*]:w-full [&>.sr-only]:w-auto",
                [FieldOrientation.Horizontal] = "flex-row items-center [&>[data-slot=field-label]]:flex-auto has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
                [FieldOrientation.Responsive] = "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto @md/field-group:[&>[data-slot=field-label]]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
            }
        }
    );
}