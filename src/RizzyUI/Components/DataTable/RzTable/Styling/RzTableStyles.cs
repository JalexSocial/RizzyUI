using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines styling properties for an RzTable component.
/// </summary>
public interface IHasTableStylingProperties
{
    /// <summary>
    /// Gets a value indicating whether the table header should be fixed.
    /// </summary>
    public bool FixedHeader { get; }
}

/// <summary>
/// Defines the slots available for styling in the RzTable component.
/// </summary>
public sealed partial class RzTableSlots : ISlots
{
    /// <summary>
    /// The base slot for the main table container.
    /// </summary>
    [Slot("table")]
    public string? Base { get; set; }

    /// <summary>
    /// The slot for the `&lt;table&gt;` element itself.
    /// </summary>
    [Slot("table-element")]
    public string? Table { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the RzTable component.
/// </summary>
public static class RzTableStyles
{
    /// <summary>
    /// The default TvDescriptor for the RzTable component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzTableSlots>, RzTableSlots> DefaultDescriptor = new(
        @base: "relative w-full overflow-x-auto rounded-lg border",
        slots: new()
        {
            [s => s.Table] = "w-full caption-bottom text-sm"
        },
        variants: new()
        {
            [c => ((IHasTableStylingProperties)c).FixedHeader] = new Variant<bool, RzTableSlots>
            {
                [true] = new()
                {
                    [s => s.Base] = "relative overflow-y-auto"
                }
            }
        }
    );
}
