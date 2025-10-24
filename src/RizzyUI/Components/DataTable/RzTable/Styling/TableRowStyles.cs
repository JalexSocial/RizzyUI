
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the TableRow component.
/// </summary>
public sealed partial class TableRowSlots : ISlots
{
    /// <summary>
    /// The base slot for the `&lt;tr&gt;` element.
    /// </summary>
    public string? Base { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the TableRow component.
/// </summary>
public static class TableRowStyles
{
    /// <summary>
    /// The default TvDescriptor for the TableRow component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<TableRowSlots>, TableRowSlots> DefaultDescriptor = new(
        @base: "border-b transition-colors",
        variants: new()
        {
            [c => ((IHasTableRowStylingProperties)c).IsEven] = new Variant<bool, TableRowSlots>
            {
                [true] = "bg-secondary",
                [false] = "bg-background"
            },
            [c => ((IHasTableRowStylingProperties)c).IsHoverable] = new Variant<bool, TableRowSlots>
            {
                [true] = "hover:bg-muted/50"
            }
        }
    );
}