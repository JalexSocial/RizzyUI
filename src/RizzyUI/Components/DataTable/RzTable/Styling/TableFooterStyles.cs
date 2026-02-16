using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the TableFooter component.
/// </summary>
public sealed partial class TableFooterSlots : ISlots
{
    /// <summary>
    /// The base slot for the `&lt;tfoot&gt;` element.
    /// </summary>
    [Slot("table-footer")]
    public string? Base { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the TableFooter component.
/// </summary>
public static class TableFooterStyles
{
    /// <summary>
    /// The default TvDescriptor for the TableFooter component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<TableFooterSlots>, TableFooterSlots> DefaultDescriptor = new(
        @base: "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        variants: new()
        {
            [c => ((IHasTableFooterStylingProperties)c).FixedHeader] = new Variant<bool, TableFooterSlots>
            {
                [true] = new() { [s => s.Base] = "sticky bottom-0 z-10 bg-muted/50 [&>tr]:last:border-b-0" }
            }
        }
    );
}
