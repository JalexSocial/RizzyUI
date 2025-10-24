
using TailwindVariants.NET;

namespace RizzyUI;

/// <summary>
/// Defines the slots available for styling in the TablePagination component.
/// </summary>
public sealed partial class TablePaginationSlots : ISlots
{
    /// <summary>
    /// The base slot for the main pagination container.
    /// </summary>
    public string? Base { get; set; }
    /// <summary>
    /// The slot for the `&lt;ul&gt;` element containing pagination links.
    /// </summary>
    public string? List { get; set; }
    /// <summary>
    /// The slot for a standard pagination link/button.
    /// </summary>
    public string? Link { get; set; }
    /// <summary>
    /// The slot for the current page link/button.
    /// </summary>
    public string? LinkCurrent { get; set; }
    /// <summary>
    /// The slot for a disabled pagination link/button.
    /// </summary>
    public string? LinkDisabled { get; set; }
    /// <summary>
    /// The slot for the ellipsis (...) element.
    /// </summary>
    public string? Ellipsis { get; set; }
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
        @base: "flex justify-center items-center",
        slots: new()
        {
            [s => s.List] = "inline-flex items-center gap-1 text-sm",
            [s => s.Link] = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer h-9 px-3 border bg-background shadow-xs dark:bg-input/30 dark:border-input hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md",
            [s => s.LinkCurrent] = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer h-9 px-3 border bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 rounded-md aria-[current=page]:z-10",
            [s => s.LinkDisabled] = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer h-9 px-3 border bg-background shadow-xs dark:bg-input/30 dark:border-input opacity-50 cursor-not-allowed rounded-md",
            [s => s.Ellipsis] = "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer h-9 px-3 border bg-background shadow-xs dark:bg-input/30 dark:border-input select-none rounded-md"
        }
    );
}