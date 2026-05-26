using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Marker interface for DataTable styling integration.
/// </summary>
public interface IHasRzDataTableStylingProperties
{
}

/// <summary>
/// Defines DataTable styling slots.
/// </summary>
public sealed partial class RzDataTableSlots : ISlots
{
    /// <summary>
    /// Base slot for the DataTable root element.
    /// </summary>
    [Slot("datatable")]
    public string? Base { get; set; }
}

/// <summary>
/// Provides the default descriptor for DataTable.
/// </summary>
public static class RzDataTableStyles
{
    /// <summary>
    /// Default descriptor for the unstyled DataTable shell.
    /// </summary>
    public static readonly TvDescriptor<RzComponent<RzDataTableSlots>, RzDataTableSlots> DefaultDescriptor = new(
        @base: "not-prose"
    );
}
