
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
    /// <summary>
    /// The slot for the `&lt;thead&gt;` element.
    /// </summary>
    [Slot("table-thead")]
    public string? Thead { get; set; }
    /// <summary>
    /// The slot for the `&lt;tfoot&gt;` element.
    /// </summary>
    [Slot("table-tfoot")]
    public string? Tfoot { get; set; }
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
            [s => s.Table] = "w-full caption-bottom text-sm",
            [s => s.Thead] = "[&_tr]:border-b",
            [s => s.Tfoot] = "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0"
        },
        variants: new()
        {
            [c => ((IHasTableStylingProperties)c).FixedHeader] = new Variant<bool, RzTableSlots>
            {
                [true] = new()
                {
                    [s => s.Base] = "relative overflow-y-auto",
                    [s => s.Thead] = "sticky top-0 z-10 bg-card",
                    [s => s.Tfoot] = "sticky bottom-0 z-10 bg-muted/50"
                }
            }
        }
    );
}