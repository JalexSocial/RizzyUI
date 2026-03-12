using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the TablePagination component.
/// </summary>
public sealed partial class TablePaginationSlots : ISlots
{
    /// <summary>
    /// The base slot for the pagination container.
    /// </summary>
    [Slot("table-pagination")]
    public string? Base { get; set; }
}

/// <summary>
/// Provides the default styling descriptor for the TablePagination component.
/// </summary>
public static class TablePaginationStyles
{
    /// <summary>
    /// The default TvDescriptor for the TablePagination component.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<TablePaginationSlots>, TablePaginationSlots> DefaultDescriptor = new(
        @base: "flex items-center justify-center"
    );
}
