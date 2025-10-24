
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the TableBody component.
/// </summary>
public sealed partial class TableBodySlots : ISlots
{
    /// <summary>
    /// The base slot for the `&lt;tbody&gt;` element.
    /// </summary>
    public string? Base { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the TableBody component.
/// </summary>
public static class TableBodyStyles
{
    /// <summary>
    /// The default TvDescriptor for the TableBody component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<TableBodySlots>, TableBodySlots> DefaultDescriptor = new(
        @base: "[&_tr:last-child]:border-0"
    );
}