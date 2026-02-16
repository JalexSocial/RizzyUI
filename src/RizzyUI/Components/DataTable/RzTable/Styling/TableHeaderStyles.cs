using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the TableHeader component.
/// </summary>
public sealed partial class TableHeaderSlots : ISlots
{
    /// <summary>
    /// The base slot for the `&lt;thead&gt;` element.
    /// </summary>
    [Slot("table-header")]
    public string? Base { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the TableHeader component.
/// </summary>
public static class TableHeaderStyles
{
    /// <summary>
    /// The default TvDescriptor for the TableHeader component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<TableHeaderSlots>, TableHeaderSlots> DefaultDescriptor = new(
        @base: "[&_tr]:border-b",
        variants: new()
        {
            [c => ((IHasTableHeaderStylingProperties)c).FixedHeader] = new Variant<bool, TableHeaderSlots>
            {
                [true] = new() { [s => s.Base] = "sticky top-0 z-10 bg-card" }
            }
        }
    );
}
