
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the TableCell component.
/// </summary>
public sealed partial class TableCellSlots : ISlots
{
    /// <summary>
    /// The base slot for the `&lt;td&gt;` element.
    /// </summary>
    public string? Base { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the TableCell component.
/// </summary>
public static class TableCellStyles
{
    /// <summary>
    /// The default TvDescriptor for the TableCell component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<TableCellSlots>, TableCellSlots> DefaultDescriptor = new(
        @base: "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
    );
}