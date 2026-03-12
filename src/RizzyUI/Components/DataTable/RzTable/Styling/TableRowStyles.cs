using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the TableRow component.
/// </summary>
public sealed partial class TableRowSlots : ISlots
{
    /// <summary>
    /// The base slot for the <c>tr</c> element.
    /// </summary>
    [Slot("table-row")]
    public string? Base { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the TableRow component.
/// </summary>
public static class TableRowStyles
{
    /// <summary>
    /// The default descriptor for row styling.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<TableRowSlots>, TableRowSlots> DefaultDescriptor = new(
        @base: "border-b transition-colors data-[state=selected]:bg-muted",
        variants: new()
        {
            [c => ((IHasTableRowStylingProperties)c).Hoverable] = new Variant<bool, TableRowSlots>
            {
                [true] = new() { [s => s.Base] = "hover:bg-muted/50" }
            },
            [c => ((IHasTableRowStylingProperties)c).IsSelected] = new Variant<bool, TableRowSlots>
            {
                [true] = new() { [s => s.Base] = "bg-muted hover:bg-muted" }
            }
        }
    );
}
